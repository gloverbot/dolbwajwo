"use client";

import Link from "next/link";
import { useState } from "react";

import { useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import { RequestCard } from "@/components/RequestCard";
import {
  Avatar,
  EmptyBox,
  SafetyNotice,
  SectionTitle,
} from "@/components/Ui";
import { formatAgo, formatCash } from "@/lib/format";
import { CASH_PER_HOUR, MAX_MINUTES } from "@/lib/policy";
import { NOTICES } from "@/lib/seed";

/** 홈: 공지사항 · 알림 · 우리 동네 도움 요청 */
export default function HomePage() {
  const { data, me, hideHomeGuide, markNotificationsRead } = useApp();
  const [tab, setTab] = useState<"notice" | "alarm">("notice");

  if (!me) return null;

  const neighborOpen = data.requests.filter(
    (r) => !r.isMine && r.status === "waiting"
  );
  const myOngoing = data.requests.filter(
    (r) => r.isMine && (r.status === "waiting" || r.status === "accepted")
  );
  const newCount = data.notifications.filter((n) => n.isNew).length;

  return (
    <main className="px-5 py-6">
      {/* 인사 + 캐시 */}
      <section className="flex items-center gap-3">
        <Avatar src={me.avatar} name={me.name} size={52} />
        <div className="min-w-0 flex-1">
          <p className="text-base text-mocha">안녕하세요</p>
          <p className="truncate text-lg font-bold text-cocoa">
            {me.name} 님
          </p>
          <p className="truncate text-base text-mocha">
            {me.neighborhood} · {me.daycare}
          </p>
        </div>
        <Link
          href="/store"
          className="flex shrink-0 items-center gap-1 rounded-full bg-honey-soft px-3 py-2 font-bold text-honey-dark"
        >
          <Icon name="savings" filled className="text-xl" />
          {formatCash(data.cash)}
        </Link>
      </section>

      {/* 처음 가입한 사람에게만 보여주는 안내문 */}
      {data.showHomeGuide && (
        <section className="mt-5 rounded-3xl border-2 border-brand-mid bg-brand-soft p-5">
          <div className="flex items-start gap-2">
            <Icon name="waving_hand" filled className="text-2xl text-brand" />
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold text-brand-dark">
                돌봐줘에 오신 걸 환영해요!
              </p>
              <ol className="mt-3 space-y-2 text-base leading-relaxed text-cocoa">
                <GuideStep n={1}>
                  급할 때 <b>아이 맡기기</b>를 누르면 같은 동네 부모님들에게
                  알림이 갑니다.
                </GuideStep>
                <GuideStep n={2}>
                  이웃 아이를 돌봐주면 <b>캐시</b>를 받아요. 1시간에{" "}
                  {formatCash(CASH_PER_HOUR)} 캐시.
                </GuideStep>
                <GuideStep n={3}>
                  수락하면 <b>채팅방</b>이 자동으로 만들어져요.
                </GuideStep>
                <GuideStep n={4}>
                  모은 캐시는 <b>상점</b>에서 기프티콘으로 바꿀 수 있어요.
                </GuideStep>
              </ol>
              <button
                className="btn-primary mt-4 py-3 text-lg"
                onClick={hideHomeGuide}
              >
                알겠어요
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 가장 중요한 행동 - 포인트 컬러는 여기만 */}
      <Link
        href="/new"
        className="btn-primary mt-5 flex items-center justify-center gap-2"
      >
        <Icon name="notifications_active" filled className="text-2xl" />
        지금 아이 맡기기
      </Link>
      <p className="mt-3 text-center text-base leading-relaxed text-mocha">
        30분부터 최대 {MAX_MINUTES / 60}시간까지 맡길 수 있어요.
      </p>

      {/* 공지사항 / 알림 */}
      <section className="mt-8">
        <div className="flex gap-2 rounded-3xl bg-muted-soft p-1.5">
          <button
            onClick={() => setTab("notice")}
            className={`flex-1 rounded-2xl py-2.5 text-lg font-bold transition ${
              tab === "notice" ? "bg-white text-brand-dark shadow-sm" : "text-mocha"
            }`}
          >
            공지사항
          </button>
          <button
            onClick={() => {
              setTab("alarm");
              markNotificationsRead();
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-lg font-bold transition ${
              tab === "alarm" ? "bg-white text-brand-dark shadow-sm" : "text-mocha"
            }`}
          >
            알림
            {newCount > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-brand px-1 text-sm text-white">
                {newCount}
              </span>
            )}
          </button>
        </div>

        <div className="mt-4">
          {tab === "notice" ? <NoticeList /> : <AlarmList />}
        </div>
      </section>

      {/* 내가 올린 요청 */}
      {myOngoing.length > 0 && (
        <section className="mt-8">
          <SectionTitle>내가 올린 요청</SectionTitle>
          <div className="space-y-3">
            {myOngoing.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        </section>
      )}

      {/* 우리 동네 도움 요청 */}
      <section className="mt-8">
        <SectionTitle
          right={
            <Link
              href="/match"
              className="flex items-center gap-1 text-base font-bold text-brand-dark"
            >
              AI 매칭
              <Icon name="chevron_right" className="text-xl" />
            </Link>
          }
        >
          우리 동네 도움 요청 ({neighborOpen.length})
        </SectionTitle>

        {neighborOpen.length === 0 ? (
          <EmptyBox icon="inbox">
            지금은 도움을 기다리는 요청이 없어요.
          </EmptyBox>
        ) : (
          <div className="space-y-3">
            {neighborOpen.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-8">
        <SafetyNotice />
      </div>
    </main>
  );
}

function GuideStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

/** 공지사항 목록 */
function NoticeList() {
  const [openId, setOpenId] = useState<string | null>(NOTICES[0].id);

  return (
    <ul className="space-y-3">
      {NOTICES.map((notice) => {
        const open = openId === notice.id;
        return (
          <li key={notice.id} className="card p-0">
            <button
              className="flex w-full items-start gap-3 p-5 text-left"
              onClick={() => setOpenId(open ? null : notice.id)}
            >
              <Icon
                name={notice.pinned ? "campaign" : "info"}
                filled
                className={`shrink-0 text-2xl ${
                  notice.pinned ? "text-brand" : "text-brand-mid"
                }`}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-cocoa">
                  {notice.title}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {notice.daysAgo === 0 ? "오늘" : `${notice.daysAgo}일 전`}
                </span>
              </span>
              <Icon
                name={open ? "expand_less" : "expand_more"}
                className="shrink-0 text-2xl text-mocha"
              />
            </button>
            {open && (
              <p className="border-t border-sand px-5 py-4 text-base leading-relaxed text-mocha">
                {notice.body}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** 알림 목록 */
function AlarmList() {
  const { data } = useApp();

  if (data.notifications.length === 0) {
    return <EmptyBox icon="notifications_off">아직 알림이 없어요.</EmptyBox>;
  }

  return (
    <ul className="space-y-3">
      {data.notifications.map((item) => {
        const body = (
          <div className="card flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
              <Icon name="notifications" filled className="text-xl text-brand" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-cocoa">{item.title}</p>
              <p className="mt-1 text-base leading-relaxed text-mocha">
                {item.body}
              </p>
              <p className="mt-2 text-sm text-muted">{formatAgo(item.at)}</p>
            </div>
            {item.link && (
              <Icon name="chevron_right" className="shrink-0 text-2xl text-mocha" />
            )}
          </div>
        );

        return (
          <li key={item.id}>
            {item.link ? (
              <Link href={item.link} className="block">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );
}
