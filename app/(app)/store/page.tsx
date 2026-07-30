"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/components/AppProvider";
import { Icon } from "@/components/Icon";
import { EmptyBox, PageHeader, SectionTitle } from "@/components/Ui";
import { formatCash, formatDateTime } from "@/lib/format";
import { AD_REWARD, AD_SECONDS, TONE } from "@/lib/policy";
import { GIFTICONS, type Gifticon } from "@/lib/seed";

/** 상점: 캐시로 기프티콘 바꾸기 + 광고 보고 캐시 받기 */
export default function StorePage() {
  const { data, buyGifticon } = useApp();
  const [adOpen, setAdOpen] = useState(false);
  const [buying, setBuying] = useState<Gifticon | null>(null);
  const [toast, setToast] = useState("");

  async function handleBuy(item: Gifticon) {
    const ok = await buyGifticon(item);
    setBuying(null);
    setToast(
      ok
        ? `${item.name} 교환이 끝났어요! 아래에서 번호를 확인하세요.`
        : "캐시가 모자라요. 광고를 보거나 이웃 아이를 돌봐주세요."
    );
  }

  return (
    <>
      <PageHeader title="상점" />

      <main className="px-5 py-6">
        {/* 위쪽 캐시 - 누르면 광고를 보고 캐시를 받습니다 */}
        <button
          onClick={() => setAdOpen(true)}
          className="w-full rounded-3xl border border-honey-tint bg-honey-soft p-5 text-left"
        >
          <span className="flex items-center gap-3">
            <Icon name="savings" filled className="shrink-0 text-3xl text-honey" />
            <span className="min-w-0 flex-1">
              <span className="block text-base text-mocha">내 캐시</span>
              <span className="block text-3xl font-bold text-honey-dark">
                {formatCash(data.cash)} 캐시
              </span>
            </span>
          </span>
          <span className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-3 text-lg font-bold text-white">
            <Icon name="play_circle" filled className="text-2xl" />
            광고 보고 +{formatCash(AD_REWARD)} 캐시
          </span>
        </button>
        <p className="mt-2 text-center text-base text-mocha">
          위 상자를 누르면 짧은 광고를 보고 캐시를 받을 수 있어요.
        </p>

        {toast && (
          <p className="mt-4 flex items-start gap-2 rounded-3xl bg-leaf-tint p-4 text-base font-semibold text-leaf-dark">
            <Icon name="info" filled className="mt-0.5 shrink-0 text-xl" />
            {toast}
          </p>
        )}

        {/* 기프티콘 목록 */}
        <section className="mt-8">
          <SectionTitle>기프티콘으로 바꾸기</SectionTitle>
          <ul className="grid grid-cols-2 gap-3">
            {GIFTICONS.map((item) => {
              const tone = TONE[item.tone];
              const enough = data.cash >= item.price;
              return (
                <li key={item.id} className="card p-4">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-3xl ${tone.soft}`}
                  >
                    <Icon
                      name={item.icon}
                      filled
                      className={`text-3xl ${tone.text}`}
                    />
                  </span>
                  <p className="mt-3 text-sm text-mocha">{item.brand}</p>
                  <p className="text-lg font-bold leading-snug text-cocoa">
                    {item.name}
                  </p>
                  <p className="mt-2 text-lg font-bold text-honey-dark">
                    {formatCash(item.price)} 캐시
                  </p>
                  <button
                    onClick={() => setBuying(item)}
                    disabled={!enough}
                    className={`mt-3 w-full rounded-2xl py-3 text-base font-bold transition ${
                      enough
                        ? "bg-brand text-white"
                        : "bg-muted-soft text-muted"
                    }`}
                  >
                    {enough ? "교환하기" : "캐시 부족"}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 내가 산 기프티콘 */}
        <section className="mt-8">
          <SectionTitle>내 기프티콘 ({data.coupons.length})</SectionTitle>
          {data.coupons.length === 0 ? (
            <EmptyBox icon="confirmation_number">
              아직 바꾼 기프티콘이 없어요.
            </EmptyBox>
          ) : (
            <ul className="space-y-3">
              {data.coupons.map((coupon) => (
                <li key={coupon.id} className="card flex items-center gap-3">
                  <Icon
                    name="confirmation_number"
                    filled
                    className="shrink-0 text-3xl text-brand"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-mocha">{coupon.brand}</p>
                    <p className="text-lg font-bold text-cocoa">{coupon.name}</p>
                    <p className="mt-1 font-mono text-lg tracking-wider text-brand-dark">
                      {coupon.code}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {formatDateTime(coupon.boughtAt)} 교환
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* 교환 확인 */}
      {buying && (
        <Sheet onClose={() => setBuying(null)}>
          <p className="text-xl font-bold text-cocoa">이 기프티콘으로 바꿀까요?</p>
          <p className="mt-2 text-lg text-mocha">
            {buying.brand} · {buying.name}
          </p>
          <p className="mt-4 text-lg">
            내 캐시 {formatCash(data.cash)} →{" "}
            <b className="text-honey-dark">
              {formatCash(data.cash - buying.price)}
            </b>
          </p>
          <div className="mt-6 flex gap-3">
            <button className="btn-outline" onClick={() => setBuying(null)}>
              아니요
            </button>
            <button className="btn-sky py-4 text-lg" onClick={() => void handleBuy(buying)}>
              바꿀게요
            </button>
          </div>
        </Sheet>
      )}

      {/* 광고 보기 */}
      {adOpen && <AdSheet onClose={() => setAdOpen(false)} />}
    </>
  );
}

/** 아래에서 올라오는 작은 창 */
function Sheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-cocoa/40">
      <button
        className="absolute inset-0 cursor-default"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-6 pb-10">
        {children}
      </div>
    </div>
  );
}

/** 광고 시청 창 (프로토타입이라 진짜 광고 대신 5초 기다립니다) */
function AdSheet({ onClose }: { onClose: () => void }) {
  const { watchAd } = useApp();
  const [left, setLeft] = useState(AD_SECONDS);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (left <= 0) {
      setDone(true);
      return;
    }
    const timer = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  // 광고를 끝까지 보면 캐시를 지급합니다.
  useEffect(() => {
    if (done) void watchAd();
  }, [done, watchAd]);

  return (
    <Sheet onClose={done ? onClose : () => undefined}>
      {done ? (
        <div className="text-center">
          <Icon name="check_circle" filled className="text-5xl text-leaf" />
          <p className="mt-3 text-2xl font-bold text-cocoa">
            {formatCash(AD_REWARD)} 캐시를 받았어요!
          </p>
          <p className="mt-1 text-lg text-mocha">광고를 끝까지 봐주셔서 고마워요.</p>
          <button className="btn-leaf mt-6" onClick={onClose}>
            확인
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex h-44 items-center justify-center rounded-3xl bg-muted-soft">
            <div>
              <Icon name="smart_display" filled className="text-5xl text-mocha" />
              <p className="mt-2 text-lg font-bold text-mocha">광고 재생 중...</p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-bold text-brand-dark">{left}초</p>
          <p className="mt-1 text-lg text-mocha">
            끝까지 보면 {formatCash(AD_REWARD)} 캐시를 드려요
          </p>
        </div>
      )}
    </Sheet>
  );
}
