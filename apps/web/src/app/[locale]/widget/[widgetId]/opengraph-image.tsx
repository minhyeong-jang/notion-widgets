import { ImageResponse } from "next/og";
import { getAllWidgets } from "@nw/widget-core";
import "@nw/widgets";

export const runtime = "nodejs";
export const alt = "Widget — Notion Widgets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const widgetEmojis: Record<string, string> = {
  "flip-clock": "🕐",
  "life-progress": "📊",
  "analog-clock": "⏰",
  "countdown": "📅",
  "pomodoro": "🍅",
  "quote": "💬",
};

const widgetColors: Record<string, string> = {
  "flip-clock": "127,182,134",
  "life-progress": "127,182,134",
  "analog-clock": "147,163,207",
  "countdown": "207,147,147",
  "pomodoro": "207,175,147",
  "quote": "175,147,207",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; widgetId: string }>;
}) {
  const { locale, widgetId } = await params;
  const isKo = locale === "ko";
  const widget = getAllWidgets().find((w) => w.meta.id === widgetId);

  const name = widget
    ? isKo
      ? (widget.nameKo ?? widget.meta.name)
      : widget.meta.name
    : widgetId;
  const description = widget
    ? isKo
      ? (widget.descriptionKo ?? widget.meta.description)
      : widget.meta.description
    : "";
  const emoji = widgetEmojis[widgetId] ?? "🧩";
  const rgb = widgetColors[widgetId] ?? "127,182,134";

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
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${rgb},0.12) 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Emoji */}
        <span style={{ fontSize: 80, marginBottom: 24 }}>{emoji}</span>

        {/* Widget name */}
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: -1,
          }}
        >
          {name}
        </span>

        {/* Description */}
        <span
          style={{
            fontSize: 22,
            color: "#a1a1aa",
            marginTop: 12,
            maxWidth: 700,
            textAlign: "center",
          }}
        >
          {description}
        </span>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 40,
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span style={{ color: "#71717a", fontSize: 16 }}>Notion Widgets</span>
          <span style={{ color: "#3f3f46", fontSize: 16 }}>|</span>
          <span style={{ color: "#7fb686", fontSize: 16 }}>
            {isKo ? "지금 커스터마이즈" : "Customize Now"}
          </span>
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
