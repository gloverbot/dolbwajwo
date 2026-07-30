"use client";

import { useState } from "react";

import { Icon } from "@/components/Icon";

/** 탭 하나에 들어가는 내용 */
const TABS = [
  {
    key: "daycare",
    label: "같은 어린이집",
    icon: "school",
    title: "모르는 사람에게는 알림이 가지 않아요.",
    body: "요청은 같은 어린이집을 적은 부모님에게만 보입니다. 등하원길에서 이미 얼굴을 마주친 사이끼리 연결되도록 범위를 좁혔어요.",
    bullets: ["같은 어린이집끼리만 노출", "동네 정보도 함께 확인", "낯선 사람 요청 차단"],
    bg: "bg-sky-soft",
    fg: "text-sky-dark",
    chip: "bg-sky-tint",
  },
  {
    key: "profile",
    label: "프로필과 영상",
    icon: "badge",
    title: "누가 돌봐주는지 미리 보고 결정해요.",
    body: "가입할 때 이름·성격·잘하는 것, 그리고 자기소개 영상을 남깁니다. 수락하기 전에 어떤 분인지 먼저 확인할 수 있어요.",
    bullets: ["성격과 잘하는 것 공개", "자기소개 영상", "우리 아이 정보는 따로 관리"],
    bg: "bg-leaf-soft",
    fg: "text-leaf-dark",
    chip: "bg-leaf-tint",
  },
  {
    key: "time",
    label: "최대 2시간",
    icon: "hourglass_top",
    title: "짧게, 부담 없이. 최대 2시간까지만.",
    body: "돌봄은 30분·1시간·1시간 30분·2시간 중에서만 고를 수 있습니다. 길게 맡기는 서비스가 아니라 '잠깐만' 도와주는 품앗이예요.",
    bullets: ["30분 단위로 선택", "2시간을 넘길 수 없음", "장소와 시간만 정하면 끝"],
    bg: "bg-brand-soft",
    fg: "text-brand-dark",
    chip: "bg-brand-tint",
  },
  {
    key: "privacy",
    label: "내 정보 보호",
    icon: "lock",
    title: "아이 정보는 부모님 본인만 볼 수 있어요.",
    body: "아이의 나이와 알레르기 같은 정보, 캐시 기록, 주고받은 대화는 본인과 상대방 외에는 아무도 열어볼 수 없게 막아 두었습니다.",
    bullets: ["아이 정보는 본인만", "대화는 두 사람만", "돌봄이 끝나면 채팅방 삭제"],
    bg: "bg-honey-soft",
    fg: "text-honey-dark",
    chip: "bg-honey-tint",
  },
] as const;

/** 눌러서 골라 보는 '안심 장치' 소개 */
export function SafetyTabs() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <div>
      {/* 위쪽 - 고르는 알약 버튼들 */}
      <div className="flex flex-wrap gap-2.5">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition ${
              i === active
                ? "bg-cocoa text-cream"
                : "border border-cocoa/15 text-mocha hover:border-cocoa/40"
            }`}
          >
            <Icon name={t.icon} filled className="text-lg" />
            {t.label}
          </button>
        ))}
      </div>

      {/* 아래쪽 - 고른 내용 */}
      <div className="mt-8 grid items-center gap-8 rounded-[2rem] border border-sand bg-white p-7 sm:rounded-[2.5rem] sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        {/* 왼쪽 그림 자리 */}
        <div
          className={`flex aspect-[4/3] items-center justify-center rounded-[1.5rem] sm:rounded-[2rem] ${tab.bg}`}
        >
          <span
            className={`flex h-28 w-28 items-center justify-center rounded-full ${tab.chip}`}
          >
            <Icon name={tab.icon} filled className={`text-6xl ${tab.fg}`} />
          </span>
        </div>

        {/* 오른쪽 글 */}
        <div>
          <h3 className="site-h3 text-cocoa">{tab.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-mocha">{tab.body}</p>
          <ul className="mt-6 space-y-2.5">
            {tab.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-base text-cocoa">
                <Icon name="check_circle" filled className={`text-xl ${tab.fg}`} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
