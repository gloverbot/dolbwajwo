import Link from "next/link";

import { Icon } from "@/components/Icon";
import { SiteHeader } from "@/components/landing/SiteHeader";

/**
 * 소개 홈페이지 전용 틀입니다.
 *
 * 앱 화면과 달리 폭을 좁히지 않고(=휴대폰 크기로 가두지 않고)
 * 넓은 화면을 그대로 씁니다. 맨 위 메뉴줄과 맨 아래 정보를 여기서 붙입니다.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-cocoa">
      <SiteHeader />

      <main>{children}</main>

      {/* ── 맨 아래 정보 ─────────────────────────────────────────────────── */}
      <footer className="bg-cocoa text-cream">
        <div className="site-wrap py-20 sm:py-28">
          <p className="max-w-[22ch] text-[2rem] font-semibold leading-[1.15] tracking-[-0.03em] sm:max-w-[26ch] sm:text-5xl">
            갑자기 일이 생긴 날에도, 아이는 아는 얼굴 옆에.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-base font-semibold text-cocoa transition hover:bg-white"
            >
              앱 시작하기
              <Icon name="arrow_forward" className="text-lg" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-base font-semibold text-cream transition hover:border-cream/70"
            >
              이용 방법 다시 보기
            </a>
          </div>

          {/* 링크 묶음 */}
          <div className="mt-16 grid gap-10 border-t border-cream/15 pt-12 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cream/50">
                서비스
              </p>
              <ul className="mt-4 space-y-2.5 text-base text-cream/85">
                <li>
                  <a href="#how" className="transition hover:text-white">
                    이용 방법
                  </a>
                </li>
                <li>
                  <a href="#features" className="transition hover:text-white">
                    주요 기능
                  </a>
                </li>
                <li>
                  <a href="#cash" className="transition hover:text-white">
                    캐시
                  </a>
                </li>
                <li>
                  <a href="#faq" className="transition hover:text-white">
                    자주 묻는 질문
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cream/50">
                앱 화면
              </p>
              <ul className="mt-4 space-y-2.5 text-base text-cream/85">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    홈
                  </Link>
                </li>
                <li>
                  <Link href="/match" className="transition hover:text-white">
                    AI 매칭
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="transition hover:text-white">
                    상점
                  </Link>
                </li>
                <li>
                  <Link href="/me" className="transition hover:text-white">
                    나의
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cream/50">
                알려드립니다
              </p>
              <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-cream/70">
                돌봐줘는 고등학생 팀이 만든 시험용 서비스(프로토타입)입니다.
                실제 돌봄 계약이나 보험을 대신하지 않으며, 아이의 건강 문제는
                반드시 의료진과 상담해 주세요.
              </p>
            </div>
          </div>

          <p className="mt-14 flex items-center gap-2 text-sm text-cream/50">
            <Icon name="cottage" filled className="text-lg" />
            돌봐줘 · © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
