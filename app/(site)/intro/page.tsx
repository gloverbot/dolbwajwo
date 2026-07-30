import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/Icon";
import { SafetyTabs } from "@/components/landing/SafetyTabs";
import {
  CashScreen,
  ChatScreen,
  HeroScene,
  MatchScreen,
  PhoneFrame,
} from "@/components/landing/Scenes";

export const metadata: Metadata = {
  title: "돌봐줘 — 아이 맡길 곳이, 옆집에 있어요",
  description:
    "갑자기 일이 생긴 날, 같은 어린이집 부모님이 최대 2시간 아이를 돌봐드려요. 돈이 아니라 캐시로 주고받는 동네 품앗이, 돌봐줘.",
};

/* ── 페이지에서 쓰는 글 내용을 위쪽에 모아 둡니다 ────────────────────────── */

/** 이런 순간에 씁니다 */
const MOMENTS = [
  "갑자기 야근이 잡힌 날",
  "병원에 다녀와야 하는 날",
  "둘째가 아픈 날",
  "하원 시간이 겹치는 날",
];

/** 3단계 이용 방법 */
const STEPS = [
  {
    no: "01",
    icon: "edit_note",
    title: "요청을 올려요",
    body: "어디서 만날지와 몇 시간인지만 고르면 끝. 아이 정보는 가입할 때 적어둔 걸 그대로 씁니다.",
  },
  {
    no: "02",
    icon: "notifications_active",
    title: "이웃이 수락해요",
    body: "같은 어린이집 부모님에게만 알림이 갑니다. 수락하는 순간 두 사람만의 채팅방이 열려요.",
  },
  {
    no: "03",
    icon: "savings",
    title: "캐시가 오가요",
    body: "돌봐준 분에게 캐시가 쌓이고, 맡긴 분은 캐시를 씁니다. 다음번엔 서로 자리가 바뀌겠죠.",
  },
];

/** 옆으로 흐르는 부탁 문장들 */
const ASKS_TOP = [
  "30분만 하원 같이 해주세요",
  "회의 한 시간만 부탁드려요",
  "병원 다녀오는 동안만요",
  "둘째 낮잠 재우는 동안",
  "학원 앞까지 데려다주실 분",
  "저녁 먹이고 있을게요",
];

const ASKS_BOTTOM = [
  "택배만 받고 바로 갈게요",
  "형 학예회 동안 잠깐만",
  "은행 다녀올 30분",
  "비 와서 우산이 하나예요",
  "면접 보는 두 시간",
  "놀이터에서 같이 놀아주실 분",
];

/** 캐시 안내에 들어가는 항목들 */
const CASH_ITEMS = [
  { icon: "hourglass_empty", name: "30분", desc: "1,500캐시" },
  { icon: "schedule", name: "1시간", desc: "3,000캐시" },
  { icon: "update", name: "1시간 30분", desc: "4,500캐시" },
  { icon: "hourglass_bottom", name: "2시간", desc: "6,000캐시" },
  { icon: "redeem", name: "가입 축하", desc: "6,000캐시를 바로 드려요" },
  { icon: "volunteer_activism", name: "돌봐주면", desc: "그만큼 그대로 적립" },
  { icon: "play_circle", name: "광고 보기", desc: "한 번에 300캐시" },
  { icon: "card_giftcard", name: "상점", desc: "기프티콘으로 교환" },
];

/** 자주 묻는 질문 */
const FAQS = [
  {
    q: "돈이 오가나요?",
    a: "아니요. 앱 안에서만 쓰는 '캐시'로 주고받습니다. 가입하면 6,000캐시를 드리고, 아이를 돌봐주면 캐시가 쌓입니다. 실제 현금 거래는 하지 않습니다.",
  },
  {
    q: "모르는 사람이 우리 아이를 돌보게 되나요?",
    a: "요청은 같은 어린이집을 적은 부모님에게만 보입니다. 수락하기 전에 상대방의 성격·잘하는 것·자기소개 영상을 먼저 확인할 수 있어요.",
  },
  {
    q: "몇 시간까지 맡길 수 있나요?",
    a: "최대 2시간입니다. 30분, 1시간, 1시간 30분, 2시간 중에서 고를 수 있어요. 길게 맡기는 서비스가 아니라 '잠깐만' 도와주는 품앗이입니다.",
  },
  {
    q: "우리 아이 정보는 안전한가요?",
    a: "아이의 나이나 알레르기 같은 정보는 부모님 본인만 볼 수 있습니다. 주고받은 대화도 두 사람만 볼 수 있고, 돌봄이 끝나면 채팅방이 사라집니다.",
  },
  {
    q: "진짜로 쓸 수 있는 서비스인가요?",
    a: "지금은 고등학생 팀이 해커톤에서 만든 시험용 서비스(프로토타입)입니다. 회원가입부터 요청·수락·채팅·캐시까지 실제로 작동하지만, 실제 돌봄 계약이나 보험을 대신하지는 않습니다.",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   화면
   ══════════════════════════════════════════════════════════════════════════ */

export default function IntroPage() {
  return (
    <>
      {/* ── 1. 첫 화면 ───────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <HeroScene />
        {/* 글씨가 또렷하게 보이도록 그림 위에 어두운 막을 한 겹 덮습니다 */}
        <div className="absolute inset-0 bg-gradient-to-b from-cocoa/70 via-cocoa/20 to-cocoa/85" />

        <div className="site-wrap relative pb-20 pt-36 sm:pb-28">
          <h1 className="site-h1 max-w-[14ch] text-white">
            아이 맡길 곳이, 옆집에 있어요.
          </h1>

          <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-white/85 sm:text-xl">
            갑자기 일이 생긴 날, 같은 어린이집 부모님이 최대 2시간 아이를
            돌봐드립니다. 돈이 아니라 캐시로 주고받는 동네 품앗이.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="pill-light">
              앱 시작하기
              <Icon name="arrow_forward" className="text-lg" />
            </Link>
            <a href="#how" className="pill-ghost">
              어떻게 쓰는지 보기
            </a>
          </div>

          <p className="mt-8 flex items-center gap-2 text-sm text-white/60">
            <Icon name="info" className="text-base" />
            고등학생 팀이 만든 시험용 서비스입니다. 가입은 무료예요.
          </p>
        </div>
      </section>

      {/* ── 2. 이런 순간에 씁니다 ─────────────────────────────────────────── */}
      <section className="site-wrap border-b border-sand py-14">
        <p className="eyebrow">이런 순간을 위해</p>
        <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-lg font-semibold text-mocha sm:text-xl">
          {MOMENTS.map((m) => (
            <li key={m} className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-mid" />
              {m}
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3. 이용 방법 ─────────────────────────────────────────────────── */}
      <section id="how" className="site-wrap site-section scroll-mt-20">
        <p className="eyebrow">이용 방법</p>
        <h2 className="site-h2 mt-5 max-w-[18ch]">
          돌봐줘는 이렇게 돌아가요.
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {STEPS.map((s) => (
            <div key={s.no}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
                <Icon name={s.icon} filled className="text-3xl text-brand" />
              </span>
              <p className="mt-6 text-sm font-bold tracking-[0.2em] text-brand-mid">
                {s.no}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-mocha">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. 옆으로 흐르는 부탁들 ───────────────────────────────────────── */}
      <section className="overflow-hidden border-y border-sand bg-brand-soft py-16 sm:py-20">
        <div className="site-wrap">
          <p className="eyebrow text-brand-dark/70">이웃에게 건네는 말</p>
          <h2 className="site-h2 mt-5 max-w-[16ch] text-brand-dark">
            돌봐줘, 잠깐만요.
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          <AskRow items={ASKS_TOP} />
          <AskRow items={ASKS_BOTTOM} reverse />
        </div>
      </section>

      {/* ── 5. 주요 기능 ─────────────────────────────────────────────────── */}
      <section id="features" className="site-wrap site-section scroll-mt-20">
        <p className="eyebrow">주요 기능</p>
        <h2 className="site-h2 mt-5 max-w-[20ch]">
          맡기는 사람도, 돌봐주는 사람도 편하게.
        </h2>

        <div className="mt-20 space-y-24 sm:space-y-32">
          {/* (1) AI 매칭 */}
          <FeatureBlock
            eyebrow="AI 매칭"
            title="조건을 적으면, 맞는 이웃을 찾아드려요."
            body="고르는 것뿐 아니라 직접 적어서 찾을 수 있습니다. '활발하고 낮잠 잘 재워주시는 분'처럼 문장으로 적어도, 비슷한 뜻을 알아듣고 가까운 순서로 보여줍니다."
            bullets={[
              "성격·잘하는 것으로 검색",
              "비슷한 말도 알아들어요",
              "같은 어린이집 안에서만",
            ]}
            panelClass="bg-sky-soft"
            screen={<MatchScreen />}
          />

          {/* (2) 캐시 */}
          <FeatureBlock
            eyebrow="캐시"
            title="돈이 아니라, 품앗이."
            body="맡길 때는 캐시를 쓰고 돌봐주면 캐시가 쌓입니다. 가입하면 6,000캐시를 바로 드리기 때문에, 처음 오신 분도 먼저 도움을 받을 수 있어요."
            bullets={[
              "30분 1,500캐시부터",
              "가입하면 6,000캐시",
              "광고를 보면 300캐시",
            ]}
            panelClass="bg-honey-soft"
            screen={<CashScreen />}
            flip
          />

          {/* (3) 채팅 */}
          <FeatureBlock
            eyebrow="채팅"
            title="돌봄이 끝나면 채팅방은 사라져요."
            body="수락하는 순간 두 사람만의 채팅방이 열리고, 약속 장소와 시간을 정합니다. 돌봄이 끝나면 방은 자동으로 정리돼서 기록이 계속 남지 않아요."
            bullets={[
              "수락하면 자동으로 방 생성",
              "두 사람만 볼 수 있어요",
              "끝나면 자동으로 삭제",
            ]}
            panelClass="bg-leaf-soft"
            screen={<ChatScreen />}
          />
        </div>
      </section>

      {/* ── 6. 안심 장치 ─────────────────────────────────────────────────── */}
      <section className="border-y border-sand bg-white/50">
        <div className="site-wrap site-section">
          <p className="eyebrow">안심 장치</p>
          <h2 className="site-h2 mt-5 max-w-[20ch]">
            믿고 맡길 수 있게, 이렇게 했어요.
          </h2>
          <div className="mt-14">
            <SafetyTabs />
          </div>
        </div>
      </section>

      {/* ── 7. 캐시 한눈에 보기 ───────────────────────────────────────────── */}
      <section id="cash" className="scroll-mt-20 bg-cocoa text-cream">
        <div className="site-wrap site-section">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cream/50">
            캐시
          </p>
          <h2 className="site-h2 mt-5 max-w-[18ch]">
            가입하면 6,000캐시부터 시작해요.
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-cream/70">
            현금이 아니라 앱 안에서만 쓰는 캐시입니다. 결제도, 약정도 없어요.
          </p>

          <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {CASH_ITEMS.map((c) => (
              <div key={c.name} className="border-t border-cream/20 pt-5">
                <Icon name={c.icon} filled className="text-2xl text-cream/60" />
                <p className="mt-3 text-xl font-semibold">{c.name}</p>
                <p className="mt-1 text-base text-cream/60">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-base font-semibold text-cocoa transition hover:bg-white"
            >
              지금 가입하고 6,000캐시 받기
              <Icon name="arrow_forward" className="text-lg" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. 약속 두 가지 ──────────────────────────────────────────────── */}
      <section className="site-wrap site-section">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <PromiseCard
            icon="shield_person"
            title="아이 정보는 부모님 것입니다."
            body="아이의 나이·알레르기 같은 정보는 본인만 볼 수 있게 막아 두었습니다. 다른 부모님에게는 요청에 적은 만남 장소와 시간만 보여요."
          />
          <PromiseCard
            icon="handshake"
            title="캐시는 이웃끼리만 오갑니다."
            body="중간에서 수수료를 떼지 않습니다. 광고를 보면 캐시가 쌓이고, 그 캐시는 다시 이웃의 돌봄으로 돌아갑니다."
          />
        </div>
      </section>

      {/* ── 9. 자주 묻는 질문 ────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 border-t border-sand">
        <div className="site-wrap site-section">
          <p className="eyebrow">자주 묻는 질문</p>
          <h2 className="site-h2 mt-5 max-w-[18ch]">궁금한 점이 있으신가요?</h2>

          <div className="mt-12 border-t border-sand">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-sand">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-xl font-semibold tracking-[-0.02em] transition hover:text-brand-dark [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon
                    name="add"
                    className="shrink-0 text-2xl text-mocha transition group-open:rotate-45"
                  />
                </summary>
                <p className="max-w-[62ch] pb-7 text-lg leading-relaxed text-mocha">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   이 페이지 안에서만 쓰는 작은 조각들
   ══════════════════════════════════════════════════════════════════════════ */

/** 옆으로 흐르는 한 줄. 같은 내용을 두 번 이어 붙여야 끊기지 않습니다. */
function AskRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      <div className={`marquee-track ${reverse ? "is-reverse" : ""}`}>
        {/* 두 벌을 나란히 놓습니다 */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
            {items.map((t) => (
              <span
                key={t}
                className="whitespace-nowrap rounded-full border border-brand-mid/40 bg-cream px-6 py-3.5 text-lg font-semibold text-brand-dark sm:text-xl"
              >
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 기능 하나를 소개하는 큰 덩어리 (그림 + 설명) */
function FeatureBlock({
  eyebrow,
  title,
  body,
  bullets,
  panelClass,
  screen,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  panelClass: string;
  screen: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      {/* 휴대폰 그림 */}
      <div
        className={`site-panel flex justify-center px-6 py-14 sm:py-20 ${panelClass} ${
          flip ? "lg:order-2" : ""
        }`}
      >
        <PhoneFrame>{screen}</PhoneFrame>
      </div>

      {/* 설명 */}
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="site-h2 mt-4 max-w-[16ch]">{title}</h3>
        <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-mocha">
          {body}
        </p>
        <ul className="mt-8 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-lg">
              <Icon name="check" className="text-xl text-brand" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** 약속 카드 */
function PromiseCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[2rem] border border-sand bg-white p-8 sm:rounded-[2.5rem] sm:p-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
        <Icon name={icon} filled className="text-2xl text-brand" />
      </span>
      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-4 text-lg leading-relaxed text-mocha">{body}</p>
    </div>
  );
}
