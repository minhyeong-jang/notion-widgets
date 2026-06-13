"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

interface HeroProps {
  dict: Dictionary;
  locale: Locale;
}

export function Hero({ dict, locale }: HeroProps) {
  return (
    <section style={{ padding: "76px 0 64px" }}>
      <div
        className="mx-auto px-8"
        style={{ maxWidth: "var(--maxw)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.92fr] gap-14 items-center">
          {/* Left column */}
          <div>
            <h1
              style={{
                fontSize: 50,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.08,
              }}
              className="text-text"
            >
              <span className="text-text-faint font-bold">
                가입 없이,
              </span>
              <br />
              URL 하나로 완성하는
              <br />
              Notion{" "}
              <span className="text-accent-bright">위젯</span>
            </h1>

            <p
              className="text-text-dim"
              style={{
                marginTop: 26,
                fontSize: 18.5,
                lineHeight: 1.6,
                maxWidth: 520,
              }}
            >
              30초면 충분합니다. 위젯을 골라 커스터마이즈하고, URL을 복사해
              Notion에 붙여넣으세요.
            </p>

            <div
              className="flex items-center"
              style={{ marginTop: 38, gap: 14 }}
            >
              <a
                href={`/${locale}/widgets`}
                className="bg-accent text-btn-text inline-block font-semibold transition-all duration-200 hover:bg-accent-bright"
                style={{
                  padding: "13px 22px",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 11,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                위젯 둘러보기{" "}
                <span className="font-mono">→</span>
              </a>
              <a
                href="#how"
                className="text-text-dim border border-border-strong inline-block transition-all duration-200 hover:text-text hover:border-text-faint"
                style={{
                  padding: "13px 22px",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 11,
                  background: "transparent",
                }}
              >
                사용법 보기
              </a>
            </div>
          </div>

          {/* Right column — Notion mockup */}
          <NotionMockup />
        </div>
      </div>
    </section>
  );
}

function NotionMockup() {
  return (
    <div
      className="bg-surface border border-border shadow-lg"
      style={{ borderRadius: 16, padding: "22px 22px 26px" }}
    >
      {/* Window dots */}
      <div className="flex gap-1.5" style={{ marginBottom: 18 }}>
        <span
          className="block rounded-full"
          style={{
            width: 9,
            height: 9,
            backgroundColor: "var(--border-strong)",
          }}
        />
        <span
          className="block rounded-full"
          style={{
            width: 9,
            height: 9,
            backgroundColor: "var(--border-strong)",
          }}
        />
        <span
          className="block rounded-full"
          style={{
            width: 9,
            height: 9,
            backgroundColor: "var(--border-strong)",
          }}
        />
      </div>

      {/* Doc header */}
      <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 30, lineHeight: 1 }}>🗓️</span>
        <span
          className="text-text"
          style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          나의 대시보드
        </span>
      </div>

      {/* Meta */}
      <p
        className="text-text-faint"
        style={{ fontSize: 12.5, marginBottom: 20, paddingLeft: 2 }}
      >
        /embed 로 붙여넣은 위젯이 이렇게 보입니다
      </p>

      {/* Embed block 1: World Clock */}
      <div
        className="border border-border-soft overflow-hidden"
        style={{ borderRadius: 10 }}
      >
        <div
          className="flex items-center gap-[7px] whitespace-nowrap text-text-faint"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            padding: "7px 12px",
            borderBottom: "1px solid var(--border-soft)",
            backgroundColor: "var(--inset)",
          }}
        >
          EMBED ·{" "}
          <span className="text-accent">world-clock</span>
        </div>
        <div
          className="flex items-center justify-around"
          style={{
            backgroundColor: "var(--inset)",
            padding: "18px 16px",
          }}
        >
          <TimeZone time="07:24" city="NEW YORK" />
          <TimeZone time="12:24" city="LONDON" />
          <TimeZone time="21:24" city="SEOUL" />
        </div>
      </div>

      {/* Embed block 2: Life Progress */}
      <div
        className="border border-border-soft overflow-hidden"
        style={{ borderRadius: 10, marginTop: 12 }}
      >
        <div
          className="flex items-center gap-[7px] whitespace-nowrap text-text-faint"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            padding: "7px 12px",
            borderBottom: "1px solid var(--border-soft)",
            backgroundColor: "var(--inset)",
          }}
        >
          EMBED ·{" "}
          <span className="text-accent">life-progress</span>
        </div>
        <div
          style={{
            backgroundColor: "var(--inset)",
            padding: "16px 18px",
          }}
        >
          <ProgressRow label="2026" percent={44} />
          <ProgressRow label="6월" percent={33} />
        </div>
      </div>
    </div>
  );
}

function TimeZone({ time, city }: { time: string; city: string }) {
  return (
    <div className="text-center">
      <div
        className="text-accent font-bold font-mono"
        style={{ fontSize: 17 }}
      >
        {time}
      </div>
      <div
        className="text-text-faint font-mono"
        style={{ fontSize: 10, marginTop: 4, letterSpacing: "0.05em" }}
      >
        {city}
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        className="flex justify-between text-text-dim"
        style={{ fontSize: 12, marginBottom: 5 }}
      >
        <span>{label}</span>
        <span className="font-mono">{percent}%</span>
      </div>
      <div
        className="overflow-hidden"
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "var(--border-soft)",
        }}
      >
        <div
          className="h-full"
          style={{
            width: `${percent}%`,
            borderRadius: 3,
            backgroundColor: "var(--accent-deep)",
          }}
        />
      </div>
    </div>
  );
}
