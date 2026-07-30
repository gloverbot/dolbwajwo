"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "@/components/Icon";

/**
 * 소개 홈페이지 맨 위에 항상 붙어 있는 메뉴줄입니다.
 *
 * 첫 화면(어두운 사진) 위에서는 '투명 + 흰 글씨',
 * 아래로 내려가면 '크림색 바탕 + 진한 글씨'로 바뀝니다.
 */
export function SiteHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    // 첫 화면을 거의 다 지나갔는지 확인합니다.
    function onScroll() {
      setSolid(window.scrollY > window.innerHeight - 100);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-sand bg-cream/90 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="site-wrap flex h-[72px] items-center justify-between">
        {/* 왼쪽 - 서비스 이름 */}
        <Link
          href="/intro"
          className={`flex items-center gap-2 text-xl font-bold tracking-[-0.02em] ${
            solid ? "text-cocoa" : "text-white"
          }`}
        >
          <Icon
            name="cottage"
            filled
            className={`text-2xl ${solid ? "text-brand" : "text-white"}`}
          />
          돌봐줘
        </Link>

        {/* 가운데 - 좁은 화면에서는 숨깁니다 */}
        <nav
          className={`hidden items-center gap-9 text-[15px] font-semibold md:flex ${
            solid ? "text-mocha" : "text-white/85"
          }`}
        >
          <a href="#how" className="transition hover:opacity-60">
            이용 방법
          </a>
          <a href="#features" className="transition hover:opacity-60">
            주요 기능
          </a>
          <a href="#cash" className="transition hover:opacity-60">
            캐시
          </a>
          <a href="#faq" className="transition hover:opacity-60">
            자주 묻는 질문
          </a>
        </nav>

        {/* 오른쪽 - 앱으로 가는 버튼 */}
        <Link
          href="/"
          className={
            solid
              ? "inline-flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-[15px] font-semibold text-cream transition hover:bg-brand-dark"
              : "inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-cocoa transition hover:bg-white/85"
          }
        >
          앱 시작하기
        </Link>
      </div>
    </header>
  );
}
