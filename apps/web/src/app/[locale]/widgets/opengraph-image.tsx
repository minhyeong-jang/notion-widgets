import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Widget Gallery — Notion Widgets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const widgets = [
  { name: "Flip Clock", nameKo: "플립 시계", emoji: "🕐" },
  { name: "Life Progress", nameKo: "라이프 프로그레스", emoji: "📊" },
  { name: "Analog Clock", nameKo: "아날로그 시계", emoji: "⏰" },
  { name: "D-Day Countdown", nameKo: "D-Day 카운트다운", emoji: "📅" },
  { name: "Pomodoro Timer", nameKo: "포모도로 타이머", emoji: "🍅" },
  { name: "Daily Quote", nameKo: "오늘의 명언", emoji: "💬" },
];

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Title */}
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: -1,
            marginBottom: 12,
          }}
        >
          {isKo ? "위젯 갤러리" : "Widget Gallery"}
        </span>
        <span style={{ fontSize: 20, color: "#a1a1aa", marginBottom: 48 }}>
          {isKo
            ? "Notion에 임베드할 수 있는 모든 위젯"
            : "All widgets you can embed in Notion"}
        </span>

        {/* Widget grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            maxWidth: 900,
          }}
        >
          {widgets.map((w) => (
            <div
              key={w.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 24px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontSize: 24 }}>{w.emoji}</span>
              <span style={{ color: "#e4e4e7", fontSize: 18, fontWeight: 500 }}>
                {isKo ? w.nameKo : w.name}
              </span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <span
          style={{
            position: "absolute",
            bottom: 32,
            color: "#52525b",
            fontSize: 16,
          }}
        >
          widgets.doriri.dev
        </span>
      </div>
    ),
    { ...size },
  );
}
