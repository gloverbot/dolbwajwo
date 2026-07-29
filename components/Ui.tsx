"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { statusTheme } from "@/lib/policy";
import type { RequestStatus } from "@/lib/types";

import { Icon } from "./Icon";

/** '우리 동네 도움 요청' 같은 구역 제목 */
export function SectionTitle({
  children,
  right,
}: {
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-xl font-bold text-cocoa">{children}</h2>
      {right}
    </div>
  );
}

/**
 * 상태를 보여주는 알약 모양 딱지.
 * 색만으로도 알아볼 수 있게 하되, 색을 구분하기 어려운 분들을 위해
 * 아이콘과 글자도 함께 넣습니다.
 */
export function StatusChip({ status }: { status: RequestStatus }) {
  const theme = statusTheme(status);
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full py-1.5 pl-2.5 pr-3 text-sm font-bold ${theme.chip}`}
    >
      <Icon name={theme.icon} filled className="text-lg" />
      {theme.label}
    </span>
  );
}

/** 태그 하나 (성격·잘하는 것 등) */
export function Tag({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "leaf" | "honey" | "muted";
}) {
  const styles = {
    brand: "bg-brand-soft text-brand-dark",
    leaf: "bg-leaf-soft text-leaf-dark",
    honey: "bg-honey-soft text-honey-dark",
    muted: "bg-muted-soft text-mocha",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

/** 프로필 동그라미 (사진이 없으면 이름 첫 글자) */
export function Avatar({
  src,
  name,
  size = 48,
}: {
  src?: string | null;
  name: string;
  size?: number;
}) {
  const style = { width: size, height: size };
  if (src) {
    // 사용자가 고른 사진이라 next/image 대신 일반 img를 씁니다.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={`${name} 프로필 사진`}
        style={style}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      style={style}
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-bold text-brand-dark"
    >
      {name.slice(0, 1) || "나"}
    </span>
  );
}

/** 안전 안내 문구 (프로토타입 고지) */
export function SafetyNotice() {
  return (
    <div className="flex gap-3 rounded-3xl border border-sand bg-white p-4">
      <Icon name="verified_user" className="shrink-0 text-2xl text-leaf-mid" />
      <p className="text-base leading-relaxed text-mocha">
        이 서비스는 아이를 잠깐 맡기도록{" "}
        <b className="text-cocoa">도와주는 도구</b>입니다. 실제 돌봄은 서로
        얼굴을 아는 이웃과 함께하고, 응급 상황에서는 119에 먼저 연락하세요.
      </p>
    </div>
  );
}

/** 화면 맨 위 제목 줄 */
export function PageHeader({
  title,
  backHref,
  right,
}: {
  title: string;
  backHref?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-sand bg-cream/95 px-4 py-4 backdrop-blur">
      {backHref ? (
        <Link href={backHref} aria-label="뒤로 가기" className="w-10 text-mocha">
          <Icon name="arrow_back" className="text-2xl" />
        </Link>
      ) : (
        <span className="w-10" />
      )}
      <h1 className="flex-1 text-center text-xl font-bold text-cocoa">
        {title}
      </h1>
      <span className="flex w-10 justify-end">{right}</span>
    </header>
  );
}

/** 아무것도 없을 때 보여주는 안내 */
export function EmptyBox({
  icon,
  children,
}: {
  icon: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-sand bg-white px-5 py-10 text-center">
      <Icon name={icon} className="text-4xl text-sand" />
      <p className="mt-2 text-lg leading-relaxed text-mocha">{children}</p>
    </div>
  );
}
