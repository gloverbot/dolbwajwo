"use client";

import { useState } from "react";

import { getVideoUrl, useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import { RequestCard } from "@/components/RequestCard";
import {
  Avatar,
  EmptyBox,
  PageHeader,
  SectionTitle,
  Tag,
} from "@/components/Ui";
import { formatCash, formatDateTime } from "@/lib/format";
import { CASH_PER_HOUR, MAX_MINUTES, WELCOME_CASH, durationCash } from "@/lib/policy";

type Tab = "requests" | "account" | "settings";

/** 나의 페이지: 내 요청 · 계정정보 · 설정 */
export default function MePage() {
  const { data, me } = useApp();
  const [tab, setTab] = useState<Tab>("requests");

  if (!me) return null;

  return (
    <>
      <PageHeader title="나의" />

      <main className="px-5 py-6">
        {/* 프로필 */}
        <section className="card flex items-center gap-4">
          <Avatar src={me.avatar} name={me.name} size={64} />
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-bold text-cocoa">{me.name} 부모님</p>
            <p className="mt-0.5 truncate text-base text-mocha">
              {me.neighborhood} · {me.daycare}
            </p>
          </div>
        </section>

        {/* 캐시 */}
        <section className="mt-4 flex items-center gap-3 rounded-3xl border border-honey-tint bg-honey-soft p-5">
          <Icon name="savings" filled className="text-3xl text-honey" />
          <div>
            <p className="text-base text-mocha">내 캐시</p>
            <p className="text-3xl font-bold text-honey-dark">
              {formatCash(data.cash)} 캐시
            </p>
          </div>
        </section>

        {/* 탭 */}
        <div className="mt-6 flex gap-2 rounded-3xl bg-muted-soft p-1.5">
          <TabButton on={tab === "requests"} onClick={() => setTab("requests")}>
            내 요청
          </TabButton>
          <TabButton on={tab === "account"} onClick={() => setTab("account")}>
            계정정보
          </TabButton>
          <TabButton on={tab === "settings"} onClick={() => setTab("settings")}>
            설정
          </TabButton>
        </div>

        <div className="mt-6">
          {tab === "requests" && <RequestTab />}
          {tab === "account" && <AccountTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </main>
    </>
  );
}

function TabButton({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-2xl py-2.5 text-lg font-bold transition ${
        on ? "bg-white text-brand-dark shadow-sm" : "text-mocha"
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 내가 올린 요청 / 내가 수행한 요청
// ---------------------------------------------------------------------------
function RequestTab() {
  const { data, me } = useApp();
  if (!me) return null;

  const myRequests = data.requests.filter((r) => r.isMine);
  const myHelped = data.requests.filter(
    (r) => !r.isMine && r.helperName === me.name
  );
  const doneCount = myHelped.filter((r) => r.status === "done").length;
  const earned = myHelped
    .filter((r) => r.status === "done")
    .reduce((sum, r) => sum + durationCash(r.minutes), 0);

  return (
    <>
      {/* 한눈에 보는 기록 */}
      <div className="grid grid-cols-3 gap-3">
        <Stat icon="upload" label="올린 요청" value={`${myRequests.length}건`} />
        <Stat icon="handshake" label="도와준 횟수" value={`${doneCount}회`} />
        <Stat
          icon="savings"
          label="번 캐시"
          value={formatCash(earned)}
        />
      </div>

      <section className="mt-7">
        <SectionTitle>내가 올린 요청 ({myRequests.length})</SectionTitle>
        {myRequests.length === 0 ? (
          <EmptyBox icon="post_add">아직 올린 요청이 없어요.</EmptyBox>
        ) : (
          <div className="space-y-3">
            {myRequests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <SectionTitle>내가 수행한 요청 ({myHelped.length})</SectionTitle>
        {myHelped.length === 0 ? (
          <EmptyBox icon="volunteer_activism">
            아직 돌봐준 아이가 없어요.
            <br />
            홈에서 이웃 요청을 수락해보세요.
          </EmptyBox>
        ) : (
          <div className="space-y-3">
            {myHelped.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <SectionTitle>캐시 기록</SectionTitle>
        {data.cashLogs.length === 0 ? (
          <EmptyBox icon="receipt_long">아직 기록이 없어요.</EmptyBox>
        ) : (
          <ul className="space-y-3">
            {data.cashLogs.map((log) => (
              <li key={log.id} className="card flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-cocoa">{log.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDateTime(log.at)}
                  </p>
                </div>
                {/* 들어온 캐시는 세이지, 나간 캐시는 코럴 */}
                <span
                  className={`shrink-0 text-xl font-bold ${
                    log.amount > 0 ? "text-leaf-dark" : "text-brand-dark"
                  }`}
                >
                  {log.amount > 0 ? "+" : ""}
                  {formatCash(log.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4 text-center">
      <Icon name={icon} filled className="text-2xl text-brand" />
      <p className="mt-1 text-lg font-bold text-cocoa">{value}</p>
      <p className="text-sm text-mocha">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 계정정보
// ---------------------------------------------------------------------------
function AccountTab() {
  const { me } = useApp();
  if (!me) return null;

  const videoUrl = getVideoUrl(me.loginId);

  return (
    <>
      <section className="card">
        <Row icon="badge" label="이름" value={me.name} />
        <Row icon="person" label="아이디" value={me.loginId} />
        <Row icon="lock" label="비밀번호" value="Supabase가 안전하게 보관 중" />
        <Row icon="home_pin" label="동네" value={me.neighborhood} />
        <Row icon="school" label="어린이집" value={me.daycare} />
        <Row
          icon="event"
          label="가입일"
          value={formatDateTime(me.createdAt)}
          last
        />
      </section>

      <section className="mt-6">
        <SectionTitle>우리 아이</SectionTitle>
        <ul className="space-y-3">
          {me.children.map((child) => (
            <li key={child.id} className="card flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand-dark">
                {child.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-cocoa">
                  {child.name} ({child.age}살)
                </p>
                {child.note && (
                  <p className="mt-1 text-base leading-relaxed text-mocha">
                    {child.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <SectionTitle>성격</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {me.personality.map((t) => (
            <Tag key={t} tone="honey">
              {t}
            </Tag>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle>잘하는 것</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {me.skills.map((t) => (
            <Tag key={t} tone="leaf">
              {t}
            </Tag>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle>자기소개 영상</SectionTitle>
        {videoUrl ? (
          <video src={videoUrl} controls className="w-full rounded-3xl" />
        ) : me.videoName ? (
          <div className="card flex items-start gap-3">
            <Icon name="movie" filled className="shrink-0 text-2xl text-brand" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-cocoa">
                {me.videoName}
              </p>
              <p className="mt-1 text-base leading-relaxed text-mocha">
                프로토타입이라 영상 파일 자체는 저장하지 않아요. 새로고침하면
                파일 이름만 남습니다.
              </p>
            </div>
          </div>
        ) : (
          <EmptyBox icon="videocam_off">등록한 영상이 없어요.</EmptyBox>
        )}
      </section>
    </>
  );
}

function Row({
  icon,
  label,
  value,
  last = false,
}: {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 py-3 ${
        last ? "" : "border-b border-sand"
      }`}
    >
      <Icon name={icon} className="shrink-0 text-xl text-mocha" />
      <span className="text-lg text-mocha">{label}</span>
      <span className="min-w-0 flex-1 truncate text-right text-lg font-bold text-cocoa">
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 설정
// ---------------------------------------------------------------------------
function SettingsTab() {
  const { logOut, resetAll } = useApp();
  const [askReset, setAskReset] = useState(false);
  const [alarm, setAlarm] = useState(true);
  const [nearby, setNearby] = useState(true);

  return (
    <>
      <section className="card">
        <Toggle
          icon="notifications"
          label="도움 요청 알림 받기"
          on={alarm}
          onChange={setAlarm}
        />
        <Toggle
          icon="near_me"
          label="가까운 이웃만 보기"
          on={nearby}
          onChange={setNearby}
          last
        />
      </section>
      <p className="mt-2 text-base text-mocha">
        설정은 프로토타입이라 화면에서만 바뀝니다.
      </p>

      <section className="mt-6">
        <SectionTitle>캐시 규칙</SectionTitle>
        <ul className="card space-y-3 text-lg leading-relaxed">
          <RuleLine icon="redeem">
            가입하면 {formatCash(WELCOME_CASH)} 캐시를 드려요.
          </RuleLine>
          <RuleLine icon="handshake">
            1시간 돌봐주면 {formatCash(CASH_PER_HOUR)} 캐시를 받아요.
          </RuleLine>
          <RuleLine icon="timer">
            한 번에 맡길 수 있는 시간은 최대 {MAX_MINUTES / 60}시간이에요.
          </RuleLine>
        </ul>
      </section>

      <button className="btn-outline mt-6" onClick={() => void logOut()}>
        로그아웃
      </button>

      {/* 프로토타입 시연용 초기화 */}
      <section className="mt-8">
        <SectionTitle>프로토타입 도구</SectionTitle>
        {askReset ? (
          <div className="rounded-3xl border-2 border-clay bg-clay-soft p-5">
            <p className="text-lg font-bold text-cocoa">
              모든 데이터를 지우고 처음부터 다시 시작할까요?
            </p>
            <p className="mt-1 text-base leading-relaxed text-mocha">
              계정, 캐시, 요청, 채팅, 기프티콘이 <b>모두 사라집니다.</b> 앱이
              회원가입 화면부터 다시 시작해요.
            </p>
            <div className="mt-4 flex gap-3">
              <button className="btn-outline" onClick={() => setAskReset(false)}>
                아니요
              </button>
              <button className="btn-quiet" onClick={() => void resetAll()}>
                모두 지우기
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn-quiet flex items-center justify-center gap-2"
            onClick={() => setAskReset(true)}
          >
            <Icon name="restart_alt" className="text-2xl" />
            데이터 초기화하고 다시 시작
          </button>
        )}
      </section>
    </>
  );
}

function Toggle({
  icon,
  label,
  on,
  onChange,
  last = false,
}: {
  icon: string;
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 py-3 ${
        last ? "" : "border-b border-sand"
      }`}
    >
      <Icon name={icon} className="shrink-0 text-xl text-mocha" />
      <span className="flex-1 text-lg text-cocoa">{label}</span>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={`flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition ${
          on ? "bg-brand" : "bg-sand"
        }`}
      >
        <span
          className={`h-6 w-6 rounded-full bg-white transition ${
            on ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}

function RuleLine({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-2">
      <Icon name={icon} filled className="mt-0.5 shrink-0 text-xl text-honey" />
      <span>{children}</span>
    </li>
  );
}
