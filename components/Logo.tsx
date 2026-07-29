/**
 * 앱 로고와 첫 화면 그림입니다.
 * 그림 파일 없이 코드(SVG)로 그려서 어떤 화면에서도 또렷하게 보입니다.
 */

/** 집 지붕 + 하트 + 어른과 아이 모양의 로고 */
export function Logo({ size = 96 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      role="img"
      aria-label="돌봐줘 로고"
    >
      {/* 지붕 */}
      <path
        d="M13 45 L48 15 L83 45"
        fill="none"
        stroke="#D96E3C"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 지붕 아래 하트 */}
      <path
        d="M48 31c-2.6-3.4-8-2.6-8 1.8 0 3.6 4.6 6.4 8 8.8 3.4-2.4 8-5.2 8-8.8 0-4.4-5.4-5.2-8-1.8z"
        fill="#D96E3C"
      />
      {/* 어른 */}
      <circle cx="34" cy="58" r="8.5" fill="#F0A882" />
      <path d="M21 83c0-7.2 5.8-13 13-13s13 5.8 13 13z" fill="#F0A882" />
      {/* 아이 */}
      <circle cx="60" cy="63" r="6.5" fill="#9CBF9E" />
      <path d="M50 83c0-5.5 4.5-10 10-10s10 4.5 10 10z" fill="#9CBF9E" />
    </svg>
  );
}

/** 첫 화면에 들어가는 포근한 동네 그림 */
export function WelcomeScene() {
  return (
    <div className="overflow-hidden rounded-3xl">
      <svg
        viewBox="0 0 320 220"
        className="w-full"
        role="img"
        aria-label="손을 잡은 어른과 아이가 있는 동네 풍경"
      >
        {/* 하늘의 구름 */}
        <ellipse cx="48" cy="30" rx="24" ry="12" fill="#FFFFFF" />
        <ellipse cx="68" cy="33" rx="16" ry="9" fill="#FFFFFF" />
        <ellipse cx="266" cy="26" rx="21" ry="10" fill="#FFFFFF" />
        <ellipse cx="282" cy="29" rx="14" ry="7" fill="#FFFFFF" />

        {/* 뒤쪽 언덕 */}
        <path
          d="M0 168 Q80 140 160 166 T320 158 L320 220 L0 220 Z"
          fill="#DCE9D8"
        />
        {/* 앞쪽 잔디 */}
        <path
          d="M0 186 Q90 168 180 186 T320 182 L320 220 L0 220 Z"
          fill="#EFF5EC"
        />

        {/* 왼쪽 집 */}
        <rect x="26" y="128" width="44" height="42" rx="8" fill="#FADCCB" />
        <path
          d="M20 130 L48 108 L76 130"
          fill="none"
          stroke="#F0A882"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="41" y="146" width="14" height="24" rx="5" fill="#D96E3C" />

        {/* 오른쪽 집 */}
        <rect x="250" y="136" width="38" height="34" rx="8" fill="#F8E6BE" />
        <path
          d="M244 138 L269 120 L294 138"
          fill="none"
          stroke="#E6BE72"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="262" y="150" width="13" height="20" rx="5" fill="#C08A20" />

        {/* 나무 */}
        <rect x="96" y="146" width="7" height="26" rx="3.5" fill="#C79E7E" />
        <circle cx="99.5" cy="138" r="17" fill="#9CBF9E" />
        <rect x="222" y="152" width="6" height="22" rx="3" fill="#C79E7E" />
        <circle cx="225" cy="145" r="13" fill="#9CBF9E" />

        {/* 사이에 떠 있는 하트 */}
        <path
          d="M167 96c-2.6-3.4-8-2.6-8 1.8 0 3.6 4.6 6.4 8 8.8 3.4-2.4 8-5.2 8-8.8 0-4.4-5.4-5.2-8-1.8z"
          fill="#D96E3C"
        />

        {/* 손잡은 어른 (머리 아래에 몸통이 바로 붙도록 그립니다) */}
        <circle cx="143" cy="126" r="15" fill="#F0A882" />
        <path d="M121 188 v-25 a22 22 0 0 1 44 0 v25 z" fill="#F0A882" />

        {/* 손잡은 아이 */}
        <circle cx="192" cy="146" r="11" fill="#9CBF9E" />
        <path d="M176 188 v-16 a16 16 0 0 1 32 0 v16 z" fill="#9CBF9E" />

        {/* 맞잡은 손 */}
        <rect x="161" y="166" width="19" height="8" rx="4" fill="#E8A87C" />
      </svg>
    </div>
  );
}
