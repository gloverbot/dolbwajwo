import { AppProvider } from "@/components/AppProvider";
import { AuthGate } from "@/components/AuthGate";
import { BottomNav } from "@/components/BottomNav";

/**
 * '앱' 화면들(홈·채팅·상점·나의 ...)만 감싸는 틀입니다.
 *
 * 소개 홈페이지(/intro)는 이 틀을 쓰지 않기 때문에
 * 로그인 검사도, 아래쪽 메뉴바도 나오지 않습니다.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      {/* 휴대폰 화면 크기로 가운데 정렬합니다. */}
      <div className="mx-auto min-h-screen w-full max-w-md bg-cream pb-28">
        {/* 로그인 안 한 사람은 여기서 로그인 화면으로 보내집니다 */}
        <AuthGate>{children}</AuthGate>
      </div>
      <BottomNav />
    </AppProvider>
  );
}
