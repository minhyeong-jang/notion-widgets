"use client";

import { useState, useEffect } from "react";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { SleepCalculatorParams } from "./schema";

const CYCLE_MIN = 90;
const CYCLES = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h — most sleep first

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function parseTime(t: string): number {
  const [h, m] = t.split(":").map((n) => parseInt(n, 10));
  return ((h % 24) * 60 + (m % 60) + 1440) % 1440;
}

function formatTime(totalMin: number, hour12: boolean): string {
  const t = ((Math.round(totalMin) % 1440) + 1440) % 1440;
  let h = Math.floor(t / 60);
  const m = t % 60;
  const mm = String(m).padStart(2, "0");
  if (hour12) {
    const ap = h < 12 ? "AM" : "PM";
    let hh = h % 12;
    if (hh === 0) hh = 12;
    return `${hh}:${mm} ${ap}`;
  }
  return `${String(h).padStart(2, "0")}:${mm}`;
}

function formatDuration(cycles: number): string {
  const totalMin = cycles * CYCLE_MIN;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

interface Option {
  time: number;
  cycles: number;
  ideal: boolean;
}

function buildOptions(goal: string, wakeMin: number, nowMin: number, fallAsleep: number): Option[] {
  return CYCLES.map((cycles) => {
    const ideal = cycles === 5 || cycles === 6;
    if (goal === "sleep") {
      // asleep at now + buffer, then N cycles
      return { time: nowMin + fallAsleep + cycles * CYCLE_MIN, cycles, ideal };
    }
    // wake goal: count back from wake time
    return { time: wakeMin - fallAsleep - cycles * CYCLE_MIN, cycles, ideal };
  });
}

function MoonIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <path
        d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a6.8 6.8 0 0 0 10.8 10.8z"
        fill={color}
        opacity={0.9}
      />
    </svg>
  );
}

interface ViewProps {
  options: Option[];
  goal: string;
  anchorLabel: string;
  hour12: boolean;
  colors: ReturnType<typeof resolveColors>;
  isNeon: boolean;
  ready: boolean;
}

function Header({ goal, anchorLabel, colors, isNeon }: Omit<ViewProps, "options" | "hour12" | "ready">) {
  const accent = `#${colors.accent}`;
  const text = `#${colors.text}`;
  const dim = `#${colors.textDim}`;
  const title = goal === "sleep" ? "Wake up at" : "Go to bed at";
  return (
    <div className="flex items-center gap-2.5" style={{ marginBottom: 4 }}>
      <span style={{ filter: isNeon ? `drop-shadow(0 0 6px ${accent})` : undefined }}>
        <MoonIcon color={accent} />
      </span>
      <div className="flex flex-col" style={{ lineHeight: 1.2 }}>
        <span className="font-semibold" style={{ fontSize: 15, color: text }}>
          {title}
        </span>
        <span style={{ fontSize: 11.5, color: dim }}>{anchorLabel}</span>
      </div>
    </div>
  );
}

function ListView(props: ViewProps) {
  const { options, hour12, colors, isNeon, ready } = props;
  const accent = `#${colors.accent}`;
  const bright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const dim = `#${colors.textDim}`;

  return (
    <div style={{ width: 268 }}>
      <Header {...props} />
      <div className="flex flex-col" style={{ gap: 8, marginTop: 12 }}>
        {options.map((o) => (
          <div
            key={o.cycles}
            className="flex items-center justify-between"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              backgroundColor: o.ideal ? hexToRgba(accent, isNeon ? 0.12 : 0.1) : "transparent",
              border: `1px solid ${o.ideal ? hexToRgba(accent, 0.45) : hexToRgba(dim, 0.18)}`,
              boxShadow: o.ideal && isNeon ? `0 0 12px ${hexToRgba(accent, 0.3)}` : undefined,
            }}
          >
            <span
              className="font-bold tabular-nums"
              style={{
                fontSize: 22,
                color: o.ideal ? text : dim,
                letterSpacing: isNeon ? "0.04em" : "-0.01em",
                textShadow: o.ideal && isNeon ? `0 0 8px ${hexToRgba(accent, 0.5)}` : undefined,
              }}
            >
              {ready ? formatTime(o.time, hour12) : "--:--"}
            </span>
            <div className="flex items-center gap-2">
              {o.ideal && (
                <span
                  className="font-semibold uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: bright,
                    padding: "2px 7px",
                    borderRadius: 999,
                    backgroundColor: hexToRgba(accent, 0.18),
                  }}
                >
                  Ideal
                </span>
              )}
              <span className="tabular-nums" style={{ fontSize: 11.5, color: dim, textAlign: "right" }}>
                {o.cycles} cycles
                <br />
                {formatDuration(o.cycles)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardsView(props: ViewProps) {
  const { options, hour12, colors, isNeon, ready } = props;
  const accent = `#${colors.accent}`;
  const bright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const dim = `#${colors.textDim}`;

  return (
    <div className="flex flex-col items-center">
      <Header {...props} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
          marginTop: 14,
          width: 258,
        }}
      >
        {options.map((o) => (
          <div
            key={o.cycles}
            className="flex flex-col items-center"
            style={{
              padding: "12px 8px",
              borderRadius: 14,
              backgroundColor: o.ideal ? hexToRgba(accent, isNeon ? 0.14 : 0.1) : hexToRgba(dim, 0.06),
              border: `1px solid ${o.ideal ? hexToRgba(accent, 0.45) : hexToRgba(dim, 0.16)}`,
              boxShadow: o.ideal && isNeon ? `0 0 14px ${hexToRgba(accent, 0.3)}` : undefined,
            }}
          >
            <span
              className="font-bold tabular-nums"
              style={{
                fontSize: hour12 ? 20 : 24,
                whiteSpace: "nowrap",
                color: o.ideal ? text : dim,
                letterSpacing: isNeon ? "0.03em" : "-0.01em",
                textShadow: o.ideal && isNeon ? `0 0 8px ${hexToRgba(accent, 0.5)}` : undefined,
              }}
            >
              {ready ? formatTime(o.time, hour12) : "--:--"}
            </span>
            <span
              className="tabular-nums"
              style={{ fontSize: 11, color: o.ideal ? bright : dim, marginTop: 4, textAlign: "center" }}
            >
              {o.cycles} cycles · {formatDuration(o.cycles)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoonView(props: ViewProps) {
  const { options, goal, hour12, colors, isNeon, ready, anchorLabel } = props;
  const accent = `#${colors.accent}`;
  const bright = `#${colors.accentBright}`;
  const text = `#${colors.text}`;
  const dim = `#${colors.textDim}`;
  // Headline = the most-sleep ideal option (6 cycles).
  const best = options.find((o) => o.cycles === 6) ?? options[0];
  const rest = options.filter((o) => o !== best);
  const title = goal === "sleep" ? "Wake up at" : "Go to bed at";

  return (
    <div className="flex flex-col items-center" style={{ width: 268 }}>
      <div
        className="flex flex-col items-center justify-center"
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          border: `1.5px solid ${hexToRgba(accent, 0.4)}`,
          background: isNeon
            ? `radial-gradient(circle at 50% 38%, ${hexToRgba(accent, 0.22)} 0%, ${hexToRgba(accent, 0.04)} 70%)`
            : `radial-gradient(circle at 50% 38%, ${hexToRgba(accent, 0.15)} 0%, ${hexToRgba(accent, 0.03)} 72%)`,
          boxShadow: isNeon ? `0 0 26px ${hexToRgba(accent, 0.35)}` : `0 6px 24px ${hexToRgba(accent, 0.12)}`,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 20,
            filter: isNeon ? `drop-shadow(0 0 8px ${accent})` : undefined,
          }}
        >
          <MoonIcon color={accent} size={28} />
        </span>
        <span
          className="font-semibold uppercase"
          style={{ fontSize: 9.5, letterSpacing: "0.14em", color: dim, marginTop: 30 }}
        >
          {title}
        </span>
        <span
          className="font-bold tabular-nums"
          style={{
            fontSize: 34,
            lineHeight: 1.1,
            color: text,
            letterSpacing: isNeon ? "0.03em" : "-0.02em",
            textShadow: isNeon ? `0 0 12px ${hexToRgba(accent, 0.6)}` : undefined,
          }}
        >
          {ready ? formatTime(best.time, hour12) : "--:--"}
        </span>
        <span style={{ fontSize: 10.5, color: bright }}>{formatDuration(best.cycles)} · 6 cycles</span>
      </div>
      <span style={{ fontSize: 11, color: dim, marginTop: 12 }}>{anchorLabel}</span>
      <div className="flex items-center" style={{ gap: 14, marginTop: 10 }}>
        {rest.map((o) => (
          <div key={o.cycles} className="flex flex-col items-center">
            <span
              className="font-semibold tabular-nums"
              style={{ fontSize: 15, color: o.ideal ? text : dim }}
            >
              {ready ? formatTime(o.time, hour12) : "--:--"}
            </span>
            <span className="tabular-nums" style={{ fontSize: 9.5, color: dim }}>
              {o.cycles} cyc
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SleepCalculatorWidget({ params }: { params: SleepCalculatorParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";

  const [nowMin, setNowMin] = useState<number | null>(null);
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNowMin(d.getHours() * 60 + d.getMinutes());
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  const wakeMin = parseTime(params.wakeTime);
  // "wake" goal is fully deterministic; "sleep" goal needs the client clock.
  const needsNow = params.goal === "sleep";
  const ready = !needsNow || nowMin !== null;
  const options = buildOptions(params.goal, wakeMin, nowMin ?? 0, params.fallAsleep);

  const anchorLabel =
    params.goal === "sleep"
      ? ready
        ? `Asleep around ${formatTime((nowMin ?? 0) + params.fallAsleep, params.hour12)}`
        : "Based on time now"
      : `To wake at ${formatTime(wakeMin, params.hour12)}`;

  const view: ViewProps = { options, goal: params.goal, anchorLabel, hour12: params.hour12, colors, isNeon, ready };

  return (
    <WidgetShell params={params}>
      {params.variant === "cards" ? (
        <CardsView {...view} />
      ) : params.variant === "moon" ? (
        <MoonView {...view} />
      ) : (
        <ListView {...view} />
      )}
    </WidgetShell>
  );
}
