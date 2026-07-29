"use client";

import Link from "next/link";

import { formatCash, formatTimeRange } from "@/lib/format";
import { durationCash, statusTheme } from "@/lib/policy";
import type { CareRequest } from "@/lib/types";

import { Icon } from "./Icon";
import { StatusChip } from "./Ui";

/** 돌봄 요청 1건을 보여주는 카드 */
export function RequestCard({
  request,
  linkToDetail = true,
}: {
  request: CareRequest;
  linkToDetail?: boolean;
}) {
  const cash = durationCash(request.minutes);
  const theme = statusTheme(request.status);

  const inner = (
    // 카드 왼쪽에 상태 색 띠를 둡니다. 목록을 훑을 때 색만 보고 구분되도록.
    <div className="card flex gap-4 p-0">
      <span className={`w-2.5 shrink-0 rounded-l-3xl ${theme.bar}`} aria-hidden />

      <div className="min-w-0 flex-1 py-5 pr-5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xl font-bold text-brand-dark">
            {request.childName.slice(0, 1) || "아"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold text-cocoa">
              {request.childName} ({request.childAge}살)
            </p>
            <p className="mt-0.5 truncate text-base text-mocha">
              {request.isMine
                ? "내가 올린 요청"
                : `${request.parentName} 부모님 · ${request.daycare}`}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <StatusChip status={request.status} />
        </div>

        <div className="mt-4 space-y-2 text-lg leading-relaxed">
          <p className="flex gap-2">
            <Icon
              name="schedule"
              className="mt-0.5 shrink-0 text-xl text-mocha"
            />
            <span>{formatTimeRange(request.startAt, request.minutes)}</span>
          </p>
          <p className="flex gap-2">
            <Icon
              name="location_on"
              className="mt-0.5 shrink-0 text-xl text-mocha"
            />
            <span>{request.place}</span>
          </p>
        </div>

        {/* 캐시는 앱 어디서나 허니 색으로 고정합니다. */}
        <div className="mt-4 rounded-2xl bg-honey-soft px-4 py-3">
          <p className="text-base text-mocha">
            {request.isMine ? "내가 내는 캐시" : "돌봐주면 받는 캐시"}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xl font-bold text-honey-dark">
            <Icon name="savings" filled className="text-xl" />
            {formatCash(cash)} 캐시
          </p>
        </div>
      </div>
    </div>
  );

  if (!linkToDetail) return inner;

  return (
    <Link href={`/request/${request.id}`} className="block">
      {inner}
    </Link>
  );
}
