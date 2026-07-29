import { createClient } from "@supabase/supabase-js";

/**
 * Supabase에 연결하는 곳입니다.
 *
 * 주소와 키는 코드에 직접 적지 않고 `.env.local` 파일에서 가져옵니다.
 * (`.env.local`은 GitHub에 올라가지 않습니다)
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// 새 방식(publishable)과 예전 방식(anon) 둘 다 받아줍니다.
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** 아직 Supabase를 연결하지 않았으면 false가 됩니다. */
export const isSupabaseReady = Boolean(url && key);

export const supabase = createClient(url ?? "http://localhost", key ?? "none", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * 아이디를 로그인용 이메일로 바꿀 때 쓰는 도메인입니다.
 *
 * `example.com`은 "예시용"으로 정해져 있어 실제로는 메일이 가지 않는 주소입니다.
 * (직접 지은 도메인은 Supabase가 "없는 주소"라며 거부하기 때문에 이걸 씁니다)
 */
const AUTH_EMAIL_DOMAIN = "example.com";

/**
 * 사용자가 적은 '아이디'를 로그인용 이메일로 바꿔줍니다.
 * Supabase 로그인은 이메일이 필요한데, 우리 앱은 아이디만 받기 때문입니다.
 * 예) hana123 → hana123@example.com
 */
export function loginIdToEmail(loginId: string): string {
  return `${loginId.trim().toLowerCase()}@${AUTH_EMAIL_DOMAIN}`;
}
