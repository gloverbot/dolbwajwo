import type { Config } from "tailwindcss";

/**
 * 색과 글꼴의 기준을 정하는 파일입니다.
 *
 * [색 원칙]
 * 1. 배경은 하얀색 대신 따뜻한 크림색을 씁니다. (눈이 편하고 포근한 느낌)
 * 2. 메인 색은 부드러운 코럴 오렌지입니다. 가장 중요한 버튼에만 진하게 씁니다.
 * 3. 카테고리마다 색을 고정합니다. 글자를 안 읽어도 색만으로 알아볼 수 있게.
 *      기다리는 중 = 코럴 / 수락 완료 = 더스티 블루 / 돌봄 끝 = 세이지 / 캐시 = 허니
 * 4. 파스텔은 연해서 글씨가 흐려지기 쉬우므로, 글씨에는 항상 진한 톤(-dark)을 씁니다.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // 카테고리 색깔 이름이 여기(policy.ts)에 적혀 있어서 꼭 포함해야 합니다.
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 둥글고 친근한 산세리프. Pretendard가 없으면 기기 기본 글꼴로 대체됩니다.
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        // ── 브랜드 코럴 : 메인 색 + '도움 기다리는 중' 카테고리 ────────────────
        brand: {
          soft: "#FDF0E9", // 아주 연한 배경
          tint: "#FADCCB", // 딱지·아이콘 배경
          mid: "#F0A882", // 테두리·일러스트
          DEFAULT: "#D96E3C", // 버튼 바탕 (흰 글씨 대비 3.4:1)
          dark: "#A4501F", // 글씨 (크림 바탕 대비 4.9:1)
        },

        // ── 더스티 블루 : '수락 완료(돌봄 예정)' 카테고리 ──────────────────────
        sky: {
          soft: "#EDF2F6",
          tint: "#DAE5EE",
          mid: "#93B0C6",
          DEFAULT: "#5B87A6",
          dark: "#3D6079",
        },

        // ── 세이지 그린 : '돌봄 끝' + 잘 됐다는 안내 ───────────────────────────
        leaf: {
          soft: "#EFF5EC",
          tint: "#DCE9D8",
          mid: "#9CBF9E",
          DEFAULT: "#5E8C6A",
          dark: "#3F6B4E",
        },

        // ── 허니(앰버) : '캐시' 전용 색 ────────────────────────────────────────
        honey: {
          soft: "#FDF4E0",
          tint: "#F8E6BE",
          mid: "#E6BE72",
          DEFAULT: "#C08A20",
          dark: "#8A5F12",
        },

        // ── 클레이 : 취소처럼 조심해야 하는 것. 원색 빨강 대신 톤 다운 ─────────
        clay: {
          soft: "#FBEDEA",
          DEFAULT: "#B85C4A",
          dark: "#94422F",
        },

        // ── 글씨·배경·선 (모두 따뜻한 갈색 계열) ───────────────────────────────
        cream: "#FDF8F1", // 배경 - 따뜻한 아이보리
        cocoa: "#4A3A2E", // 본문 글씨 (대비 9.6:1)
        mocha: "#7A6A5C", // 보조 글씨 (대비 4.6:1)
        sand: "#EFE4D6", // 테두리
        muted: {
          soft: "#F4EEE5", // '취소됨' 배경
          DEFAULT: "#8A7C6E",
        },
      },
      borderRadius: {
        // 둥근 글꼴·일러스트에 맞춰 모서리를 넉넉하게 굴립니다.
        xl: "1.125rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        // 그림자도 검정 대신 따뜻한 갈색으로 아주 옅게
        soft: "0 2px 12px rgba(120, 90, 60, 0.07)",
        lift: "0 6px 20px rgba(120, 90, 60, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
