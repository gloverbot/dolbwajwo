import type { RequestStatus } from "./types";

// ---------------------------------------------------------------------------
// 캐시(= 포인트) 정책 - 숫자를 바꾸고 싶으면 여기 한 곳만 고치면 됩니다.
// ---------------------------------------------------------------------------

/** 가입하면 바로 주는 축하 캐시 */
export const WELCOME_CASH = 6000;

/** 1시간 돌봐주면 받는(= 맡기면 내는) 캐시 (안내 문구에 씁니다) */
export const CASH_PER_HOUR = 3000;

/**
 * 고를 수 있는 돌봄 시간과 캐시입니다.
 * 30분에 1,500 캐시씩 올라갑니다.
 */
export const DURATIONS = [
  { minutes: 30, cash: 1500 },
  { minutes: 60, cash: 3000 },
  { minutes: 90, cash: 4500 },
  { minutes: 120, cash: 6000 },
] as const;

/** 한 번에 맡길 수 있는 최대 시간(분) */
export const MAX_MINUTES = 120;

/** 몇 분을 맡기면 캐시가 얼마인지 알려줍니다. */
export function durationCash(minutes: number): number {
  const found = DURATIONS.find((d) => d.minutes === minutes);
  // 목록에 없는 값이 들어와도 30분당 1,500으로 계산합니다.
  return found ? found.cash : Math.round(minutes / 30) * 1500;
}

/**
 * 비밀번호 최소 길이입니다.
 *
 * 이 숫자는 우리가 정한 게 아니라 **Supabase가 정한 규칙**입니다.
 * 6자보다 짧으면 Supabase가 가입을 거절합니다.
 *   → "Password should be at least 6 characters."
 *
 * 그래서 화면 안내와 검사를 여기 한 곳에서만 관리합니다.
 * (예전엔 안내는 '4자', 검사도 '4자'였는데 서버는 6자를 요구해서
 *  4~5자를 넣으면 가입 버튼을 누른 뒤에야 오류가 나왔습니다.)
 */
export const MIN_PASSWORD = 6;

/** 광고 1편을 보면 주는 캐시 */
export const AD_REWARD = 300;

/** 광고 보는 시간(초) */
export const AD_SECONDS = 5;

/** 고를 수 있는 동네 / 어린이집 (프로토타입이라 목록을 고정해 두었습니다) */
export const NEIGHBORHOODS = ["행복동", "푸른동", "한빛동"];
export const DAYCARES = ["행복어린이집", "푸른숲어린이집", "한빛어린이집"];

/**
 * 자주 쓰는 말 목록입니다.
 * 회원가입에서는 '눌러서 빠르게 넣기'용 추천으로만 쓰고, 직접 적을 수도 있습니다.
 * AI 매칭에서는 조건을 고르는 버튼으로 씁니다.
 */
export const PERSONALITY_TAGS = [
  "차분해요",
  "활발해요",
  "꼼꼼해요",
  "다정해요",
  "유머있어요",
  "책임감있어요",
];

export const SKILL_TAGS = [
  "요리",
  "함께 놀아주기",
  "책 읽어주기",
  "산책",
  "숙제 도움",
  "응급처치",
];

export const TIME_TAGS = ["아침", "낮", "저녁"];

// ---------------------------------------------------------------------------
// 카테고리별 색깔 - 여기서 정한 색을 앱 전체가 똑같이 씁니다.
//
// 글자를 읽지 않고 '색만 보고도' 무슨 상태인지 알 수 있어야 하므로,
// 한 번 정한 색은 화면마다 바꾸지 않습니다.
//
//   기다리는 중 = 코럴      |   수락 완료 = 더스티 블루
//   돌봄 끝    = 세이지 그린 |   취소됨   = 웜 그레이
//   (캐시는 어디서나 허니)
// ---------------------------------------------------------------------------

type StatusTheme = {
  label: string;
  /** 색을 못 알아보는 분들을 위해 모양(아이콘)도 함께 씁니다 (구글 아이콘 이름) */
  icon: string;
  /** 딱지·안내상자 배경과 글씨 */
  chip: string;
  /** 카드 왼쪽 색 띠 */
  bar: string;
};

const STATUS_THEME: Record<RequestStatus, StatusTheme> = {
  waiting: {
    label: "도움 기다리는 중",
    icon: "hourglass_top",
    chip: "bg-brand-tint text-brand-dark",
    bar: "bg-brand-mid",
  },
  accepted: {
    label: "수락 완료",
    icon: "handshake",
    chip: "bg-sky-tint text-sky-dark",
    bar: "bg-sky-mid",
  },
  done: {
    label: "돌봄 끝",
    icon: "check_circle",
    chip: "bg-leaf-tint text-leaf-dark",
    bar: "bg-leaf-mid",
  },
  canceled: {
    label: "취소됨",
    icon: "cancel",
    chip: "bg-muted-soft text-mocha",
    bar: "bg-sand",
  },
};

/** 상태에 맞는 색·이름·아이콘을 한 번에 돌려줍니다. */
export function statusTheme(status: RequestStatus): StatusTheme {
  return STATUS_THEME[status];
}

/** 상태를 화면에 보여줄 한국어 이름으로 바꿔줍니다. */
export function statusLabel(status: RequestStatus): string {
  return STATUS_THEME[status].label;
}

/**
 * 색 이름을 Tailwind 클래스로 바꿔줍니다.
 * (`bg-${색}-soft` 처럼 만들면 Tailwind가 못 알아듣기 때문에 미리 적어둡니다)
 */
export const TONE = {
  brand: { soft: "bg-brand-soft", text: "text-brand", dark: "text-brand-dark" },
  sky: { soft: "bg-sky-soft", text: "text-sky", dark: "text-sky-dark" },
  leaf: { soft: "bg-leaf-soft", text: "text-leaf", dark: "text-leaf-dark" },
  honey: { soft: "bg-honey-soft", text: "text-honey", dark: "text-honey-dark" },
} as const;

export type ToneName = keyof typeof TONE;
