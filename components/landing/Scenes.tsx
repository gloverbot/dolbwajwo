/**
 * 소개 홈페이지(/intro)에 들어가는 그림들입니다.
 *
 * 사진 파일을 쓰지 않고 코드(SVG)와 화면 조각으로 직접 그립니다.
 * 그래서 어떤 크기에서도 흐려지지 않고, 인터넷이 느려도 바로 보입니다.
 */

import { Icon } from "@/components/Icon";

/* ══════════════════════════════════════════════════════════════════════════
   1. 첫 화면(히어로) 뒷배경 — 해 질 무렵의 동네 풍경
   ══════════════════════════════════════════════════════════════════════════ */

export function HeroScene() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="해 질 무렵, 불이 켜진 동네에서 손을 잡고 선 어른과 아이"
    >
      <defs>
        {/* 하늘: 위는 짙은 밤빛, 아래는 따뜻한 노을빛 */}
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241B14" />
          <stop offset="38%" stopColor="#4A3122" />
          <stop offset="66%" stopColor="#8E4F2C" />
          <stop offset="88%" stopColor="#C97B42" />
          <stop offset="100%" stopColor="#E8A85F" />
        </linearGradient>
        {/* 해 주변의 은은한 빛 */}
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD9A0" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFD9A0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 하늘 */}
      <rect width="1440" height="900" fill="url(#heroSky)" />

      {/* 별 몇 개 */}
      <g fill="#FFF3E0" opacity="0.55">
        <circle cx="180" cy="90" r="2.4" />
        <circle cx="360" cy="52" r="1.8" />
        <circle cx="520" cy="130" r="2" />
        <circle cx="880" cy="70" r="2.2" />
        <circle cx="1130" cy="120" r="1.7" />
        <circle cx="1320" cy="64" r="2.3" />
        <circle cx="720" cy="36" r="1.6" />
      </g>

      {/* 해와 빛무리 */}
      <circle cx="1075" cy="545" r="230" fill="url(#heroGlow)" />
      <circle cx="1075" cy="545" r="72" fill="#FFCE8C" opacity="0.9" />

      {/* 가장 먼 언덕 */}
      <path
        d="M0 596 Q220 528 470 578 T900 556 Q1160 534 1440 588 L1440 900 L0 900 Z"
        fill="#4A3527"
      />

      {/* 동네 집들 — 창문에 불이 켜져 있습니다 */}
      <g>
        {/* 왼쪽 집 */}
        <path d="M118 612 L196 552 L274 612 Z" fill="#2E2219" />
        <rect x="136" y="608" width="120" height="86" fill="#33261C" />
        <rect x="158" y="632" width="26" height="24" rx="4" fill="#F8D79A" />
        <rect x="206" y="632" width="26" height="24" rx="4" fill="#EFC178" />

        {/* 가운데 큰 집 */}
        <path d="M300 600 L392 528 L484 600 Z" fill="#33261C" />
        <rect x="322" y="596" width="140" height="104" fill="#3A2B20" />
        <rect x="346" y="622" width="30" height="28" rx="5" fill="#F8D79A" />
        <rect x="408" y="622" width="30" height="28" rx="5" fill="#F8D79A" />
        <rect x="378" y="664" width="30" height="36" rx="5" fill="#C97B42" />

        {/* 오른쪽 낮은 집 */}
        <path d="M516 622 L580 574 L644 622 Z" fill="#2E2219" />
        <rect x="532" y="618" width="98" height="80" fill="#33261C" />
        <rect x="556" y="642" width="24" height="22" rx="4" fill="#EFC178" />
        <rect x="594" y="642" width="24" height="22" rx="4" fill="#F8D79A" />

        {/* 멀리 있는 집 두 채 */}
        <path d="M1180 616 L1240 570 L1300 616 Z" fill="#33261C" />
        <rect x="1196" y="612" width="90" height="76" fill="#3A2B20" />
        <rect x="1220" y="636" width="24" height="22" rx="4" fill="#F8D79A" />
        <path d="M1312 630 L1362 594 L1412 630 Z" fill="#2E2219" />
        <rect x="1326" y="626" width="74" height="64" fill="#33261C" />
        <rect x="1346" y="646" width="22" height="20" rx="4" fill="#EFC178" />
      </g>

      {/* 앞쪽 언덕 */}
      <path
        d="M0 706 Q260 652 560 700 T1040 690 Q1250 674 1440 716 L1440 900 L0 900 Z"
        fill="#241B14"
      />

      {/* 나무 */}
      <g fill="#1B140F">
        <rect x="856" y="620" width="12" height="80" rx="6" />
        <circle cx="862" cy="604" r="42" />
        <rect x="940" y="646" width="10" height="60" rx="5" />
        <circle cx="945" cy="634" r="30" />
        <rect x="70" y="656" width="10" height="58" rx="5" />
        <circle cx="75" cy="644" r="28" />
      </g>

      {/* 손잡은 어른과 아이 (머리 아래에 몸통이 바로 붙습니다) */}
      <g fill="#150F0B">
        {/* 어른 */}
        <circle cx="700" cy="606" r="27" />
        <path d="M660 720 v-46 a40 40 0 0 1 80 0 v46 z" />
        {/* 아이 */}
        <circle cx="788" cy="646" r="19" />
        <path d="M760 720 v-30 a28 28 0 0 1 56 0 v30 z" />
        {/* 맞잡은 손 */}
        <rect x="736" y="678" width="30" height="13" rx="6.5" />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   2. 휴대폰 모양 틀 — 안에 앱 화면을 넣어 보여줍니다
   ══════════════════════════════════════════════════════════════════════════ */

export function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-[286px] shrink-0 rounded-[2.75rem] border-[9px] border-cocoa bg-cocoa shadow-lift ${className}`}
    >
      {/* 위쪽 카메라 부분 */}
      <div className="absolute left-1/2 top-[9px] z-10 h-[22px] w-[104px] -translate-x-1/2 rounded-b-2xl bg-cocoa" />
      <div className="h-[540px] overflow-hidden rounded-[2.15rem] bg-cream px-4 pb-4 pt-10">
        {children}
      </div>
    </div>
  );
}

/* ── 앱 화면 안쪽에서 반복해서 쓰는 작은 조각들 ───────────────────────────── */

function MiniTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[13px] font-bold text-mocha">{children}</p>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   3. AI 매칭 화면
   ══════════════════════════════════════════════════════════════════════════ */

// 색깔 이름은 Tailwind가 글자를 그대로 찾아 쓰기 때문에
// `bg-${...}` 처럼 이어 붙이지 않고 완성된 이름으로 적어 둡니다.
const MATCH_PEOPLE = [
  {
    name: "정은지",
    tags: ["활발해요", "낮잠 잘 재워요"],
    score: 92,
    bg: "bg-leaf-tint",
    fg: "text-leaf-dark",
  },
  {
    name: "박서준",
    tags: ["차분해요", "그림 잘 그려요"],
    score: 84,
    bg: "bg-sky-tint",
    fg: "text-sky-dark",
  },
  {
    name: "김하늘",
    tags: ["요리 잘해요", "책 많이 읽어줘요"],
    score: 77,
    bg: "bg-honey-tint",
    fg: "text-honey-dark",
  },
];

export function MatchScreen() {
  return (
    <>
      <MiniTitle>어떤 분을 찾으세요?</MiniTitle>
      <div className="flex items-center gap-2 rounded-2xl border-2 border-brand-mid bg-white px-3 py-2.5">
        <Icon name="search" className="text-lg text-brand" />
        <span className="truncate text-[13px] text-cocoa">
          활발하고 낮잠 잘 재워주시는 분
        </span>
      </div>

      <p className="mt-4 text-[13px] font-bold text-cocoa">
        딱 맞는 이웃 3분을 찾았어요
      </p>

      <div className="mt-2 space-y-2">
        {MATCH_PEOPLE.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2.5 rounded-2xl border border-sand bg-white p-3 shadow-soft"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${p.bg}`}
            >
              <Icon name="person" filled className={`text-lg ${p.fg}`} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-cocoa">
                {p.name} 부모님
              </span>
              <span className="block truncate text-[11px] text-mocha">
                {p.tags.join(" · ")}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand-dark">
              {p.score}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-sky-soft p-3">
        <p className="text-[11px] leading-relaxed text-sky-dark">
          같은 어린이집 부모님 중에서만 찾아요.
        </p>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   4. 캐시 화면
   ══════════════════════════════════════════════════════════════════════════ */

const CASH_ROWS = [
  { title: "민서 돌봄 완료", amount: "+3,000", plus: true },
  { title: "광고 보고 받기", amount: "+300", plus: true },
  { title: "1시간 30분 요청", amount: "-4,500", plus: false },
];

export function CashScreen() {
  return (
    <>
      <div className="rounded-3xl bg-honey-soft p-4">
        <p className="text-[12px] font-bold text-honey-dark">가진 캐시</p>
        <p className="mt-1 flex items-baseline gap-1 text-cocoa">
          <span className="text-[30px] font-bold tracking-tight">6,000</span>
          <span className="text-[14px] font-bold">캐시</span>
        </p>
        <p className="mt-1 text-[11px] text-mocha">
          가입 축하 캐시가 들어왔어요
        </p>
      </div>

      <p className="mt-4 text-[13px] font-bold text-cocoa">
        얼마나 맡기시겠어요?
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[
          ["30분", "1,500"],
          ["1시간", "3,000"],
          ["1시간 30분", "4,500"],
          ["2시간", "6,000"],
        ].map(([label, cash], i) => (
          <div
            key={label}
            className={`rounded-2xl border-2 px-2 py-2.5 text-center ${
              i === 1
                ? "border-brand bg-brand text-white"
                : "border-sand bg-white text-mocha"
            }`}
          >
            <span className="block text-[12px] font-bold">{label}</span>
            <span className="block text-[11px] opacity-90">{cash}캐시</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[13px] font-bold text-cocoa">캐시 기록</p>
      <div className="mt-2 space-y-1.5">
        {CASH_ROWS.map((r) => (
          <div
            key={r.title}
            className="flex items-center justify-between rounded-2xl border border-sand bg-white px-3 py-2.5"
          >
            <span className="text-[12px] text-cocoa">{r.title}</span>
            <span
              className={`text-[12px] font-bold ${
                r.plus ? "text-leaf-dark" : "text-clay-dark"
              }`}
            >
              {r.amount}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   5. 채팅 화면
   ══════════════════════════════════════════════════════════════════════════ */

export function ChatScreen() {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-sand pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-tint">
          <Icon name="volunteer_activism" filled className="text-base text-leaf-dark" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-bold text-cocoa">
            민서 돌봄 · 1시간
          </span>
          <span className="block text-[11px] text-mocha">정은지 부모님</span>
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <p className="rounded-full bg-muted-soft px-3 py-1.5 text-center text-[11px] text-mocha">
          정은지 부모님이 수락했어요
        </p>

        <div className="flex justify-start">
          <p className="max-w-[80%] rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[12px] leading-relaxed text-cocoa shadow-soft">
            안녕하세요! 3시에 어린이집 앞에서 뵐게요.
          </p>
        </div>
        <div className="flex justify-end">
          <p className="max-w-[80%] rounded-2xl rounded-tr-md bg-brand px-3 py-2 text-[12px] leading-relaxed text-white">
            감사합니다. 간식은 가방에 넣어뒀어요!
          </p>
        </div>
        <div className="flex justify-start">
          <p className="max-w-[80%] rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[12px] leading-relaxed text-cocoa shadow-soft">
            네, 잘 놀고 있어요 :) 걱정 마세요.
          </p>
        </div>

        <p className="rounded-full bg-leaf-tint px-3 py-1.5 text-center text-[11px] font-bold text-leaf-dark">
          돌봄이 끝났어요 · 3,000캐시 적립
        </p>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-dashed border-sand bg-white/60 p-3 text-center">
        <Icon name="auto_delete" className="text-xl text-mocha" />
        <p className="mt-1 text-[11px] leading-relaxed text-mocha">
          이 채팅방은 곧 사라집니다
        </p>
      </div>
    </>
  );
}
