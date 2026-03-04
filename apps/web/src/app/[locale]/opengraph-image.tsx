import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Notion Widgets — Beautiful widgets for Notion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(127,182,134,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -60,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(127,182,134,0.1) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: 999,
            border: "1px solid rgba(127,182,134,0.3)",
            background: "rgba(127,182,134,0.1)",
            marginBottom: 24,
          }}
        >
          <span style={{ color: "#7fb686", fontSize: 18 }}>
            {isKo ? "감도 높은 Notion" : "Make Notion Beautiful"}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: -2,
            }}
          >
            Notion Widgets
          </span>
          <span
            style={{
              fontSize: 24,
              color: "#a1a1aa",
              marginTop: 8,
            }}
          >
            {isKo
              ? "가입 없이, URL 하나로 완성하는 위젯"
              : "No sign-up needed. One URL is all you need."}
          </span>
        </div>

        {/* Widget pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
          }}
        >
          {["Clock", "Progress", "D-Day", "Quote", "Pomodoro"].map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span style={{ color: "#d4d4d8", fontSize: 16 }}>{name}</span>
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
