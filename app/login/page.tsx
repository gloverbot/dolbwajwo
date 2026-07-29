"use client";

import { useRef, useState } from "react";

import { setVideoUrl, useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import { Logo, WelcomeScene } from "@/components/Logo";
import { Avatar, SafetyNotice } from "@/components/Ui";
import { formatCash, makeId } from "@/lib/format";
import {
  DAYCARES,
  NEIGHBORHOODS,
  PERSONALITY_TAGS,
  SKILL_TAGS,
  WELCOME_CASH,
} from "@/lib/policy";
import type { Child } from "@/lib/types";

type View = "intro" | "signup" | "login";

/** 첫 화면: 인트로 → 회원가입 / 로그인 */
export default function LoginPage() {
  const [view, setView] = useState<View>("intro");

  if (view === "intro") {
    return (
      <Intro
        onStart={() => setView("signup")}
        onLogin={() => setView("login")}
      />
    );
  }

  return (
    <main className="px-5 pb-10 pt-8">
      <div className="text-center">
        <span className="inline-block">
          <Logo size={64} />
        </span>
        <h1 className="mt-1 text-3xl font-bold text-brand-dark">돌봐줘</h1>
      </div>

      {/* 회원가입 / 로그인 고르기 */}
      <div className="mt-6 flex gap-2 rounded-full bg-muted-soft p-1.5">
        <TabButton on={view === "signup"} onClick={() => setView("signup")}>
          회원가입
        </TabButton>
        <TabButton on={view === "login"} onClick={() => setView("login")}>
          로그인
        </TabButton>
      </div>

      <div className="mt-6">
        {view === "signup" ? <SignUpForm /> : <LogInForm />}
      </div>

      <div className="mt-6">
        <SafetyNotice />
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// 인트로 (앱을 처음 켰을 때 보이는 화면)
// ---------------------------------------------------------------------------
const SLIDES = [
  {
    title: "돌봐줘",
    body: "믿고 맡길 수 있는\n따뜻한 아이 돌봄 연결",
    logo: true,
  },
  {
    title: "급할 때 알려주세요",
    body: "같은 동네·같은 어린이집 부모님께\n한 번에 알림이 갑니다.",
    logo: false,
  },
  {
    title: "서로 돌보고 캐시를 모아요",
    body: "이웃 아이를 돌봐주면 캐시가 쌓이고\n상점에서 기프티콘으로 바꿀 수 있어요.",
    logo: false,
  },
];

function Intro({
  onStart,
  onLogin,
}: {
  onStart: () => void;
  onLogin: () => void;
}) {
  const [page, setPage] = useState(0);
  const slide = SLIDES[page];
  const last = page === SLIDES.length - 1;

  return (
    <main className="flex min-h-[calc(100vh-2rem)] flex-col px-6 pb-10 pt-14">
      <div className="text-center">
        {slide.logo && (
          <span className="inline-block">
            <Logo size={104} />
          </span>
        )}
        <h1
          className={`font-bold text-brand-dark ${
            slide.logo ? "mt-2 text-5xl" : "mt-6 text-3xl"
          }`}
        >
          {slide.title}
        </h1>
        <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-mocha">
          {slide.body}
        </p>
      </div>

      {/* 포근한 동네 그림 */}
      <div className="mt-8 flex-1">
        <WelcomeScene />
      </div>

      <div className="mt-8">
        <button
          className="btn-primary"
          onClick={() => (last ? onStart() : setPage(page + 1))}
        >
          {last ? "시작하기" : "다음"}
        </button>
        <button className="btn-text mt-1" onClick={onStart}>
          {last ? "이미 계정이 있어요" : "건너뛰기"}
        </button>
        {last && (
          <button className="btn-text -mt-2" onClick={onLogin}>
            로그인하러 가기
          </button>
        )}
      </div>

      {/* 지금 몇 번째 장인지 알려주는 점 */}
      <div className="mt-5 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`${i + 1}번째 소개`}
            onClick={() => setPage(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === page ? "w-6 bg-brand" : "w-2.5 bg-brand-tint"
            }`}
          />
        ))}
      </div>
    </main>
  );
}

function TabButton({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full py-3 text-lg font-bold transition ${
        on ? "bg-white text-brand-dark shadow-soft" : "text-mocha"
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 로그인
// ---------------------------------------------------------------------------
function LogInForm() {
  const { logIn } = useApp();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogIn() {
    if (!loginId.trim() || !password) {
      setError("아이디와 비밀번호를 모두 적어주세요.");
      return;
    }
    const message = await logIn(loginId.trim(), password);
    if (message) setError(message);
  }

  return (
    <div>
      <label className="label-text" htmlFor="loginId">
        아이디
      </label>
      <input
        id="loginId"
        className="input-box"
        placeholder="예) hana123"
        value={loginId}
        onChange={(e) => {
          setLoginId(e.target.value);
          setError("");
        }}
      />

      <label className="label-text mt-5" htmlFor="loginPw">
        비밀번호
      </label>
      <input
        id="loginPw"
        type="password"
        className="input-box"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
      />

      {error && (
        <p className="mt-3 text-lg font-bold text-clay-dark" role="alert">
          {error}
        </p>
      )}

      <button className="btn-primary mt-6" onClick={() => void handleLogIn()}>
        로그인
      </button>

      <p className="mt-4 text-center text-base text-mocha">
        처음이신가요? 위에서 <b>회원가입</b>을 먼저 해주세요.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 회원가입
// ---------------------------------------------------------------------------
function SignUpForm() {
  const { signUp } = useApp();

  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [personality, setPersonality] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [neighborhood, setNeighborhood] = useState("");
  const [daycare, setDaycare] = useState("");
  const [children, setChildren] = useState<Child[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [videoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const avatarInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  /** 고른 사진을 작게 줄여서 저장합니다. (그래야 브라우저 저장소에 들어갑니다) */
  function handleAvatar(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const size = 200;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // 가운데를 정사각형으로 잘라서 그립니다.
        const side = Math.min(image.width, image.height);
        ctx.drawImage(
          image,
          (image.width - side) / 2,
          (image.height - side) / 2,
          side,
          side,
          0,
          0,
          size,
          size
        );
        setAvatar(canvas.toDataURL("image/jpeg", 0.8));
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleVideo(file: File) {
    setVideoName(file.name);
    setLocalVideoUrl(URL.createObjectURL(file));
  }

  async function handleSignUp() {
    if (!name.trim()) return setError("이름을 적어주세요.");
    if (!loginId.trim()) return setError("아이디를 적어주세요.");
    if (password.length < 4)
      return setError("비밀번호는 4자 이상으로 적어주세요.");
    if (personality.length === 0) return setError("성격을 하나 이상 적어주세요.");
    if (skills.length === 0) return setError("잘하는 것을 하나 이상 적어주세요.");
    if (!neighborhood.trim()) return setError("우리 동네를 적어주세요.");
    if (!daycare.trim()) return setError("어린이집을 적어주세요.");
    if (children.length === 0) return setError("우리 아이를 한 명 이상 등록해주세요.");

    const message = await signUp({
      loginId: loginId.trim(),
      password,
      name: name.trim(),
      personality,
      skills,
      avatar,
      videoName,
      neighborhood: neighborhood.trim(),
      daycare: daycare.trim(),
      children,
    });

    if (message) {
      setError(message);
      return;
    }
    // 가입한 사람의 영상은 앱이 켜져 있는 동안만 기억합니다.
    if (videoUrl) setVideoUrl(loginId.trim(), videoUrl);
  }

  return (
    <div>
      {/* 가입 선물 안내 */}
      <div className="flex items-center gap-3 rounded-3xl bg-honey-soft p-4">
        <Icon name="redeem" filled className="shrink-0 text-3xl text-honey" />
        <p className="text-base font-semibold leading-relaxed text-honey-dark">
          가입하면 {formatCash(WELCOME_CASH)} 캐시를 드려요!
        </p>
      </div>

      {/* ── 부모님 정보 ────────────────────────────────────────────────── */}
      <SectionDivider icon="person">부모님 정보</SectionDivider>

      {/* 프로필 사진 */}
      <div className="text-center">
        <span className="label-text text-center">프로필 사진</span>
        <button
          type="button"
          onClick={() => avatarInput.current?.click()}
          className="relative mt-1 inline-block"
        >
          <Avatar src={avatar} name={name || "나"} size={104} />
          <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream bg-brand text-white">
            <Icon name="photo_camera" filled className="text-lg" />
          </span>
        </button>
        <p className="mt-2 text-base text-mocha">눌러서 사진을 고르세요</p>
      </div>
      <input
        ref={avatarInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAvatar(file);
        }}
      />

      {/* 이름 */}
      <label className="label-text mt-6" htmlFor="name">
        이름
      </label>
      <input
        id="name"
        className="input-box"
        placeholder="예) 김하나"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
      />

      {/* 성격 - 직접 적어서 추가합니다 */}
      <TagInput
        label="성격 (여러 개 적을 수 있어요)"
        placeholder="예) 차분해요"
        tags={personality}
        onChange={(v) => {
          setPersonality(v);
          setError("");
        }}
        suggestions={PERSONALITY_TAGS}
      />

      {/* 잘하는 것 - 직접 적어서 추가합니다 */}
      <TagInput
        label="잘하는 것 (여러 개 적을 수 있어요)"
        placeholder="예) 책 읽어주기"
        tags={skills}
        onChange={(v) => {
          setSkills(v);
          setError("");
        }}
        suggestions={SKILL_TAGS}
      />

      {/* 동네 / 어린이집 - 직접 적습니다 */}
      <label className="label-text mt-6" htmlFor="neighborhood">
        우리 동네
      </label>
      <input
        id="neighborhood"
        className="input-box"
        placeholder={`예) ${NEIGHBORHOODS[0]}`}
        value={neighborhood}
        onChange={(e) => {
          setNeighborhood(e.target.value);
          setError("");
        }}
      />

      <label className="label-text mt-6" htmlFor="daycare">
        우리 아이 어린이집
      </label>
      <input
        id="daycare"
        className="input-box"
        placeholder={`예) ${DAYCARES[0]}`}
        value={daycare}
        onChange={(e) => {
          setDaycare(e.target.value);
          setError("");
        }}
      />

      {/* ── 우리 아이 정보 ─────────────────────────────────────────────── */}
      <SectionDivider icon="child_care">우리 아이 정보</SectionDivider>
      <p className="mb-3 text-base leading-relaxed text-mocha">
        여기에 등록해 두면, 나중에 아이를 맡길 때는{" "}
        <b className="text-cocoa">장소와 시간만</b> 정하면 됩니다.
      </p>
      <ChildrenInput
        children={children}
        onChange={(v) => {
          setChildren(v);
          setError("");
        }}
      />

      {/* 자기소개 영상 */}
      <span className="label-text mt-6">자기소개 영상 (없어도 됩니다)</span>
      {videoUrl ? (
        <div className="overflow-hidden rounded-3xl border border-sand bg-white">
          <video src={videoUrl} controls className="w-full" />
          <div className="flex items-center gap-2 px-4 py-3">
            <Icon name="movie" filled className="text-xl text-brand" />
            <span className="min-w-0 flex-1 truncate text-base text-mocha">
              {videoName}
            </span>
            <button
              className="text-base font-bold text-clay-dark"
              onClick={() => {
                setVideoName(null);
                setLocalVideoUrl(null);
              }}
            >
              지우기
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => videoInput.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-sand bg-white py-8 text-lg font-bold text-mocha"
        >
          <Icon name="videocam" className="text-2xl" />
          영상 고르기
        </button>
      )}
      <input
        ref={videoInput}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleVideo(file);
        }}
      />

      {/* 아이디 / 비밀번호 */}
      <label className="label-text mt-6" htmlFor="signupId">
        아이디
      </label>
      <input
        id="signupId"
        className="input-box"
        placeholder="예) hana123"
        value={loginId}
        onChange={(e) => {
          setLoginId(e.target.value);
          setError("");
        }}
      />

      <label className="label-text mt-5" htmlFor="signupPw">
        비밀번호 (4자 이상)
      </label>
      <input
        id="signupPw"
        type="password"
        className="input-box"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
      />

      <div className="mt-3 flex gap-2 rounded-2xl bg-clay-soft p-3">
        <Icon name="warning" filled className="shrink-0 text-xl text-clay" />
        <p className="text-base leading-relaxed text-clay-dark">
          이 앱은 서버가 없는 프로토타입이라 비밀번호가 이 브라우저에 그대로
          저장됩니다. <b>실제로 쓰는 비밀번호는 넣지 마세요.</b>
        </p>
      </div>

      {error && (
        <p className="mt-4 text-lg font-bold text-clay-dark" role="alert">
          {error}
        </p>
      )}

      <button className="btn-primary mt-6" onClick={() => void handleSignUp()}>
        가입하고 시작하기
      </button>
    </div>
  );
}

/** '부모님 정보' / '우리 아이 정보'처럼 구역을 나누는 제목 */
function SectionDivider({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-2 border-t border-sand pt-6">
      <Icon name={icon} filled className="text-2xl text-brand" />
      <h2 className="text-xl font-bold text-cocoa">{children}</h2>
    </div>
  );
}

/**
 * 우리 아이를 한 명씩 등록하는 칸입니다.
 * 이름과 나이를 적고 '아이 추가'를 누르면 아래에 쌓입니다.
 */
function ChildrenInput({
  children,
  onChange,
}: {
  children: Child[];
  onChange: (children: Child[]) => void;
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(5);
  const [note, setNote] = useState("");
  const [warn, setWarn] = useState("");

  function add() {
    const clean = name.trim();
    if (!clean) {
      setWarn("아이 이름을 적어주세요.");
      return;
    }
    onChange([
      ...children,
      { id: makeId("child"), name: clean, age, note: note.trim() },
    ]);
    setName("");
    setAge(5);
    setNote("");
    setWarn("");
  }

  return (
    <div>
      {/* 이미 등록한 아이들 */}
      {children.length > 0 && (
        <ul className="mb-4 space-y-3">
          {children.map((child) => (
            <li key={child.id} className="card flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand-dark">
                {child.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-cocoa">
                  {child.name} ({child.age}살)
                </p>
                {child.note && (
                  <p className="mt-1 text-base leading-relaxed text-mocha">
                    {child.note}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label={`${child.name} 지우기`}
                onClick={() => onChange(children.filter((c) => c.id !== child.id))}
                className="shrink-0 text-mocha"
              >
                <Icon name="close" className="text-2xl" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 새 아이 적는 칸 */}
      <div className="rounded-3xl border-2 border-dashed border-sand bg-white p-5">
        <label className="label-text" htmlFor="childName">
          아이 이름
        </label>
        <input
          id="childName"
          className="input-box"
          placeholder="예) 하준"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setWarn("");
          }}
        />

        <span className="label-text mt-5">나이</span>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((a) => (
            <button
              key={a}
              type="button"
              className={`pick ${age === a ? "pick-on" : ""}`}
              onClick={() => setAge(a)}
            >
              {a}살
            </button>
          ))}
        </div>

        <label className="label-text mt-5" htmlFor="childNote">
          돌봐줄 분이 알아야 할 것 (선택)
        </label>
        <input
          id="childNote"
          className="input-box"
          placeholder="예) 땅콩 알레르기가 있어요"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {warn && (
          <p className="mt-3 text-base font-bold text-clay-dark">{warn}</p>
        )}

        <button
          type="button"
          onClick={add}
          className="btn-outline mt-5 flex items-center justify-center gap-2"
        >
          <Icon name="add" className="text-2xl" />
          아이 추가
        </button>
      </div>
    </div>
  );
}

/**
 * 직접 적어서 하나씩 추가하는 칸입니다.
 * 적고 나서 Enter를 누르거나 '추가' 버튼을 누르면 아래에 쌓입니다.
 */
function TagInput({
  label,
  placeholder,
  tags,
  onChange,
  suggestions,
}: {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
}) {
  const [text, setText] = useState("");

  function add(value: string) {
    const clean = value.trim();
    setText("");
    if (!clean || tags.includes(clean)) return;
    onChange([...tags, clean]);
  }

  function remove(value: string) {
    onChange(tags.filter((t) => t !== value));
  }

  // 아직 안 고른 것만 추천으로 보여줍니다.
  const rest = suggestions.filter((s) => !tags.includes(s));

  return (
    <div className="mt-6">
      <span className="label-text">{label}</span>

      <div className="flex gap-2">
        <input
          className="input-box flex-1"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(text);
            }
          }}
        />
        <button
          type="button"
          onClick={() => add(text)}
          disabled={!text.trim()}
          className="flex w-20 shrink-0 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white disabled:bg-sand disabled:text-muted"
        >
          추가
        </button>
      </div>

      {/* 적어 넣은 것들 */}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-brand py-1.5 pl-4 pr-2 text-lg font-bold text-white"
            >
              {tag}
              <button
                type="button"
                aria-label={`${tag} 지우기`}
                onClick={() => remove(tag)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 빠르게 넣기 */}
      {rest.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-base text-mocha">자주 쓰는 말 (눌러서 넣기)</p>
          <div className="flex flex-wrap gap-2">
            {rest.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => add(item)}
                className="flex items-center gap-1 rounded-full border-2 border-sand bg-white py-1.5 pl-3 pr-3.5 text-base font-bold text-mocha"
              >
                <Icon name="add" className="text-lg" />
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
