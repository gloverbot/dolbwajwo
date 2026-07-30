"use client";

import Link from "next/link";

import { useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import { Avatar, EmptyBox, PageHeader, SectionTitle } from "@/components/Ui";
import { formatAgo, formatDuration } from "@/lib/format";
import { statusTheme } from "@/lib/policy";

/** 채팅방 목록 화면 */
export default function ChatListPage() {
  const { data } = useApp();

  // 아직 아무도 수락하지 않은 이웃 요청 (여기서 바로 수락할 수 있어요)
  const openRequests = data.requests.filter(
    (r) => !r.isMine && r.status === "waiting"
  );

  return (
    <>
      <PageHeader title="채팅" />

      <main className="px-5 py-6">
        <div className="mb-4 flex gap-2 rounded-2xl bg-muted-soft p-4">
          <Icon name="info" filled className="shrink-0 text-xl text-mocha" />
          <p className="text-base leading-relaxed text-mocha">
            채팅방은 <b className="text-cocoa">돌봄이 끝나면 자동으로 정리</b>
            됩니다. 필요한 이야기는 미리 나눠주세요.
          </p>
        </div>

        <section>
          <SectionTitle>내 채팅방 ({data.rooms.length})</SectionTitle>

          {data.rooms.length === 0 ? (
            <EmptyBox icon="forum">
              아직 채팅방이 없어요.
              <br />
              도움 요청을 <b>수락하거나</b>, 내 요청이 <b>수락되면</b> 채팅방이
              만들어져요.
            </EmptyBox>
          ) : (
            <ul className="space-y-3">
              {data.rooms.map((room) => {
                const last = room.messages[room.messages.length - 1];
                const unread = last?.from === "other";
                return (
                  <li key={room.id}>
                    <Link href={`/chat/${room.id}`} className="card flex gap-3">
                      <Avatar name={room.partnerName} size={48} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-lg font-bold text-cocoa">
                            {room.partnerName} 부모님
                          </p>
                          {unread && (
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
                          )}
                        </div>
                        <p className="truncate text-base text-mocha">
                          {room.title}
                        </p>
                        <p className="mt-1 truncate text-base text-cocoa">
                          {last?.from === "me" && "나: "}
                          {last?.text}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm text-muted">
                        {last ? formatAgo(last.at) : ""}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* 여기서 바로 수락하면 채팅방이 생깁니다 */}
        <section className="mt-8">
          <SectionTitle>수락하면 채팅이 시작돼요</SectionTitle>

          {openRequests.length === 0 ? (
            <EmptyBox icon="inbox">지금은 기다리는 요청이 없어요.</EmptyBox>
          ) : (
            <ul className="space-y-3">
              {openRequests.map((request) => {
                const theme = statusTheme(request.status);
                return (
                  <li key={request.id}>
                    <Link
                      href={`/request/${request.id}`}
                      className="card flex items-center gap-3"
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${theme.chip}`}
                      >
                        <Icon name={theme.icon} filled className="text-xl" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-bold text-cocoa">
                          {request.parentName} 부모님
                        </p>
                        <p className="truncate text-base text-mocha">
                          {request.childName} ({request.childAge}살) ·{" "}
                          {formatDuration(request.minutes)}
                        </p>
                      </div>
                      <Icon
                        name="chevron_right"
                        className="shrink-0 text-2xl text-mocha"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
