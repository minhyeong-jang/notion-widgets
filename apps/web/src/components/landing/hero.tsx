"use client";

import { useState, useEffect } from "react";
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

          {/* Right column — Notion mockup with live widgets */}
          <NotionMockup />
        </div>
      </div>
    </section>
  );
}

function NotionMockup() {
  const [accent, setAccent] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    const systemMode = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    setAccent(localStorage.getItem("nw-accent-v1") || "green");
    setMode(localStorage.getItem("nw-mode-v1") || systemMode);

    const accentHandler = (e: Event) => {
      const a = (e as CustomEvent).detail;
      if (a) setAccent(a);
    };
    const modeHandler = (e: Event) => {
      const m = (e as CustomEvent).detail;
      if (m) setMode(m);
    };
    window.addEventListener("nw-accent-change", accentHandler);
    window.addEventListener("nw-mode-change", modeHandler);
    return () => {
      window.removeEventListener("nw-accent-change", accentHandler);
      window.removeEventListener("nw-mode-change", modeHandler);
    };
  }, []);

  return (
    <div
      className="bg-surface border border-border shadow-lg"
      style={{ borderRadius: 16, padding: "22px 22px 26px" }}
    >
      {/* Window dots */}
      <div className="flex gap-1.5" style={{ marginBottom: 18 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: 9,
              height: 9,
              backgroundColor: "var(--border-strong)",
            }}
          />
        ))}
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

      {/* Embed block 1: World Clock (live) */}
      <EmbedBlock label="world-clock">
        {accent && mode && (
          <iframe
            src={`/embed/world-clock?accent=${accent}&mode=${mode}&variant=minimal&format=24h&timezones=America/New_York,Europe/London,Asia/Seoul`}
            className="w-full pointer-events-none"
            style={{ border: "none", height: 120 }}
            title="World Clock preview"
          />
        )}
      </EmbedBlock>

      {/* Embed block 2: Life Progress (live) */}
      <EmbedBlock label="life-progress" style={{ marginTop: 12 }}>
        {accent && mode && (
          <iframe
            src={`/embed/life-progress?accent=${accent}&mode=${mode}&variant=minimal`}
            className="w-full pointer-events-none"
            style={{ border: "none", height: 140 }}
            title="Life Progress preview"
          />
        )}
      </EmbedBlock>
    </div>
  );
}

function EmbedBlock({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="border border-border-soft overflow-hidden"
      style={{ borderRadius: 10, ...style }}
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
        <span className="text-accent">{label}</span>
      </div>
      {children}
    </div>
  );
}
