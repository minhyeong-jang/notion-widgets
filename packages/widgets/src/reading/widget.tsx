"use client";

import type { CSSProperties } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { ReadingParams } from "./schema";

function clampPct(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / total) * 100)));
}

export function ReadingWidget({ params }: { params: ReadingParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";

  const current = Math.min(params.current, params.total);
  const pct = clampPct(params.current, params.total);
  const remaining = Math.max(0, params.total - params.current);
  const isDone = params.current >= params.total;

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;

  const textMain = isNeon ? accent : `#${colors.text}`;
  const textSub = isNeon ? accent : `#${colors.textDim}`;
  const textFaint = isNeon ? accent : `#${colors.textFaint}`;
  const trackColor = isNeon ? `${accent}22` : `#${colors.track}`;

  const glow = isNeon ? "0 0 8px currentColor" : "none";
  const mono = isNeon ? "var(--font-geist-mono, 'Courier New', monospace)" : undefined;

  // Shared linear progress bar
  const ProgressBar = ({ height = 8 }: { height?: number }) => (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 999,
        backgroundColor: trackColor,
        overflow: "hidden",
        border: isNeon ? `1px solid ${accent}44` : "none",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: 999,
          background: isNeon
            ? accent
            : `linear-gradient(90deg, ${accentDeep}, ${accentBright})`,
          boxShadow: isNeon ? `0 0 12px ${accent}, 0 0 4px ${accent}` : "none",
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );

  const label = isNeon ? "> NOW_READING" : "NOW READING";

  const LabelRow = (
    <div className="flex items-center" style={{ gap: 6, marginBottom: 10 }}>
      <span style={{ fontSize: 13, lineHeight: 1, filter: isNeon ? undefined : "none" }}>
        📖
      </span>
      <span
        className="font-semibold uppercase"
        style={{
          fontSize: 10,
          letterSpacing: isNeon ? "1.5px" : "0.12em",
          color: textFaint,
          fontFamily: mono,
          textShadow: glow,
          opacity: isNeon ? 0.8 : 1,
        }}
      >
        {label}
      </span>
    </div>
  );

  const StatsRow = (
    <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
      <span
        className="tabular-nums font-medium"
        style={{ fontSize: 12, color: textSub, fontFamily: mono, textShadow: glow }}
      >
        {current}
        <span style={{ opacity: 0.5 }}> / {params.total} p</span>
        {params.showRemaining && !isDone && (
          <span style={{ opacity: 0.5 }}>{isNeon ? " // " : " · "}{remaining} left</span>
        )}
        {params.showRemaining && isDone && (
          <span style={{ color: accent, opacity: 0.9 }}>{isNeon ? " // " : " · "}done ✓</span>
        )}
      </span>
      <span
        className="tabular-nums font-bold"
        style={{ fontSize: 14, color: accent, fontFamily: mono, textShadow: glow }}
      >
        {pct}%
      </span>
    </div>
  );

  const TitleBlock = ({ align = "left" }: { align?: "left" | "center" }) => (
    <div style={{ textAlign: align }}>
      <div
        className="font-semibold"
        style={{
          fontSize: 18,
          lineHeight: 1.25,
          color: textMain,
          fontFamily: mono,
          textShadow: glow,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
        }}
      >
        {isNeon ? params.title.replace(/ /g, "_") : params.title}
      </div>
      <div
        style={{
          fontSize: 13,
          marginTop: 3,
          color: textSub,
          fontFamily: mono,
          textShadow: glow,
          opacity: isNeon ? 0.7 : 1,
        }}
      >
        {isNeon ? `-- ${params.author.replace(/ /g, "_")}` : params.author}
      </div>
    </div>
  );

  let inner: React.ReactNode;

  if (params.variant === "book") {
    // A closed-book graphic that fills from the bottom as pages are read.
    const BOOK_W = 104;
    const BOOK_H = 130;
    const bookBg = isNeon ? `${accent}10` : `#${colors.inset}`;
    const spine = isNeon ? accent : accentDeep;

    inner = (
      <div className="flex flex-col items-center" style={{ width: 260 }}>
        {LabelRow}
        <div
          className="relative overflow-hidden"
          style={{
            width: BOOK_W,
            height: BOOK_H,
            borderRadius: "6px 12px 12px 6px",
            backgroundColor: bookBg,
            border: isNeon ? `1px solid ${accent}55` : `1px solid #${colors.border}`,
            boxShadow: isNeon
              ? `0 0 18px ${accent}44`
              : mode === "dark"
                ? "0 6px 20px rgba(0,0,0,0.4)"
                : "0 6px 20px rgba(0,0,0,0.14)",
          }}
        >
          {/* Fill from bottom = pages read */}
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{
              height: `${pct}%`,
              background: isNeon
                ? `${accent}33`
                : `linear-gradient(180deg, ${accentBright}dd, ${accent})`,
              boxShadow: isNeon ? `0 0 16px ${accent}66` : "none",
              transition: "height 0.4s ease",
            }}
          />
          {/* Spine */}
          <div
            className="absolute top-0 bottom-0 left-0"
            style={{ width: 7, background: spine, opacity: isNeon ? 0.9 : 0.85 }}
          />
          {/* Bookmark ribbon */}
          <div
            className="absolute top-0"
            style={{
              right: 20,
              width: 13,
              height: 34,
              background: isNeon ? accentBright : accentDeep,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
              boxShadow: isNeon ? `0 0 8px ${accent}` : "none",
            }}
          />
          {/* Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-bold tabular-nums"
              style={{
                fontSize: 30,
                color: pct > 55 && !isNeon ? "#fff" : textMain,
                fontFamily: mono,
                textShadow: isNeon
                  ? glow
                  : pct > 55
                    ? "0 1px 4px rgba(0,0,0,0.3)"
                    : "none",
              }}
            >
              {pct}%
            </span>
          </div>
        </div>
        <div style={{ marginTop: 14, width: "100%" }}>
          <TitleBlock align="center" />
          <div
            className="tabular-nums"
            style={{
              fontSize: 12,
              marginTop: 8,
              textAlign: "center",
              color: textFaint,
              fontFamily: mono,
              textShadow: glow,
            }}
          >
            {current} / {params.total} p
            {params.showRemaining && !isDone && (
              <span style={{ opacity: 0.7 }}>{isNeon ? " // " : " · "}{remaining} left</span>
            )}
            {isDone && <span style={{ color: accent }}>{isNeon ? " // " : " · "}done ✓</span>}
          </div>
        </div>
      </div>
    );
  } else if (params.variant === "cover") {
    // A portrait book-cover mockup with the title printed on an accent cover.
    const COVER_W = 172;
    const COVER_H = 224;
    const coverGrad = isNeon
      ? `linear-gradient(155deg, ${accent}, ${accentDeep})`
      : `linear-gradient(155deg, ${accentBright}, ${accentDeep})`;

    inner = (
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: COVER_W,
          height: COVER_H,
          borderRadius: "4px 10px 10px 4px",
          background: coverGrad,
          padding: "22px 20px 18px 26px",
          boxShadow: isNeon
            ? `0 0 24px ${accent}66, inset 8px 0 12px -8px rgba(0,0,0,0.5)`
            : mode === "dark"
              ? "0 10px 30px rgba(0,0,0,0.45), inset 8px 0 12px -8px rgba(0,0,0,0.45)"
              : "0 10px 30px rgba(0,0,0,0.2), inset 8px 0 12px -8px rgba(0,0,0,0.35)",
          border: isNeon ? `1px solid ${accentBright}` : "none",
        }}
      >
        {/* Spine highlight */}
        <div
          className="absolute top-0 bottom-0 left-0"
          style={{ width: 5, background: "rgba(255,255,255,0.18)" }}
        />
        <span
          className="uppercase font-semibold"
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.72)",
            fontFamily: mono,
          }}
        >
          {isNeon ? "> READING" : "NOW READING"}
        </span>
        <div
          className="font-bold"
          style={{
            fontSize: 21,
            lineHeight: 1.2,
            marginTop: 10,
            color: "#fff",
            fontFamily: mono,
            textShadow: "0 1px 6px rgba(0,0,0,0.25)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical" as const,
            overflowWrap: "anywhere",
          }}
        >
          {params.title}
        </div>
        <div
          style={{
            fontSize: 12,
            marginTop: 8,
            color: "rgba(255,255,255,0.82)",
            fontFamily: mono,
          }}
        >
          {isNeon ? `-- ${params.author.replace(/ /g, "_")}` : params.author}
        </div>

        <div style={{ marginTop: "auto" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6, gap: 8 }}>
            <span
              className="tabular-nums font-medium"
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.85)",
                fontFamily: mono,
                whiteSpace: "nowrap",
              }}
            >
              {isDone ? <>done ✓</> : <>{current} / {params.total} p</>}
            </span>
            <span
              className="tabular-nums font-bold"
              style={{ fontSize: 13, color: "#fff", fontFamily: mono }}
            >
              {pct}%
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 6,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.25)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                borderRadius: 999,
                background: "rgba(255,255,255,0.95)",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </div>
    );
  } else {
    // bar (default) — clean horizontal info + linear progress
    inner = (
      <div style={{ width: 300 }}>
        {LabelRow}
        <TitleBlock align="left" />
        <div style={{ marginTop: 14 }}>
          <ProgressBar height={8} />
        </div>
        {StatsRow}
      </div>
    );
  }

  const wrapStyle: CSSProperties =
    params.variant === "cover" ? { padding: "6px" } : { padding: "12px 16px" };

  return (
    <WidgetShell params={params}>
      <div style={wrapStyle}>{inner}</div>
    </WidgetShell>
  );
}
