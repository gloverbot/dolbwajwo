"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import { EmptyBox, PageHeader, SafetyNotice } from "@/components/Ui";
import {
  formatCash,
  formatClock,
  formatDay,
  formatDuration,
  timeStringToIso,
} from "@/lib/format";
import { DURATIONS, durationCash } from "@/lib/policy";

/** 처음 열었을 때 기본 시각: 지금부터 1시간 뒤, 정각 */
function defaultTime(): string {
  const later = new Date(Date.now() + 60 * 60 * 1000);
  return `${later.getHours().toString().padStart(2, "0")}:00`;
}

/**
 * 아이를 맡기는 요청을 적는 화면입니다.
 * 아이 정보는 회원가입 때 등록해 뒀으므로, 여기서는
 * '어디서 만날지'와 '언제 · 얼마나'만 정하면 됩니다.
 */
export default function NewRequestPage() {
  const router = useRouter();
  const { data, me, createRequest } = useApp();

  const [childId, setChildId] = useState(me?.children[0]?.id ?? "");
  const [time, setTime] = useState(defaultTime);
  const [minutes, setMinutes] = useState(60);
  const [place, setPlace] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!me) return null;

  // 아이를 한 명도 등록하지 않은 경우 (보통은 가입 때 등록합니다)
  if (me.children.length === 0) {
    return (
      <>
        <PageHeader title="아이 맡기기" backHref="/" />
        <main className="px-5 py-10">
          <EmptyBox icon="child_care">
            등록된 아이가 없어요.
            <br />
            먼저 아이를 등록해주세요.
          </EmptyBox>
          <Link href="/me" className="btn-outline mt-5">
            나의 정보로 가기
          </Link>
        </main>
      </>
    );
  }

  const child = me.children.find((c) => c.id === childId) ?? me.children[0];
  const startAt = timeStringToIso(time);
  const price = durationCash(minutes);
  const notEnoughCash = data.cash < price;

  async function handleSubmit() {
    if (!place.trim()) {
      setError("어디서 만날지 적어주세요.");
      return;
    }

    const id = await createRequest({
      childId: child.id,
      place: place.trim(),
      note: note.trim(),
      startAt,
      minutes,
    });

    if (!id) {
      setError(
        "캐시가 부족해요. 이웃 아이를 돌봐주거나 광고를 보면 모을 수 있어요."
      );
      return;
    }
    router.push(`/request/${id}`);
  }

  return (
    <>
      <PageHeader title="아이 맡기기" backHref="/" />

      <main className="px-5 py-6">
        {/* 어떤 아이인지 - 가입 때 등록해 둔 정보를 그대로 씁니다 */}
        <section className="card">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xl font-bold text-brand-dark">
              {child.name.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold text-cocoa">
                {child.name} ({child.age}살)
              </p>
              <p className="text-base text-mocha">등록해 둔 우리 아이</p>
            </div>
          </div>
          {child.note && (
            <p className="mt-3 rounded-2xl bg-muted-soft px-4 py-3 text-base leading-relaxed text-mocha">
              {child.note}
            </p>
          )}

          {/* 아이가 두 명 이상이면 누구를 맡길지 고릅니다 */}
          {me.children.length > 1 && (
            <div className="mt-4">
              <span className="label-text">누구를 맡길까요?</span>
              <div className="flex flex-wrap gap-2">
                {me.children.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`pick ${c.id === child.id ? "pick-on" : ""}`}
                    onClick={() => setChildId(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 어디서 만날지 */}
        <div className="mt-6">
          <label className="label-text" htmlFor="place">
            어디서 만날까요?
          </label>
          <input
            id="place"
            className="input-box"
            placeholder={`예) ${me.daycare} 정문 앞`}
            value={place}
            onChange={(e) => {
              setPlace(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* 언제부터 */}
        <div className="mt-6">
          <label className="label-text" htmlFor="time">
            언제부터
          </label>
          <input
            id="time"
            type="time"
            className="input-box"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <p className="mt-2 text-base text-mocha">
            {formatDay(startAt)} {formatClock(startAt)}부터 시작해요.
          </p>
        </div>

        {/* 얼마나 - 30분씩 네 가지 중에서 고릅니다 */}
        <div className="mt-6">
          <span className="label-text">얼마나 맡길까요?</span>
          <div className="grid grid-cols-2 gap-3">
            {DURATIONS.map((d) => {
              const on = minutes === d.minutes;
              return (
                <button
                  key={d.minutes}
                  type="button"
                  onClick={() => {
                    setMinutes(d.minutes);
                    setError("");
                  }}
                  className={`rounded-3xl border-2 px-4 py-4 text-center transition ${
                    on
                      ? "border-brand bg-brand text-white shadow-soft"
                      : "border-sand bg-white text-cocoa"
                  }`}
                >
                  <span className="block text-lg font-bold">
                    {formatDuration(d.minutes)}
                  </span>
                  <span
                    className={`mt-0.5 block text-base font-bold ${
                      on ? "text-white/90" : "text-honey-dark"
                    }`}
                  >
                    {formatCash(d.cash)} 캐시
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 하고 싶은 말 */}
        <div className="mt-6">
          <label className="label-text" htmlFor="note">
            하고 싶은 말 (안 적어도 됩니다)
          </label>
          <textarea
            id="note"
            rows={3}
            className="input-box"
            placeholder="예) 갑자기 병원에 가게 됐어요. 간식은 챙겨 보냅니다."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* 캐시 계산 결과 - 캐시 이야기라서 허니 색 */}
        <div
          className={`mt-7 rounded-3xl border-2 p-5 ${
            notEnoughCash
              ? "border-clay bg-clay-soft"
              : "border-honey-tint bg-honey-soft"
          }`}
        >
          <CashRow label="내가 낼 캐시" value={`- ${formatCash(price)}`} strong />
          <div className="mt-2">
            <CashRow label="지금 내 캐시" value={formatCash(data.cash)} />
          </div>
          <hr className="my-4 border-honey-tint" />
          <CashRow
            label="맡기고 남는 캐시"
            value={formatCash(data.cash - price)}
            strong
            color={notEnoughCash ? "text-clay-dark" : "text-honey-dark"}
          />
          {notEnoughCash && (
            <p className="mt-3 text-base font-semibold text-clay-dark">
              캐시가 부족해요. 상점에서 광고를 보면 캐시를 받을 수 있어요.
            </p>
          )}
        </div>

        {error && (
          <p className="mt-4 text-lg font-bold text-clay-dark" role="alert">
            {error}
          </p>
        )}

        <button
          className="btn-primary mt-5 flex items-center justify-center gap-2"
          onClick={() => void handleSubmit()}
          disabled={notEnoughCash}
        >
          <Icon name="send" filled className="text-2xl" />
          동네 부모님께 알림 보내기
        </button>

        <div className="mt-6">
          <SafetyNotice />
        </div>
      </main>
    </>
  );
}

function CashRow({
  label,
  value,
  strong = false,
  color = "text-honey-dark",
}: {
  label: string;
  value: string;
  strong?: boolean;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg text-mocha">{label}</span>
      <span
        className={`${color} ${
          strong ? "text-xl font-bold" : "text-lg font-semibold"
        }`}
      >
        {value} 캐시
      </span>
    </div>
  );
}
