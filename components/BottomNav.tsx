"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useApp } from "./AppProvider";
import { Icon } from "./Icon";

const TABS = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/store", label: "상점", icon: "storefront" },
  { href: "/chat", label: "채팅", icon: "chat_bubble" },
  { href: "/match", label: "AI 매칭", icon: "auto_awesome" },
  { href: "/me", label: "나의", icon: "person" },
];

/** 화면 아래에 항상 붙어 있는 탭 5개 */
export function BottomNav() {
  const pathname = usePathname();
  const { data, ready, me } = useApp();

  // 로그인 전에는 탭을 숨깁니다.
  if (!ready || !me || pathname === "/login") return null;

  const newCount = data.notifications.filter((n) => n.isNew).length;

  // 안 읽은 채팅이 있는 방 개수 (상대가 마지막으로 말한 방)
  const chatCount = data.rooms.filter((room) => {
    const last = room.messages[room.messages.length - 1];
    return last && last.from === "other";
  }).length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-sand bg-white">
      <div className="mx-auto flex w-full max-w-md">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

          let badge = 0;
          if (tab.href === "/") badge = newCount;
          if (tab.href === "/chat") badge = chatCount;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-sm font-bold ${
                active ? "text-brand-dark" : "text-mocha"
              }`}
            >
              <span
                className={`relative rounded-full px-3 py-1 ${
                  active ? "bg-brand-soft" : ""
                }`}
              >
                {/* 지금 보고 있는 탭은 속이 꽉 찬 아이콘으로 표시합니다 */}
                <Icon name={tab.icon} filled={active} className="text-2xl" />
                {badge > 0 && (
                  <span className="absolute -right-1 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                    {badge}
                  </span>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
