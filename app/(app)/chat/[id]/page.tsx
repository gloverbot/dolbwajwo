"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import { Avatar, PageHeader } from "@/components/Ui";
import { formatClock } from "@/lib/format";

/** 채팅방 1개 화면 */
export default function ChatRoomPage() {
  const params = useParams<{ id: string }>();
  const { data, sendMessage } = useApp();
  const [text, setText] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  const room = data.rooms.find((r) => r.id === params.id);
  const messageCount = room?.messages.length ?? 0;

  // 새 메시지가 오면 맨 아래로 내려갑니다.
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  if (!room) {
    return (
      <>
        <PageHeader title="채팅" backHref="/chat" />
        <main className="px-5 py-10">
          <p className="text-lg text-mocha">채팅방을 찾을 수 없어요.</p>
          <Link href="/chat" className="btn-outline mt-5">
            채팅 목록으로
          </Link>
        </main>
      </>
    );
  }

  function handleSend() {
    if (!text.trim() || !room) return;
    sendMessage(room.id, text);
    setText("");
  }

  return (
    <>
      <PageHeader title={room.partnerName} backHref="/chat" />

      {/* 어떤 돌봄에 대한 채팅인지 */}
      <div className="flex items-center gap-2 border-b border-sand bg-brand-soft px-5 py-3">
        <Icon name="child_care" filled className="text-xl text-brand" />
        <span className="min-w-0 flex-1 truncate text-base font-bold text-brand-dark">
          {room.title}
        </span>
        {room.requestId && (
          <Link
            href={`/request/${room.requestId}`}
            className="shrink-0 text-base font-bold text-brand-dark underline"
          >
            요청 보기
          </Link>
        )}
      </div>

      {/* 주고받은 말 */}
      <main className="px-5 py-5">
        <ul className="space-y-3">
          {room.messages.map((message) => {
            if (message.from === "system") {
              return (
                <li key={message.id} className="text-center">
                  <span className="inline-block rounded-full bg-muted-soft px-4 py-2 text-sm leading-relaxed text-mocha">
                    {message.text}
                  </span>
                </li>
              );
            }

            const mine = message.from === "me";
            return (
              <li
                key={message.id}
                className={`flex items-end gap-2 ${
                  mine ? "flex-row-reverse" : ""
                }`}
              >
                {!mine && <Avatar name={room.partnerName} size={36} />}
                <div
                  className={`max-w-[70%] rounded-3xl px-4 py-3 text-lg leading-relaxed ${
                    mine
                      ? "rounded-br-md bg-brand text-white"
                      : "rounded-bl-md bg-white text-cocoa ring-1 ring-sand"
                  }`}
                >
                  {message.text}
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {formatClock(message.at)}
                </span>
              </li>
            );
          })}
        </ul>
        <div ref={bottom} />
      </main>

      {/* 글 쓰는 칸 (아래 탭 위에 붙어 있습니다) */}
      <div className="fixed inset-x-0 bottom-[74px] z-10 border-t border-sand bg-white">
        <div className="mx-auto flex w-full max-w-md items-center gap-2 px-4 py-3">
          <input
            className="input-box flex-1 py-3"
            placeholder="메시지를 적어보세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            aria-label="보내기"
            disabled={!text.trim()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-brand text-white disabled:bg-sand disabled:text-muted"
          >
            <Icon name="send" filled className="text-2xl" />
          </button>
        </div>
      </div>

      {/* 글 쓰는 칸에 가려지지 않도록 아래쪽 여백 */}
      <div className="h-24" />
    </>
  );
}
