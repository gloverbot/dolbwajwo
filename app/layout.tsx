import type { Metadata, Viewport } from "next";

import { AppProvider } from "@/components/AppProvider";
import { AuthGate } from "@/components/AuthGate";
import { BottomNav } from "@/components/BottomNav";

import "./globals.css";

export const metadata: Metadata = {
  title: "돌봐줘 - 같은 동네 부모끼리 아이 돌봄",
  description:
    "갑자기 아이를 맡길 곳이 필요할 때, 같은 동네·같은 어린이집 부모님이 잠깐 돌봐주는 서비스",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FDF8F1",
};

/** 모든 화면을 감싸는 바깥 틀입니다. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 둥근 산세리프 한글 글꼴(Pretendard). 못 불러와도 기기 기본 글꼴로 잘 보입니다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* 구글 Material Symbols(Rounded) 아이콘 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <AppProvider>
          {/* 휴대폰 화면 크기로 가운데 정렬합니다. */}
          <div className="mx-auto min-h-screen w-full max-w-md bg-cream pb-28">
            {/* 로그인 안 한 사람은 여기서 로그인 화면으로 보내집니다 */}
            <AuthGate>{children}</AuthGate>
          </div>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
