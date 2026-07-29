"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useApp } from "./AppProvider";

/** 데이터를 불러오는 동안 잠깐 보여주는 화면 */
export function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <p className="text-lg text-mocha">잠시만 기다려 주세요...</p>
    </div>
  );
}

/**
 * 앱을 처음 켰을 때 로그인/회원가입을 안 한 사람은
 * 무조건 로그인 화면(/login)으로 보냅니다.
 * 로그인이 끝나야 다른 화면을 볼 수 있습니다.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, me } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!ready) return;
    if (!me && !isLoginPage) router.replace("/login");
    if (me && isLoginPage) router.replace("/");
  }, [ready, me, isLoginPage, router]);

  if (!ready) return <Loading />;
  // 보낼 곳으로 옮겨가는 아주 짧은 순간에는 로딩 화면을 보여줍니다.
  if (!me && !isLoginPage) return <Loading />;
  if (me && isLoginPage) return <Loading />;

  return <>{children}</>;
}
