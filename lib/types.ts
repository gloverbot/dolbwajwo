// 앱에서 쓰는 데이터 모양을 한 곳에 정리해 둡니다.
// (TypeScript의 type = "이 데이터는 이런 항목들을 갖는다"는 설명서)

/** 우리 아이 1명 (회원가입 때 등록해 둡니다) */
export type Child = {
  id: string;
  name: string;
  age: number;
  /** 알레르기·좋아하는 놀이처럼 돌봐줄 분이 알아야 할 것 */
  note: string;
};

/** 가입한 계정 1개 (부모님 정보) */
export type Account = {
  loginId: string; // 로그인 아이디
  password: string; // ⚠️ 프로토타입이라 그대로 저장합니다. 실제 서비스에선 절대 금지!
  name: string;
  personality: string[]; // 성격 (예: 차분해요, 활발해요)
  skills: string[]; // 잘하는 것 (예: 요리, 책읽기)
  avatar: string | null; // 프로필 사진 (작게 줄인 그림 데이터)
  videoName: string | null; // 자기소개 영상 파일 이름
  neighborhood: string;
  daycare: string;
  /** 우리 아이들 - 요청을 올릴 때 여기서 골라 씁니다 */
  children: Child[];
  createdAt: string;
};

/** 돌봄 요청의 진행 상태 */
export type RequestStatus = "waiting" | "accepted" | "done" | "canceled";

/** 돌봄 요청 1건 */
export type CareRequest = {
  id: string;
  parentName: string; // 아이를 맡기는 부모 이름
  daycare: string;
  // 아이 정보는 회원가입 때 등록해 둔 것을 그대로 가져옵니다.
  childName: string;
  childAge: number;
  childNote: string;
  place: string; // 어디서 만날지
  note: string; // 하고 싶은 말
  startAt: string; // 언제부터 (저장하기 쉽게 문자열로 둡니다)
  minutes: number; // 몇 분 (30 / 60 / 90 / 120)
  isMine: boolean; // 내가 올린 요청이면 true
  status: RequestStatus;
  helperName: string | null; // 돌봐주기로 한 사람 이름
};

/** 채팅 메시지 1개 */
export type ChatMessage = {
  id: string;
  from: "me" | "other" | "system";
  text: string;
  at: string;
};

/** 채팅방 1개 (요청을 수락하면 자동으로 만들어집니다) */
export type ChatRoom = {
  id: string;
  requestId: string | null;
  partnerName: string;
  title: string; // 예: "하준 돌봄 · 1시간"
  messages: ChatMessage[];
  createdAt: string;
};

/** 캐시가 들어오고 나간 기록 1줄 */
export type CashLog = {
  id: string;
  title: string;
  amount: number; // 플러스면 적립, 마이너스면 사용
  at: string;
};

/** 앱 알림 1건 */
export type AppNotification = {
  id: string;
  title: string;
  body: string;
  at: string;
  link: string | null; // 누르면 갈 주소
  isNew: boolean;
};

/** 내가 산 기프티콘 */
export type OwnedCoupon = {
  id: string;
  gifticonId: string;
  name: string;
  brand: string;
  code: string;
  boughtAt: string;
};

/** 앱 전체가 기억하는 데이터 */
export type AppData = {
  accounts: Account[];
  currentLoginId: string | null;
  showHomeGuide: boolean; // 가입 직후 홈에 안내문을 띄울지
  cash: number;
  requests: CareRequest[];
  rooms: ChatRoom[];
  cashLogs: CashLog[];
  notifications: AppNotification[];
  coupons: OwnedCoupon[];
};

/** 아직 아무것도 없는 처음 상태 */
export const emptyAppData: AppData = {
  accounts: [],
  currentLoginId: null,
  showHomeGuide: false,
  cash: 0,
  requests: [],
  rooms: [],
  cashLogs: [],
  notifications: [],
  coupons: [],
};
