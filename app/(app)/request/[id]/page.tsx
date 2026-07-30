"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import { RequestCard } from "@/components/RequestCard";
import { PageHeader, SafetyNotice, SectionTitle } from "@/components/Ui";
import { formatCash } from "@/lib/format";
import { durationCash, statusTheme } from "@/lib/policy";
import type { CareRequest } from "@/lib/types";

/** 요청 1건을 자세히 보는 화면 */
export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, me, acceptRequest, completeRequest, cancelMyRequest } = useApp();
  const [toast, setToast] = useState("");
  const [askCancel, setAskCancel] = useState(false);

  const request = data.requests.find((r) => r.id === params.id);
  const room = data.rooms.find((r) => r.requestId === params.id);

  if (!me) return null;

  if (!request) {
    return (
      <>
        <PageHeader title="돌봄 요청" backHref="/" />
        <main className="px-5 py-10">
          <p className="text-lg text-mocha">요청을 찾을 수 없어요.</p>
          <Link href="/" className="btn-outline mt-5">
            홈으로 가기
          </Link>
        </main>
      </>
    );
  }

  const cash = durationCash(request.minutes);
  const theme = statusTheme(request.status);

  return (
    <>
      <PageHeader title="돌봄 요청" backHref="/" />

      <main className="px-5 py-6">
        {/* 상태 안내 상자 - 카테고리 색 그대로 */}
        <section className={`rounded-3xl p-5 ${theme.chip}`}>
          <p className="flex items-center gap-2 text-xl font-bold">
            <Icon name={theme.icon} filled className="text-2xl" />
            {theme.label}
          </p>
          <p className="mt-1 text-base leading-relaxed">
            {statusMessage(request, me.name)}
          </p>
        </section>

        <div className="mt-4">
          <RequestCard request={request} linkToDetail={false} />
        </div>

        {request.childNote && (
          <section className="mt-6">
            <SectionTitle>아이에 대해 알아둘 것</SectionTitle>
            <div className="card flex gap-3">
              <Icon
                name="child_care"
                filled
                className="shrink-0 text-2xl text-brand"
              />
              <p className="text-lg leading-relaxed">{request.childNote}</p>
            </div>
          </section>
        )}

        {request.note && (
          <section className="mt-6">
            <SectionTitle>부모님이 남긴 말</SectionTitle>
            <div className="card text-lg leading-relaxed">{request.note}</div>
          </section>
        )}

        {request.helperName && (
          <section className="mt-6">
            <SectionTitle>돌봐주는 분</SectionTitle>
            <div className="card flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf-tint">
                <Icon
                  name="volunteer_activism"
                  filled
                  className="text-2xl text-leaf"
                />
              </span>
              <p className="min-w-0 flex-1 truncate text-xl font-bold text-cocoa">
                {request.helperName} 부모님
              </p>
              {room && (
                <Link
                  href={`/chat/${room.id}`}
                  className="flex shrink-0 items-center gap-1 rounded-2xl border-2 border-brand-mid px-4 py-2 text-base font-bold text-brand-dark"
                >
                  <Icon name="chat_bubble" filled className="text-lg" />
                  채팅
                </Link>
              )}
            </div>
          </section>
        )}

        {/* 상황에 맞는 버튼들.
            버튼 색 = 누른 뒤 바뀌는 상태의 색이라, 색만 봐도 결과를 알 수 있습니다. */}
        <div className="mt-7 space-y-3">
          {/* 이웃의 요청 + 아직 수락 전 → 돌봐주기 (파랑 = 수락 완료) */}
          {!request.isMine && request.status === "waiting" && (
            <button
              className="btn-sky flex items-center justify-center gap-2"
              onClick={() => {
                void acceptRequest(request.id).then((roomId) => {
                  if (roomId) router.push(`/chat/${roomId}`);
                  else setToast("다른 부모님이 먼저 수락했어요.");
                });
              }}
            >
              <Icon name="handshake" filled className="text-2xl" />
              돌봐줄게요 · {formatCash(cash)} 캐시
            </button>
          )}

          {/* 내가 수락한 요청 → 돌봄 끝내기 (초록 = 돌봄 끝) */}
          {!request.isMine &&
            request.status === "accepted" &&
            request.helperName === me.name && (
              <button
                className="btn-leaf flex items-center justify-center gap-2"
                onClick={() => {
                  void completeRequest(request.id);
                  setToast(`${formatCash(cash)} 캐시가 적립됐어요. 고맙습니다!`);
                }}
              >
                <Icon name="check_circle" filled className="text-2xl" />
                돌봄 끝내고 캐시 받기
              </button>
            )}

          {/* 내 요청 → 끝내기 (초록) */}
          {request.isMine && request.status === "accepted" && (
            <button
              className="btn-leaf flex items-center justify-center gap-2"
              onClick={() => {
                void completeRequest(request.id);
                setToast("돌봄이 끝났어요. 고맙습니다!");
              }}
            >
              <Icon name="check_circle" filled className="text-2xl" />
              아이를 데려왔어요 (돌봄 끝)
            </button>
          )}

          {request.isMine &&
            (request.status === "waiting" || request.status === "accepted") &&
            (askCancel ? (
              <div className="rounded-3xl border-2 border-clay bg-clay-soft p-5">
                <p className="text-lg font-bold text-cocoa">요청을 취소할까요?</p>
                <p className="mt-1 text-base text-mocha">
                  낸 캐시 {formatCash(cash)}는 다시 돌려드려요.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    className="btn-outline"
                    onClick={() => setAskCancel(false)}
                  >
                    아니요
                  </button>
                  <button
                    className="btn-quiet"
                    onClick={() => {
                      void cancelMyRequest(request.id);
                      setAskCancel(false);
                      setToast("요청을 취소했어요. 캐시를 돌려드렸습니다.");
                    }}
                  >
                    취소할게요
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-quiet" onClick={() => setAskCancel(true)}>
                요청 취소하기 (캐시 돌려받음)
              </button>
            ))}

          {(request.status === "done" || request.status === "canceled") && (
            <Link href="/" className="btn-outline">
              홈으로 가기
            </Link>
          )}
        </div>

        {toast && (
          <p className="mt-5 flex items-start gap-2 rounded-3xl bg-leaf-tint p-4 text-lg font-semibold text-leaf-dark">
            <Icon name="info" filled className="mt-0.5 shrink-0 text-xl" />
            {toast}
          </p>
        )}

        <div className="mt-6">
          <SafetyNotice />
        </div>
      </main>
    </>
  );
}

/** 상황에 맞는 설명 문구를 만들어 줍니다. */
function statusMessage(request: CareRequest, myName: string): string {
  switch (request.status) {
    case "waiting":
      return request.isMine
        ? `${request.daycare} 부모님들에게 알림을 보냈어요. 수락하면 바로 알려드릴게요.`
        : "아직 아무도 수락하지 않았어요. 수락하면 채팅방이 만들어져요.";
    case "accepted":
      if (request.isMine) {
        return `${request.helperName} 부모님이 돌봐주기로 했어요. 채팅으로 약속을 정하세요.`;
      }
      return request.helperName === myName
        ? "내가 돌봐주기로 한 아이예요. 돌봄이 끝나면 아래 버튼을 눌러주세요."
        : "다른 부모님이 이미 수락했어요.";
    case "done":
      return "돌봄이 잘 끝났어요. 고맙습니다!";
    case "canceled":
      return "요청이 취소되었어요. 낸 캐시는 돌려드렸습니다.";
  }
}
