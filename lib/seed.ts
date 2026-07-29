import type { ToneName } from "./policy";

// 프로토타입 시연에 쓰는 미리 만들어 둔 데이터들입니다.

/** 우리 동네 이웃 (AI 매칭 후보 + 채팅 상대) */
export type Neighbor = {
  id: string;
  name: string;
  personality: string[];
  skills: string[];
  times: string[]; // 도와줄 수 있는 시간대
  walkMinutes: number; // 걸어서 몇 분
  rating: number; // 이웃 평가 (5점 만점)
  helpCount: number; // 지금까지 도와준 횟수
  intro: string;
};

export const NEIGHBORS: Neighbor[] = [
  {
    id: "nb1",
    name: "최은주",
    personality: ["다정해요", "차분해요"],
    skills: ["책 읽어주기", "요리"],
    times: ["낮", "저녁"],
    walkMinutes: 3,
    rating: 4.9,
    helpCount: 24,
    intro: "두 아이를 키우고 있어요. 그림책 읽어주는 걸 좋아합니다.",
  },
  {
    id: "nb2",
    name: "박민호",
    personality: ["활발해요", "유머있어요"],
    skills: ["함께 놀아주기", "산책", "축구"],
    times: ["아침", "낮"],
    walkMinutes: 5,
    rating: 4.7,
    helpCount: 15,
    intro: "놀이터에서 신나게 놀아주는 건 자신 있어요! 공놀이도 같이 합니다.",
  },
  {
    id: "nb3",
    name: "이지우",
    personality: ["꼼꼼해요", "책임감있어요"],
    skills: ["숙제 도움", "책 읽어주기", "한글 공부"],
    times: ["저녁"],
    walkMinutes: 7,
    rating: 5.0,
    helpCount: 31,
    intro: "초등학생 숙제 봐주는 걸 자주 도와드렸어요.",
  },
  {
    id: "nb4",
    name: "김소연",
    personality: ["차분해요", "책임감있어요"],
    skills: ["응급처치", "요리"],
    times: ["아침", "저녁"],
    walkMinutes: 4,
    rating: 4.8,
    helpCount: 19,
    intro: "간호사로 일했어요. 응급 상황에 침착하게 대응합니다.",
  },
  {
    id: "nb5",
    name: "정해나",
    personality: ["활발해요", "다정해요"],
    skills: ["함께 놀아주기", "요리", "간식 만들기"],
    times: ["낮"],
    walkMinutes: 9,
    rating: 4.6,
    helpCount: 8,
    intro: "간식 만들어 주는 걸 좋아해요. 아이들과 잘 어울립니다.",
  },
  {
    id: "nb6",
    name: "윤도현",
    personality: ["유머있어요", "꼼꼼해요"],
    skills: ["산책", "숙제 도움"],
    times: ["아침", "낮", "저녁"],
    walkMinutes: 12,
    rating: 4.5,
    helpCount: 11,
    intro: "언제든 시간 맞춰 도와드릴 수 있어요.",
  },
  {
    id: "nb7",
    name: "한지민",
    personality: ["다정해요", "꼼꼼해요"],
    skills: ["그림 그리기", "만들기"],
    times: ["낮", "저녁"],
    walkMinutes: 6,
    rating: 4.9,
    helpCount: 22,
    intro: "미술학원에서 아이들을 가르쳤어요. 그림과 만들기를 좋아합니다.",
  },
  {
    id: "nb8",
    name: "서준호",
    personality: ["활발해요", "책임감있어요"],
    skills: ["자전거", "운동", "산책"],
    times: ["아침"],
    walkMinutes: 8,
    rating: 4.7,
    helpCount: 13,
    intro: "태권도를 배웠어요. 아이와 몸으로 놀아주는 걸 잘합니다.",
  },
  {
    id: "nb9",
    name: "오미래",
    personality: ["차분해요", "다정해요"],
    skills: ["피아노", "노래"],
    times: ["저녁"],
    walkMinutes: 10,
    rating: 4.8,
    helpCount: 9,
    intro: "피아노를 가르쳐요. 아이가 좋아하는 동요를 함께 부릅니다.",
  },
  {
    id: "nb10",
    name: "강수빈",
    personality: ["꼼꼼해요", "조용해요"],
    skills: ["영어", "숙제 도움"],
    times: ["낮", "저녁"],
    walkMinutes: 11,
    rating: 4.6,
    helpCount: 16,
    intro: "영어유치원에서 일했어요. 영어 그림책도 읽어줄 수 있어요.",
  },
  {
    id: "nb11",
    name: "문가영",
    personality: ["다정해요", "활발해요"],
    skills: ["낮잠 재우기", "이유식", "요리"],
    times: ["아침", "낮"],
    walkMinutes: 5,
    rating: 5.0,
    helpCount: 27,
    intro: "어린 아기도 잘 봅니다. 이유식과 낮잠 재우기에 익숙해요.",
  },
  {
    id: "nb12",
    name: "배진우",
    personality: ["유머있어요", "활발해요"],
    skills: ["보드게임", "함께 놀아주기"],
    times: ["저녁"],
    walkMinutes: 14,
    rating: 4.4,
    helpCount: 6,
    intro: "보드게임을 좋아해요. 비 오는 날 실내에서 잘 놀아줍니다.",
  },
  {
    id: "nb13",
    name: "신예린",
    personality: ["차분해요", "책임감있어요"],
    skills: ["책 읽어주기", "한글 공부"],
    times: ["아침", "낮"],
    walkMinutes: 7,
    rating: 4.9,
    helpCount: 20,
    intro: "유치원 교사였어요. 한글을 재미있게 알려줍니다.",
  },
  {
    id: "nb14",
    name: "조태윤",
    personality: ["꼼꼼해요", "다정해요"],
    skills: ["응급처치", "산책", "병원 동행"],
    times: ["낮", "저녁"],
    walkMinutes: 13,
    rating: 4.7,
    helpCount: 12,
    intro: "약사로 일하고 있어요. 아이가 아플 때 침착하게 봐드립니다.",
  },
];

/**
 * 비슷한 뜻의 말 묶음입니다.
 * AI 매칭에서 적은 말과 '뜻이 가까운 말'까지 함께 찾아보기 위해 씁니다.
 * 예) "공부"라고 적으면 "숙제 도움", "한글 공부", "영어"까지 찾아줍니다.
 */
export const WORD_GROUPS: string[][] = [
  ["요리", "간식", "음식", "이유식", "밥상"],
  ["공부", "숙제", "한글", "영어", "학습", "유치원", "교사"],
  ["책", "그림책", "독서", "읽어주기"],
  ["놀이", "놀아주기", "놀이터", "보드게임", "게임", "블록"],
  ["운동", "산책", "자전거", "축구", "태권도", "공놀이"],
  ["미술", "그림", "만들기", "그리기"],
  ["음악", "피아노", "노래", "동요"],
  ["안전", "응급", "응급처치", "간호", "약사", "병원"],
  ["아기", "낮잠", "이유식", "재우기"],
  ["차분", "조용", "얌전", "침착"],
  ["활발", "에너지", "신나"],
  ["다정", "따뜻", "친절", "상냥"],
  ["꼼꼼", "세심", "정리", "책임"],
  ["유머", "재미", "웃음"],
  ["아침", "오전"],
  ["낮", "오후", "점심"],
  ["저녁", "밤"],
];

/** 홈 화면 공지사항 */
export type Notice = {
  id: string;
  title: string;
  body: string;
  daysAgo: number;
  pinned: boolean;
};

export const NOTICES: Notice[] = [
  {
    id: "no1",
    title: "돌봐줘 서비스가 문을 열었어요",
    body: "같은 동네·같은 어린이집 부모님끼리 아이를 잠깐 맡기고 돌봐주는 서비스입니다. 캐시를 주고받으며 서로 도와요.",
    daysAgo: 0,
    pinned: true,
  },
  {
    id: "no2",
    title: "이웃 안전 수칙을 꼭 지켜주세요",
    body: "처음 만나는 이웃과는 어린이집 앞이나 놀이터처럼 사람이 많은 곳에서 만나주세요. 응급 상황에서는 119에 먼저 연락합니다.",
    daysAgo: 2,
    pinned: true,
  },
  {
    id: "no3",
    title: "광고를 보면 캐시를 드려요",
    body: "상점 화면 위쪽의 캐시를 누르면 짧은 광고를 보고 캐시를 받을 수 있어요.",
    daysAgo: 5,
    pinned: false,
  },
];

/** 상점에서 파는 기프티콘 */
export type Gifticon = {
  id: string;
  brand: string;
  name: string;
  price: number;
  icon: string; // 구글 아이콘 이름
  tone: ToneName;
};

export const GIFTICONS: Gifticon[] = [
  {
    id: "g1",
    brand: "동네 카페",
    name: "아메리카노 1잔",
    price: 4500,
    icon: "local_cafe",
    tone: "sky",
  },
  {
    id: "g2",
    brand: "편의점",
    name: "5,000원 금액권",
    price: 5000,
    icon: "storefront",
    tone: "leaf",
  },
  {
    id: "g3",
    brand: "아이스크림",
    name: "파인트 1개",
    price: 8000,
    icon: "icecream",
    tone: "sky",
  },
  {
    id: "g4",
    brand: "문구점",
    name: "아이 그림도구 세트",
    price: 9000,
    icon: "palette",
    tone: "brand",
  },
  {
    id: "g5",
    brand: "베이커리",
    name: "케이크 교환권",
    price: 12000,
    icon: "cake",
    tone: "brand",
  },
  {
    id: "g6",
    brand: "서점",
    name: "그림책 교환권",
    price: 15000,
    icon: "menu_book",
    tone: "honey",
  },
];

/** 채팅방에서 상대가 보내주는 자동 답장 (프로토타입 시연용) */
export const AUTO_REPLIES = [
  "네! 시간 맞춰 갈게요 :)",
  "혹시 아이가 못 먹는 음식이 있을까요?",
  "어린이집 정문 앞에서 뵐게요.",
  "걱정 마세요, 잘 돌보고 있을게요!",
  "지금 놀이터에서 잘 놀고 있어요.",
];
