"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import {
  Avatar,
  EmptyBox,
  PageHeader,
  SectionTitle,
  Tag,
} from "@/components/Ui";
import { PERSONALITY_TAGS, SKILL_TAGS, TIME_TAGS } from "@/lib/policy";
import { NEIGHBORS, WORD_GROUPS, type Neighbor } from "@/lib/seed";

type Step = "condition" | "loading" | "result";

/**
 * 두 낱말이 서로 맞는지 봅니다. (띄어쓰기는 무시)
 *
 * 한 글자짜리 말은 똑같을 때만 맞는 것으로 봅니다.
 * 그러지 않으면 "책"이 "책임감있어요"에 걸리는 것처럼 엉뚱하게 잡힙니다.
 */
function overlaps(a: string, b: string): boolean {
  const x = a.replace(/\s/g, "");
  const y = b.replace(/\s/g, "");
  if (!x || !y) return false;
  if (x.length < 2 || y.length < 2) return x === y;
  return x.includes(y) || y.includes(x);
}

/**
 * 적은 말과 '뜻이 가까운 말'까지 늘려줍니다.
 * 예) "공부" → ["공부", "숙제", "한글", "영어", "학습", ...]
 */
function expandKeyword(keyword: string): string[] {
  const words = new Set<string>([keyword]);
  WORD_GROUPS.forEach((group) => {
    if (group.some((word) => overlaps(keyword, word))) {
      group.forEach((word) => words.add(word));
    }
  });
  return [...words];
}

/**
 * 조건 하나가 이 이웃과 맞는지 봅니다.
 * 눌러서 고른 말뿐 아니라 직접 적은 말(예: "간호사")도
 * 이웃의 성격·잘하는 것·시간대·소개글에서 찾아봅니다.
 */
function matchedKeywords(neighbor: Neighbor, keywords: string[]): string[] {
  const haystack = [
    ...neighbor.personality,
    ...neighbor.skills,
    ...neighbor.times,
    neighbor.intro,
  ];

  return keywords.filter((keyword) =>
    expandKeyword(keyword).some((word) =>
      haystack.some((text) => overlaps(text, word))
    )
  );
}

/** AI 매칭: 조건을 적거나 고르면 어울리는 이웃을 찾아줍니다. */
export default function MatchPage() {
  const router = useRouter();
  const { askNeighbor } = useApp();

  const [step, setStep] = useState<Step>("condition");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [maxWalk, setMaxWalk] = useState(15);
  const [error, setError] = useState("");

  function addKeyword(value: string) {
    const clean = value.trim();
    setText("");
    if (!clean || keywords.includes(clean)) return;
    setKeywords([...keywords, clean]);
    setError("");
  }

  function removeKeyword(value: string) {
    setKeywords(keywords.filter((k) => k !== value));
  }

  /** 고른 조건과 얼마나 맞는지 점수를 매깁니다. */
  const scored = NEIGHBORS.filter((n) => n.walkMinutes <= maxWalk)
    .map((neighbor) => {
      const hits = matchedKeywords(neighbor, keywords);
      // 조건이 맞은 비율(70%)에 이웃 평가(20%)와 가까운 거리(10%)를 더합니다.
      const fit = keywords.length === 0 ? 0 : hits.length / keywords.length;
      const rating = neighbor.rating / 5;
      const near = Math.max(0, 1 - neighbor.walkMinutes / 15);
      const score = Math.round((fit * 0.7 + rating * 0.2 + near * 0.1) * 100);
      return { neighbor, hits, score };
    })
    .sort((a, b) => b.score - a.score);

  // 조건이 하나라도 맞은 이웃
  const results = scored.filter((r) => r.hits.length > 0);
  // 조건은 안 맞지만 가까이 사는 이웃 (결과가 텅 비지 않도록 함께 보여줍니다)
  const others = scored.filter((r) => r.hits.length === 0).slice(0, 4);

  function handleFind() {
    if (keywords.length === 0) {
      setError("조건을 하나 이상 적거나 골라주세요.");
      return;
    }
    setError("");
    setStep("loading");
  }

  async function handleAsk(name: string) {
    const roomId = await askNeighbor(name, keywords.slice(0, 3).join(", "));
    if (roomId) router.push(`/chat/${roomId}`);
  }

  return (
    <>
      <PageHeader title="AI 매칭" />

      <main className="px-5 py-6">
        {step === "loading" && <MatchLoading onDone={() => setStep("result")} />}

        {step === "condition" && (
          <>
            <div className="flex items-start gap-3 rounded-3xl bg-honey-soft p-5">
              <Icon
                name="auto_awesome"
                filled
                className="shrink-0 text-2xl text-honey"
              />
              <p className="text-base leading-relaxed text-honey-dark">
                어떤 이웃을 찾으시나요? 원하는 조건을{" "}
                <b>직접 적거나 아래에서 골라</b> 주세요. 우리 동네에서 가장 잘
                맞는 부모님을 순서대로 찾아드려요.
              </p>
            </div>

            {/* 직접 적어서 검색하기 */}
            <label className="label-text mt-7" htmlFor="keyword">
              어떤 분을 찾으세요?
            </label>
            <div className="flex gap-2">
              <input
                id="keyword"
                className="input-box flex-1"
                placeholder="예) 요리, 간호사, 차분해요"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword(text);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addKeyword(text)}
                disabled={!text.trim()}
                className="flex w-20 shrink-0 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white disabled:bg-sand disabled:text-muted"
              >
                추가
              </button>
            </div>
            <p className="mt-2 text-base text-mocha">
              적은 말은 이웃의 성격·잘하는 것·소개글에서 찾아봅니다.
            </p>

            {/* 지금 고른 조건 */}
            {keywords.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="flex items-center gap-1 rounded-full bg-brand py-1.5 pl-4 pr-2 text-lg font-bold text-white"
                  >
                    {keyword}
                    <button
                      type="button"
                      aria-label={`${keyword} 지우기`}
                      onClick={() => removeKeyword(keyword)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25"
                    >
                      <Icon name="close" className="text-lg" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 자주 찾는 조건 - 눌러서 빠르게 넣기 */}
            <SuggestRow
              title="성격"
              options={PERSONALITY_TAGS}
              chosen={keywords}
              onPick={addKeyword}
            />
            <SuggestRow
              title="잘하는 것"
              options={SKILL_TAGS}
              chosen={keywords}
              onPick={addKeyword}
            />
            <SuggestRow
              title="도움이 필요한 시간대"
              options={TIME_TAGS}
              chosen={keywords}
              onPick={addKeyword}
            />

            {/* 거리 */}
            <span className="label-text mt-7">
              걸어서 {maxWalk}분 안에 사는 이웃
            </span>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={maxWalk}
              onChange={(e) => setMaxWalk(Number(e.target.value))}
              className="h-3 w-full cursor-pointer appearance-none rounded-full bg-sand accent-brand"
            />
            <div className="mt-1 flex justify-between text-base text-mocha">
              <span>3분</span>
              <span>15분</span>
            </div>

            {error && (
              <p className="mt-4 text-lg font-bold text-clay-dark" role="alert">
                {error}
              </p>
            )}

            <button
              className="btn-primary mt-7 flex items-center justify-center gap-2"
              onClick={handleFind}
            >
              <Icon name="search" filled className="text-2xl" />
              어울리는 이웃 찾기
            </button>
          </>
        )}

        {step === "result" && (
          <>
            <div className="flex items-start gap-3 rounded-3xl bg-honey-soft p-5">
              <Icon
                name="auto_awesome"
                filled
                className="shrink-0 text-2xl text-honey"
              />
              <div className="min-w-0 flex-1">
                <p className="text-base leading-relaxed text-honey-dark">
                  걸어서 {maxWalk}분 안에 사는 이웃 <b>{scored.length}명</b> 중{" "}
                  <b>{results.length}명</b>이 조건과 맞아요.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {keywords.map((k) => (
                    <Tag key={k} tone="honey">
                      {k}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="btn-outline mt-4"
              onClick={() => setStep("condition")}
            >
              조건 다시 정하기
            </button>

            <div className="mt-7">
              <SectionTitle>잘 맞는 이웃 ({results.length})</SectionTitle>
              {results.length === 0 ? (
                <EmptyBox icon="person_search">
                  딱 맞는 이웃은 못 찾았어요.
                  <br />
                  아래에서 가까운 이웃을 먼저 살펴보세요.
                </EmptyBox>
              ) : (
                <ul className="space-y-3">
                  {results.map(({ neighbor, hits, score }) => (
                    <li key={neighbor.id} className="card">
                      <div className="flex items-start gap-3">
                        <Avatar name={neighbor.name} size={52} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xl font-bold text-cocoa">
                            {neighbor.name} 부모님
                          </p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-base text-mocha">
                            <span className="flex items-center gap-1">
                              <Icon
                                name="star"
                                filled
                                className="text-base text-honey"
                              />
                              {neighbor.rating}
                            </span>
                            <span>· 도와준 횟수 {neighbor.helpCount}회</span>
                            <span>· 걸어서 {neighbor.walkMinutes}분</span>
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-2xl font-bold text-honey-dark">
                            {score}
                            <span className="text-base">점</span>
                          </p>
                          <p className="text-sm text-muted">일치도</p>
                        </div>
                      </div>

                      <p className="mt-3 text-base leading-relaxed text-mocha">
                        {neighbor.intro}
                      </p>

                      {/* 어떤 조건이 맞았는지 알려줍니다 */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-base text-mocha">맞는 조건</span>
                        {hits.map((h) => (
                          <Tag key={h} tone="leaf">
                            {h}
                          </Tag>
                        ))}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {[...neighbor.personality, ...neighbor.skills].map(
                          (t) => (
                            <Tag key={t} tone="muted">
                              {t}
                            </Tag>
                          )
                        )}
                      </div>

                      <button
                        className="btn-sky mt-4 flex items-center justify-center gap-2 py-3 text-lg"
                        onClick={() => void handleAsk(neighbor.name)}
                      >
                        <Icon name="chat_bubble" filled className="text-xl" />이
                        부모님과 이야기하기
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 조건은 안 맞아도 가까이 사는 이웃을 함께 보여줍니다 */}
            {others.length > 0 && (
              <div className="mt-8">
                <SectionTitle>그 밖의 우리 동네 이웃</SectionTitle>
                <p className="-mt-1 mb-3 text-base leading-relaxed text-mocha">
                  조건과 딱 맞지는 않지만, 가까이 사는 이웃이에요.
                </p>
                <ul className="space-y-3">
                  {others.map(({ neighbor }) => (
                    <li key={neighbor.id} className="card flex items-center gap-3">
                      <Avatar name={neighbor.name} size={48} />
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-bold text-cocoa">
                          {neighbor.name} 부모님
                        </p>
                        <p className="truncate text-base text-mocha">
                          {neighbor.skills.join(" · ")} · 걸어서{" "}
                          {neighbor.walkMinutes}분
                        </p>
                      </div>
                      <button
                        className="shrink-0 rounded-full border-2 border-brand-mid px-4 py-2 text-base font-bold text-brand-dark"
                        onClick={() => void handleAsk(neighbor.name)}
                      >
                        대화
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

/** 눌러서 조건을 빠르게 넣는 줄 */
function SuggestRow({
  title,
  options,
  chosen,
  onPick,
}: {
  title: string;
  options: string[];
  chosen: string[];
  onPick: (value: string) => void;
}) {
  const rest = options.filter((o) => !chosen.includes(o));
  if (rest.length === 0) return null;

  return (
    <div className="mt-5">
      <p className="mb-2 text-base font-bold text-mocha">{title}</p>
      <div className="flex flex-wrap gap-2">
        {rest.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            className="flex items-center gap-1 rounded-full border-2 border-sand bg-white py-1.5 pl-3 pr-3.5 text-base font-bold text-mocha"
          >
            <Icon name="add" className="text-lg" />
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 매칭을 시작하면 잠깐 보여주는 로딩 화면 */
const LOADING_STEPS = [
  "우리 동네 부모님을 찾고 있어요",
  "적어주신 조건과 얼마나 맞는지 살펴보고 있어요",
  "가까운 순서로 정리하고 있어요",
];

function MatchLoading({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 한 문구당 0.8초씩 보여주고, 마지막 문구가 끝나면 결과로 넘어갑니다.
    if (index >= LOADING_STEPS.length) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setIndex((v) => v + 1), 800);
    return () => clearTimeout(timer);
  }, [index, onDone]);

  const shown = Math.min(index, LOADING_STEPS.length - 1);
  const percent = Math.round(((shown + 1) / LOADING_STEPS.length) * 100);

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      role="status"
      aria-live="polite"
    >
      {/* 반짝이는 동그라미 */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute h-28 w-28 animate-ping rounded-full bg-brand-tint opacity-70" />
        <span className="absolute h-24 w-24 rounded-full bg-brand-soft" />
        <Icon
          name="auto_awesome"
          filled
          className="relative animate-pulse text-5xl text-brand"
        />
      </div>

      <p className="mt-7 text-xl font-bold text-cocoa">{LOADING_STEPS[shown]}</p>

      {/* 통통 튀는 점 세 개 */}
      <div className="mt-3 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-mid"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* 얼마나 진행됐는지 */}
      <div className="mt-8 h-2.5 w-56 overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-brand transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-base text-mocha">잠시만 기다려 주세요</p>
    </div>
  );
}
