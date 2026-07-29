"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { formatCash, formatDuration, makeCouponCode } from "@/lib/format";
import { AD_REWARD, durationCash, WELCOME_CASH } from "@/lib/policy";
import { AUTO_REPLIES, type Gifticon } from "@/lib/seed";
import { isSupabaseReady, loginIdToEmail, supabase } from "@/lib/supabase";
import {
  emptyAppData,
  type Account,
  type AppData,
  type CareRequest,
  type ChatRoom,
  type Child,
} from "@/lib/types";

/**
 * 자기소개 영상은 용량이 커서 데이터베이스에 넣지 않습니다.
 * 앱이 켜져 있는 동안만 여기에 잠깐 담아둡니다. (새로고침하면 사라집니다)
 */
const videoUrls = new Map<string, string>();
export function getVideoUrl(loginId: string): string | undefined {
  return videoUrls.get(loginId);
}
export function setVideoUrl(loginId: string, url: string) {
  videoUrls.set(loginId, url);
}

type SignUpInput = {
  loginId: string;
  password: string;
  name: string;
  personality: string[];
  skills: string[];
  avatar: string | null;
  videoName: string | null;
  neighborhood: string;
  daycare: string;
  children: Child[];
};

/** 요청을 올릴 때 적는 것: 어떤 아이인지 + 어디서 + 언제 + 얼마나 */
type CreateRequestInput = {
  childId: string;
  place: string;
  note: string;
  startAt: string;
  minutes: number;
};

type AppContextValue = {
  data: AppData;
  /** 서버에서 데이터를 다 불러왔는지 */
  ready: boolean;
  /** 지금 로그인한 사람 (안 했으면 null) */
  me: Account | null;
  /** Supabase 연결이 안 돼 있으면 true */
  needsSetup: boolean;

  signUp: (input: SignUpInput) => Promise<string | null>;
  logIn: (loginId: string, password: string) => Promise<string | null>;
  logOut: () => Promise<void>;
  hideHomeGuide: () => Promise<void>;

  createRequest: (input: CreateRequestInput) => Promise<string | null>;
  acceptRequest: (id: string) => Promise<string | null>;
  completeRequest: (id: string) => Promise<void>;
  cancelMyRequest: (id: string) => Promise<void>;

  askNeighbor: (neighborName: string, condition: string) => Promise<string | null>;
  sendMessage: (roomId: string, text: string) => Promise<void>;

  watchAd: () => Promise<void>;
  buyGifticon: (item: Gifticon) => Promise<boolean>;

  markNotificationsRead: () => Promise<void>;
  resetAll: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

/** 어느 화면에서든 데이터를 꺼내 쓰는 방법:  const { data } = useApp(); */
export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp은 AppProvider 안에서만 쓸 수 있어요.");
  return value;
}

// ---------------------------------------------------------------------------
// 데이터베이스에서 온 값을 앱이 쓰는 모양으로 바꿔줍니다.
// ---------------------------------------------------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

function toAccount(row: Row, children: Row[]): Account {
  return {
    loginId: row.login_id,
    password: "", // 비밀번호는 Supabase가 보관하므로 앱은 가지고 있지 않습니다.
    name: row.name,
    personality: row.personality ?? [],
    skills: row.skills ?? [],
    avatar: row.avatar ?? null,
    videoName: row.video_name ?? null,
    neighborhood: row.neighborhood,
    daycare: row.daycare,
    children: children.map((c) => ({
      id: c.id,
      name: c.name,
      age: c.age,
      note: c.note ?? "",
    })),
    createdAt: row.created_at,
  };
}

function toRequest(row: Row, myId: string): CareRequest {
  return {
    id: row.id,
    parentName: row.parent_name,
    daycare: row.daycare,
    childName: row.child_name,
    childAge: row.child_age,
    childNote: row.child_note ?? "",
    place: row.place,
    note: row.note ?? "",
    startAt: row.start_at,
    minutes: row.minutes,
    isMine: row.parent_id === myId,
    status: row.status,
    helperName: row.helper_name ?? null,
  };
}

function toRoom(row: Row, myId: string, messages: Row[]): ChatRoom {
  const iAmParent = row.parent_id === myId;
  return {
    id: row.id,
    requestId: row.request_id ?? null,
    partnerName: iAmParent ? row.helper_name || "이웃" : row.parent_name || "이웃",
    title: row.title,
    createdAt: row.created_at,
    messages: messages.map((m) => ({
      id: m.id,
      from:
        m.kind === "system" ? "system" : m.sender_id === myId ? "me" : "other",
      text: m.text,
      at: m.created_at,
    })),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(emptyAppData);
  const [me, setMe] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => clearTimeout(t));
  }, []);

  // -------------------------------------------------------------------------
  // 서버에서 내 데이터를 통째로 다시 불러옵니다.
  // -------------------------------------------------------------------------
  const refresh = useCallback(async (uid: string) => {
    const [profileRes, childrenRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase
        .from("children")
        .select("*")
        .eq("parent_id", uid)
        .order("created_at"),
    ]);

    const profile = profileRes.data;
    if (!profile) {
      // 가입 도중 멈춘 경우 - 로그인만 되어 있고 프로필이 없습니다.
      setMe(null);
      setData(emptyAppData);
      return;
    }

    const account = toAccount(profile, childrenRes.data ?? []);

    const [requestsRes, roomsRes, logsRes, notisRes, couponsRes] =
      await Promise.all([
        // 같은 어린이집 부모님들의 요청만 봅니다.
        supabase
          .from("requests")
          .select("*")
          .eq("daycare", profile.daycare)
          .order("created_at", { ascending: false }),
        supabase
          .from("rooms")
          .select("*")
          .or(`parent_id.eq.${uid},helper_id.eq.${uid}`)
          .order("created_at", { ascending: false }),
        supabase
          .from("cash_logs")
          .select("*")
          .eq("profile_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("notifications")
          .select("*")
          .eq("profile_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("coupons")
          .select("*")
          .eq("profile_id", uid)
          .order("created_at", { ascending: false }),
      ]);

    const roomRows = roomsRes.data ?? [];
    const roomIds = roomRows.map((r) => r.id);
    const messagesRes = roomIds.length
      ? await supabase
          .from("messages")
          .select("*")
          .in("room_id", roomIds)
          .order("created_at")
      : { data: [] as Row[] };

    const messagesByRoom = new Map<string, Row[]>();
    (messagesRes.data ?? []).forEach((m: Row) => {
      const list = messagesByRoom.get(m.room_id) ?? [];
      list.push(m);
      messagesByRoom.set(m.room_id, list);
    });

    setMe(account);
    setData({
      accounts: [account],
      currentLoginId: account.loginId,
      showHomeGuide: profile.show_guide ?? false,
      cash: profile.cash ?? 0,
      requests: (requestsRes.data ?? []).map((r) => toRequest(r, uid)),
      rooms: roomRows.map((r) => toRoom(r, uid, messagesByRoom.get(r.id) ?? [])),
      cashLogs: (logsRes.data ?? []).map((l) => ({
        id: l.id,
        title: l.title,
        amount: l.amount,
        at: l.created_at,
      })),
      notifications: (notisRes.data ?? []).map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body ?? "",
        at: n.created_at,
        link: n.link ?? null,
        isNew: n.is_new,
      })),
      coupons: (couponsRes.data ?? []).map((c) => ({
        id: c.id,
        gifticonId: c.gifticon_id,
        name: c.name,
        brand: c.brand,
        code: c.code,
        boughtAt: c.created_at,
      })),
    });
  }, []);

  /** 지금 로그인한 사람 기준으로 다시 불러옵니다. */
  const reload = useCallback(async () => {
    if (!userId) return;
    await refresh(userId);
  }, [refresh, userId]);

  // -------------------------------------------------------------------------
  // 앱이 켜지면 로그인 상태를 확인합니다.
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseReady) {
      setReady(true);
      return;
    }

    let alive = true;

    supabase.auth.getSession().then(async ({ data: session }) => {
      const uid = session.session?.user.id ?? null;
      if (!alive) return;
      setUserId(uid);
      if (uid) await refresh(uid);
      if (alive) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const uid = session?.user.id ?? null;
        setUserId(uid);
        if (uid) {
          await refresh(uid);
        } else {
          setMe(null);
          setData(emptyAppData);
        }
      }
    );

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [refresh]);

  // -------------------------------------------------------------------------
  // 실시간 - 다른 사람이 요청을 올리거나 메시지를 보내면 바로 다시 불러옵니다.
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseReady || !userId) return;

    let waiting: ReturnType<typeof setTimeout> | null = null;
    const soon = () => {
      if (waiting) clearTimeout(waiting);
      waiting = setTimeout(() => void refresh(userId), 400);
    };

    const channel = supabase
      .channel("dolbwajwo")
      .on("postgres_changes", { event: "*", schema: "public", table: "requests" }, soon)
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, soon)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, soon)
      .subscribe();

    return () => {
      if (waiting) clearTimeout(waiting);
      supabase.removeChannel(channel);
    };
  }, [userId, refresh]);

  // -------------------------------------------------------------------------
  // 도우미 - 알림 / 캐시 기록 남기기
  // -------------------------------------------------------------------------
  const addNotification = useCallback(
    async (profileId: string, title: string, body: string, link: string | null) => {
      await supabase
        .from("notifications")
        .insert({ profile_id: profileId, title, body, link });
    },
    []
  );

  const changeCash = useCallback(
    async (profileId: string, current: number, amount: number, title: string) => {
      await supabase
        .from("profiles")
        .update({ cash: current + amount })
        .eq("id", profileId);
      await supabase
        .from("cash_logs")
        .insert({ profile_id: profileId, title, amount });
    },
    []
  );

  // -------------------------------------------------------------------------
  // 1) 회원가입 / 로그인
  // -------------------------------------------------------------------------
  const signUp: AppContextValue["signUp"] = useCallback(
    async (input) => {
      if (!isSupabaseReady) return "Supabase 연결 정보가 없어요.";

      // 아이디가 이미 있는지 먼저 봅니다.
      const { data: taken } = await supabase
        .from("profiles")
        .select("login_id")
        .eq("login_id", input.loginId)
        .maybeSingle();
      if (taken) return "이미 있는 아이디예요. 다른 아이디를 적어주세요.";

      const { data: auth, error } = await supabase.auth.signUp({
        email: loginIdToEmail(input.loginId),
        password: input.password,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return "이미 있는 아이디예요. 다른 아이디를 적어주세요.";
        }
        if (error.message.includes("rate limit")) {
          return "Supabase에서 확인 메일을 보내려다 막혔어요. Authentication → Sign In / Providers → Email 에서 'Confirm email'을 꺼주세요.";
        }
        return `가입에 실패했어요: ${error.message}`;
      }

      const uid = auth.user?.id;
      if (!uid) return "가입에 실패했어요. 잠시 뒤 다시 해주세요.";
      if (!auth.session) {
        return "이메일 확인이 켜져 있어요. Supabase → Authentication → Sign In / Providers → Email 에서 'Confirm email'을 꺼주세요.";
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: uid,
        login_id: input.loginId,
        name: input.name,
        personality: input.personality,
        skills: input.skills,
        avatar: input.avatar,
        video_name: input.videoName,
        neighborhood: input.neighborhood,
        daycare: input.daycare,
        cash: WELCOME_CASH,
        show_guide: true,
      });
      if (profileError) return `정보 저장에 실패했어요: ${profileError.message}`;

      if (input.children.length > 0) {
        await supabase.from("children").insert(
          input.children.map((c) => ({
            parent_id: uid,
            name: c.name,
            age: c.age,
            note: c.note,
          }))
        );
      }

      await supabase.from("cash_logs").insert({
        profile_id: uid,
        title: "가입 축하 캐시",
        amount: WELCOME_CASH,
      });
      await addNotification(
        uid,
        `${input.name} 님, 환영해요!`,
        `가입 축하 캐시 ${formatCash(WELCOME_CASH)}을 드렸어요.`,
        "/store"
      );

      setUserId(uid);
      await refresh(uid);
      return null;
    },
    [addNotification, refresh]
  );

  const logIn: AppContextValue["logIn"] = useCallback(
    async (loginId, password) => {
      if (!isSupabaseReady) return "Supabase 연결 정보가 없어요.";

      const { data: auth, error } = await supabase.auth.signInWithPassword({
        email: loginIdToEmail(loginId),
        password,
      });

      if (error) return "아이디나 비밀번호가 맞지 않아요.";
      const uid = auth.user?.id;
      if (!uid) return "로그인에 실패했어요.";

      setUserId(uid);
      await refresh(uid);
      return null;
    },
    [refresh]
  );

  const logOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setMe(null);
    setData(emptyAppData);
  }, []);

  const hideHomeGuide = useCallback(async () => {
    if (!userId) return;
    setData((prev) => ({ ...prev, showHomeGuide: false }));
    await supabase
      .from("profiles")
      .update({ show_guide: false })
      .eq("id", userId);
  }, [userId]);

  // -------------------------------------------------------------------------
  // 2) 채팅방 만들기
  // -------------------------------------------------------------------------
  const makeRoom = useCallback(
    async (input: {
      requestId: string | null;
      parentId: string;
      parentName: string;
      helperId: string | null;
      helperName: string;
      title: string;
      firstMessage: string;
    }) => {
      const { data: room, error } = await supabase
        .from("rooms")
        .insert({
          request_id: input.requestId,
          parent_id: input.parentId,
          parent_name: input.parentName,
          helper_id: input.helperId,
          helper_name: input.helperName,
          title: input.title,
        })
        .select()
        .single();

      if (error || !room) return null;

      await supabase.from("messages").insert([
        {
          room_id: room.id,
          kind: "system",
          text: "채팅방이 만들어졌어요. 만날 장소와 시간을 다시 한번 확인해 주세요.",
        },
        {
          room_id: room.id,
          sender_id: input.helperId,
          sender_name: input.helperName,
          kind: "user",
          text: input.firstMessage,
        },
      ]);

      return room.id as string;
    },
    []
  );

  // -------------------------------------------------------------------------
  // 3) 아이 맡기기 (요청 올리기) - 캐시를 먼저 냅니다
  // -------------------------------------------------------------------------
  const createRequest: AppContextValue["createRequest"] = useCallback(
    async (input) => {
      if (!me || !userId) return null;
      const child = me.children.find((c) => c.id === input.childId);
      if (!child) return null;

      const price = durationCash(input.minutes);
      if (data.cash < price) return null;

      const { data: row, error } = await supabase
        .from("requests")
        .insert({
          parent_id: userId,
          parent_name: me.name,
          daycare: me.daycare,
          child_name: child.name,
          child_age: child.age,
          child_note: child.note,
          place: input.place,
          note: input.note,
          start_at: input.startAt,
          minutes: input.minutes,
        })
        .select()
        .single();

      if (error || !row) return null;

      await changeCash(
        userId,
        data.cash,
        -price,
        `${child.name} 돌봄 요청 (${formatDuration(input.minutes)})`
      );
      await addNotification(
        userId,
        "동네 부모님들에게 알림을 보냈어요",
        `${me.neighborhood} · ${me.daycare} 부모님들에게 전달했습니다.`,
        `/request/${row.id}`
      );

      await refresh(userId);
      return row.id as string;
    },
    [me, userId, data.cash, changeCash, addNotification, refresh]
  );

  // -------------------------------------------------------------------------
  // 4) 이웃의 요청 수락하기 (내가 돌봐주기) → 채팅방 생성
  // -------------------------------------------------------------------------
  const acceptRequest: AppContextValue["acceptRequest"] = useCallback(
    async (id) => {
      if (!me || !userId) return null;
      const target = data.requests.find((r) => r.id === id);
      if (!target || target.status !== "waiting") return null;

      const { data: updated } = await supabase
        .from("requests")
        .update({ status: "accepted", helper_id: userId, helper_name: me.name })
        .eq("id", id)
        .eq("status", "waiting") // 다른 사람이 먼저 수락했으면 실패합니다.
        .select()
        .maybeSingle();

      if (!updated) {
        await refresh(userId);
        return null;
      }

      const roomId = await makeRoom({
        requestId: id,
        parentId: updated.parent_id,
        parentName: updated.parent_name,
        helperId: userId,
        helperName: me.name,
        title: `${target.childName} 돌봄 · ${formatDuration(target.minutes)}`,
        firstMessage: `수락해 주셔서 고맙습니다! ${target.place}에서 뵐게요.`,
      });

      await addNotification(
        userId,
        "돌봄을 수락했어요",
        `${target.parentName} 님과 채팅방이 만들어졌어요.`,
        roomId ? `/chat/${roomId}` : null
      );
      // 요청을 올린 부모님에게도 알려줍니다.
      await addNotification(
        updated.parent_id,
        `${me.name} 님이 수락했어요!`,
        `${target.childName} 돌봄을 도와주시기로 했어요.`,
        roomId ? `/chat/${roomId}` : null
      );

      await refresh(userId);
      return roomId;
    },
    [me, userId, data.requests, makeRoom, addNotification, refresh]
  );

  // -------------------------------------------------------------------------
  // 5) 돌봄 끝내기 - 돌봐준 사람에게 캐시가 들어오고 채팅방은 정리됩니다
  // -------------------------------------------------------------------------
  const completeRequest: AppContextValue["completeRequest"] = useCallback(
    async (id) => {
      if (!me || !userId) return;
      const target = data.requests.find((r) => r.id === id);
      if (!target || target.status !== "accepted") return;

      await supabase.from("requests").update({ status: "done" }).eq("id", id);
      // 돌봄이 끝나면 그 요청으로 만들어졌던 채팅방을 정리합니다.
      await supabase.from("rooms").delete().eq("request_id", id);

      const price = durationCash(target.minutes);
      const iWasHelper = !target.isMine && target.helperName === me.name;

      if (iWasHelper) {
        await changeCash(
          userId,
          data.cash,
          price,
          `${target.childName} 돌봄 완료 (${formatDuration(target.minutes)})`
        );
        await addNotification(
          userId,
          `${formatCash(price)} 캐시가 적립됐어요`,
          `${target.childName} 돌봄을 끝냈습니다. 고맙습니다!`,
          "/store"
        );
      } else {
        await addNotification(
          userId,
          "돌봄이 끝났어요",
          `${target.childName}(이)를 잘 돌봐주셨습니다.`,
          `/request/${id}`
        );
      }

      await addNotification(
        userId,
        "채팅방이 정리됐어요",
        `${target.childName} 돌봄이 끝나서 채팅방을 닫았습니다.`,
        `/request/${id}`
      );

      await refresh(userId);
    },
    [me, userId, data.requests, data.cash, changeCash, addNotification, refresh]
  );

  // -------------------------------------------------------------------------
  // 6) 내 요청 취소하기 - 낸 캐시를 돌려받습니다
  // -------------------------------------------------------------------------
  const cancelMyRequest: AppContextValue["cancelMyRequest"] = useCallback(
    async (id) => {
      if (!userId) return;
      const target = data.requests.find((r) => r.id === id);
      if (!target || !target.isMine) return;
      if (target.status === "done" || target.status === "canceled") return;

      await supabase.from("requests").update({ status: "canceled" }).eq("id", id);
      await supabase.from("rooms").delete().eq("request_id", id);

      await changeCash(
        userId,
        data.cash,
        durationCash(target.minutes),
        `${target.childName} 요청 취소 (환불)`
      );
      await refresh(userId);
    },
    [userId, data.requests, data.cash, changeCash, refresh]
  );

  // -------------------------------------------------------------------------
  // 7) AI 매칭에서 고른 이웃에게 도움 요청 → 바로 채팅방
  // -------------------------------------------------------------------------
  const askNeighbor: AppContextValue["askNeighbor"] = useCallback(
    async (neighborName, condition) => {
      if (!me || !userId) return null;

      const roomId = await makeRoom({
        requestId: null,
        parentId: userId,
        parentName: me.name,
        helperId: null, // 아직 가입하지 않은 이웃일 수 있습니다.
        helperName: neighborName,
        title: `AI 매칭 · ${condition}`,
        firstMessage: "안녕하세요! 매칭 요청 확인했어요. 어떤 도움이 필요하신가요?",
      });

      if (roomId) {
        await addNotification(
          userId,
          `${neighborName} 님과 연결됐어요`,
          "AI 매칭으로 채팅방이 만들어졌어요.",
          `/chat/${roomId}`
        );
      }
      await refresh(userId);
      return roomId;
    },
    [me, userId, makeRoom, addNotification, refresh]
  );

  // -------------------------------------------------------------------------
  // 8) 채팅 보내기
  // -------------------------------------------------------------------------
  const sendMessage: AppContextValue["sendMessage"] = useCallback(
    async (roomId, text) => {
      if (!me || !userId) return;
      const clean = text.trim();
      if (!clean) return;

      await supabase.from("messages").insert({
        room_id: roomId,
        sender_id: userId,
        sender_name: me.name,
        kind: "user",
        text: clean,
      });
      await refresh(userId);

      // 상대가 아직 가입하지 않은 이웃(AI 매칭)이면 답장을 흉내 냅니다.
      const room = data.rooms.find((r) => r.id === roomId);
      if (room && !room.requestId) {
        later(() => {
          const reply =
            AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
          void supabase
            .from("messages")
            .insert({
              room_id: roomId,
              sender_name: room.partnerName,
              kind: "user",
              text: reply,
            })
            .then(() => refresh(userId));
        }, 1800);
      }
    },
    [me, userId, data.rooms, later, refresh]
  );

  // -------------------------------------------------------------------------
  // 9) 광고 보고 캐시 받기
  // -------------------------------------------------------------------------
  const watchAd = useCallback(async () => {
    if (!userId) return;
    await changeCash(userId, data.cash, AD_REWARD, "광고 시청 보상");
    await refresh(userId);
  }, [userId, data.cash, changeCash, refresh]);

  // -------------------------------------------------------------------------
  // 10) 기프티콘 사기
  // -------------------------------------------------------------------------
  const buyGifticon: AppContextValue["buyGifticon"] = useCallback(
    async (item) => {
      if (!userId) return false;
      if (data.cash < item.price) return false;

      await supabase.from("coupons").insert({
        profile_id: userId,
        gifticon_id: item.id,
        name: item.name,
        brand: item.brand,
        code: makeCouponCode(),
      });
      await changeCash(
        userId,
        data.cash,
        -item.price,
        `${item.brand} ${item.name} 교환`
      );
      await addNotification(
        userId,
        "기프티콘을 받았어요",
        `${item.brand} ${item.name} 교환 번호가 발급됐어요.`,
        "/store"
      );
      await refresh(userId);
      return true;
    },
    [userId, data.cash, changeCash, addNotification, refresh]
  );

  /** 알림함을 열면 모두 '읽음'으로 바꿉니다. */
  const markNotificationsRead = useCallback(async () => {
    if (!userId) return;
    if (!data.notifications.some((n) => n.isNew)) return;
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isNew: false })),
    }));
    await supabase
      .from("notifications")
      .update({ is_new: false })
      .eq("profile_id", userId)
      .eq("is_new", true);
  }, [userId, data.notifications]);

  /**
   * 발표 연습용 초기화 - 내 요청·채팅·기록만 지우고 캐시를 처음으로 되돌립니다.
   * (계정과 등록해 둔 아이는 그대로 둡니다)
   */
  const resetAll = useCallback(async () => {
    if (!userId) return;
    videoUrls.clear();
    await Promise.all([
      supabase.from("requests").delete().eq("parent_id", userId),
      supabase.from("rooms").delete().eq("parent_id", userId),
      supabase.from("cash_logs").delete().eq("profile_id", userId),
      supabase.from("notifications").delete().eq("profile_id", userId),
      supabase.from("coupons").delete().eq("profile_id", userId),
    ]);
    await supabase
      .from("profiles")
      .update({ cash: WELCOME_CASH, show_guide: true })
      .eq("id", userId);
    await refresh(userId);
  }, [userId, refresh]);

  return (
    <AppContext.Provider
      value={{
        data,
        ready,
        me,
        needsSetup: !isSupabaseReady,
        signUp,
        logIn,
        logOut,
        hideHomeGuide,
        createRequest,
        acceptRequest,
        completeRequest,
        cancelMyRequest,
        askNeighbor,
        sendMessage,
        watchAd,
        buyGifticon,
        markNotificationsRead,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
