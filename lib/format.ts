// 숫자와 시간을 사람이 읽기 좋게 바꿔주는 도우미 모음입니다.

/** 6000 → "6,000" */
export function formatCash(value: number): string {
  const digits = Math.abs(value).toString();
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) result += ",";
    result += digits[i];
  }
  return (value < 0 ? "-" : "") + result;
}

/** 날짜를 "오늘 / 내일 / 8월 3일" 로 바꿔줍니다. */
export function formatDay(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "내일";
  if (diffDays === -1) return "어제";
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** 시각을 "오후 3:30" 으로 바꿔줍니다. */
export function formatClock(iso: string): string {
  const date = new Date(iso);
  const isMorning = date.getHours() < 12;
  let hour = date.getHours() % 12;
  if (hour === 0) hour = 12;
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${isMorning ? "오전" : "오후"} ${hour}:${minute}`;
}

/** 90 → "1시간 30분", 60 → "1시간", 30 → "30분" */
export function formatDuration(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (hour === 0) return `${min}분`;
  if (min === 0) return `${hour}시간`;
  return `${hour}시간 ${min}분`;
}

/** "오늘 오후 3:30 ~ 오후 5:00 (1시간 30분)" 형태로 만들어 줍니다. */
export function formatTimeRange(startIso: string, minutes: number): string {
  const end = new Date(
    new Date(startIso).getTime() + minutes * 60 * 1000
  ).toISOString();
  return `${formatDay(startIso)} ${formatClock(startIso)} ~ ${formatClock(
    end
  )} (${formatDuration(minutes)})`;
}

/** 알림 시각을 "방금 전 / 5분 전" 으로 바꿔줍니다. */
export function formatAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

/** "8월 3일 오후 3:30" 처럼 날짜와 시각을 함께 보여줍니다. */
export function formatDateTime(iso: string): string {
  return `${formatDay(iso)} ${formatClock(iso)}`;
}

/** 기프티콘 교환 번호처럼 보이는 문자열을 만들어 줍니다. */
export function makeCouponCode(): string {
  const block = () =>
    Math.floor(1000 + Math.random() * 9000)
      .toString()
      .slice(0, 4);
  return `${block()}-${block()}-${block()}`;
}

/** 겹치지 않는 아이디를 만들어 줍니다. */
export function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

/** "14:30" 같은 시각 문자열을 오늘(또는 내일) 날짜에 붙여 실제 시각으로 만듭니다. */
export function timeStringToIso(time: string): string {
  const [hourText, minuteText] = time.split(":");
  const now = new Date();
  const result = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Number(hourText),
    Number(minuteText)
  );
  // 이미 지난 시각이면 내일로 넘깁니다.
  if (result.getTime() < now.getTime()) {
    result.setDate(result.getDate() + 1);
  }
  return result.toISOString();
}
