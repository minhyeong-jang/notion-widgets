"use client";

import type { CSSProperties } from "react";
import { resolveColors, type ResolvedColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { NowPlayingParams } from "./schema";

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

/** Synthesize a plausible m:ss timestamp from a 0–100 progress value. */
function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const TRACK_LENGTH = 210; // 3:30 reference track

interface DiscProps {
  colors: ResolvedColors;
  mode: "dark" | "light";
  spin: boolean;
  isNeon: boolean;
}

const SIZE = 116;

function VinylDisc({ colors, spin, isNeon }: DiscProps) {
  const spinStyle: CSSProperties = spin
    ? { animation: "np-spin 4s linear infinite" }
    : {};

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
      {/* Tonearm */}
      <div
        style={{
          position: "absolute",
          top: -3,
          right: 4,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: `#${colors.textDim}`,
          boxShadow: `0 0 0 2px ${hexToRgba(colors.borderStrong, 0.6)}`,
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 3,
          right: 7,
          width: 3,
          height: SIZE * 0.46,
          background: `#${colors.textFaint}`,
          borderRadius: 3,
          transformOrigin: "top center",
          transform: "rotate(26deg)",
          zIndex: 3,
          opacity: 0.85,
        }}
      />
      {/* Disc plate */}
      <div
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 40%, ${hexToRgba(
            colors.textFaint,
            0.16,
          )}, transparent 52%), radial-gradient(circle at 50% 50%, #${colors.surface} 0%, #${colors.inset} 56%, #${colors.bgSoft} 100%)`,
          boxShadow: isNeon
            ? `inset 0 0 0 1px ${hexToRgba(colors.accent, 0.4)}, 0 0 22px ${hexToRgba(
                colors.accent,
                0.35,
              )}`
            : `inset 0 0 0 1px ${hexToRgba(colors.border, 0.7)}, 0 8px 20px rgba(0,0,0,0.28)`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...spinStyle,
        }}
      >
        {/* Grooves */}
        <div
          style={{
            position: "absolute",
            inset: 7,
            borderRadius: "50%",
            backgroundImage: `repeating-radial-gradient(circle at 50% 50%, transparent 0 2px, ${hexToRgba(
              isNeon ? colors.accent : colors.border,
              0.3,
            )} 2px 3px)`,
            opacity: 0.75,
          }}
        />
        {/* Center label */}
        <div
          style={{
            width: "42%",
            height: "42%",
            borderRadius: "50%",
            background: `radial-gradient(circle at 34% 30%, #${colors.accentBright}, #${colors.accent} 46%, #${colors.accentDeep} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 0 1px ${hexToRgba(colors.accentDeep, 0.5)}`,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Spindle hole */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: `#${colors.bg}`,
              boxShadow: `inset 0 0 0 1px ${hexToRgba(colors.accentDeep, 0.4)}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CdDisc({ colors, mode, spin, isNeon }: DiscProps) {
  const spinStyle: CSSProperties = spin
    ? { animation: "np-spin 4s linear infinite" }
    : {};

  return (
    <div
      style={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        flexShrink: 0,
        background: `radial-gradient(circle at 50% 50%, #${colors.surface} 0%, #${colors.surface2} 60%, #${colors.bgSoft} 100%)`,
        boxShadow: isNeon
          ? `inset 0 0 0 1px ${hexToRgba(colors.accent, 0.4)}, 0 0 22px ${hexToRgba(
              colors.accent,
              0.35,
            )}`
          : `inset 0 0 0 1px ${hexToRgba(colors.border, 0.7)}, 0 8px 20px rgba(0,0,0,0.22)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...spinStyle,
      }}
    >
      {/* Iridescent sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${hexToRgba(
            colors.accentBright,
            0,
          )}, ${hexToRgba(colors.accentBright, 0.55)}, ${hexToRgba(
            colors.accent,
            0,
          )}, ${hexToRgba(colors.accentDeep, 0.55)}, ${hexToRgba(
            colors.accentBright,
            0,
          )}, ${hexToRgba(colors.accent, 0.55)}, ${hexToRgba(colors.accentBright, 0)})`,
          opacity: 0.8,
          mixBlendMode: mode === "dark" ? "screen" : "multiply",
        }}
      />
      {/* Fine tracks */}
      <div
        style={{
          position: "absolute",
          inset: 4,
          borderRadius: "50%",
          backgroundImage: `repeating-radial-gradient(circle at 50% 50%, transparent 0 3px, ${hexToRgba(
            colors.border,
            0.28,
          )} 3px 4px)`,
        }}
      />
      {/* Center hub */}
      <div
        style={{
          width: "34%",
          height: "34%",
          borderRadius: "50%",
          background: `#${colors.bgSoft}`,
          boxShadow: `inset 0 0 0 1px ${hexToRgba(colors.border, 0.7)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "42%",
            height: "42%",
            borderRadius: "50%",
            background: `#${colors.bg}`,
            boxShadow: `inset 0 0 0 1px ${hexToRgba(colors.borderStrong, 0.5)}`,
          }}
        />
      </div>
    </div>
  );
}

function Reel({
  colors,
  spin,
  size,
}: {
  colors: ResolvedColors;
  spin: boolean;
  size: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        background: `radial-gradient(circle at 50% 50%, #${colors.surface2} 34%, #${colors.textFaint} 35% 40%, #${colors.surface2} 41%)`,
        boxShadow: `inset 0 0 0 1px ${hexToRgba(colors.border, 0.6)}`,
        animation: spin ? "np-spin 2.4s linear infinite" : "none",
        flexShrink: 0,
      }}
    >
      {/* Spokes */}
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: "50%",
          background: `conic-gradient(${hexToRgba(colors.textDim, 0.55)} 0 12deg, transparent 12deg 90deg, ${hexToRgba(
            colors.textDim,
            0.55,
          )} 90deg 102deg, transparent 102deg 180deg, ${hexToRgba(
            colors.textDim,
            0.55,
          )} 180deg 192deg, transparent 192deg 270deg, ${hexToRgba(
            colors.textDim,
            0.55,
          )} 270deg 282deg, transparent 282deg 360deg)`,
        }}
      />
      {/* Hub */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 6,
          height: 6,
          marginTop: -3,
          marginLeft: -3,
          borderRadius: "50%",
          background: `#${colors.accent}`,
        }}
      />
    </div>
  );
}

function CassetteDisc({ colors, spin, isNeon }: DiscProps) {
  const reel = 26;
  return (
    <div
      style={{
        width: 150,
        height: 100,
        borderRadius: 12,
        position: "relative",
        flexShrink: 0,
        background: `linear-gradient(160deg, #${colors.surface} 0%, #${colors.surface2} 100%)`,
        border: `1px solid #${colors.border}`,
        boxShadow: isNeon
          ? `inset 0 0 0 1px ${hexToRgba(colors.accent, 0.35)}, 0 0 22px ${hexToRgba(
              colors.accent,
              0.3,
            )}`
          : `0 8px 20px rgba(0,0,0,0.18)`,
        padding: 9,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Label strip */}
      <div
        style={{
          height: 22,
          borderRadius: 5,
          background: hexToRgba(colors.accent, 0.14),
          border: `1px solid ${hexToRgba(colors.accent, 0.28)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 7px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <span style={{ width: 14, height: 2, borderRadius: 2, background: hexToRgba(colors.accent, 0.6) }} />
          <span style={{ width: 9, height: 2, borderRadius: 2, background: hexToRgba(colors.accent, 0.4) }} />
        </div>
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: `#${colors.accent}`,
            letterSpacing: 1,
          }}
        >
          A
        </span>
      </div>
      {/* Reel window */}
      <div
        style={{
          flex: 1,
          margin: "6px 0",
          borderRadius: 7,
          background: `#${colors.inset}`,
          boxShadow: `inset 0 0 0 1px ${hexToRgba(colors.border, 0.7)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          position: "relative",
        }}
      >
        {/* Tape spool between reels */}
        <div
          style={{
            position: "absolute",
            left: 26,
            right: 26,
            top: "50%",
            height: 3,
            marginTop: -1.5,
            borderRadius: 2,
            background: hexToRgba(colors.accent, 0.35),
          }}
        />
        <Reel colors={colors} spin={spin} size={reel} />
        <Reel colors={colors} spin={spin} size={reel} />
      </div>
      {/* Transport holes */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: `#${colors.bgSoft}`,
              boxShadow: `inset 0 0 0 1px ${hexToRgba(colors.borderStrong, 0.6)}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Equalizer({ color, animate }: { color: string; animate: boolean }) {
  const bars = [0, 1, 2, 3];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 11 }}>
      {bars.map((i) => (
        <span
          key={i}
          style={{
            width: 2.5,
            borderRadius: 2,
            background: color,
            height: animate ? "100%" : `${[60, 100, 45, 80][i]}%`,
            transformOrigin: "bottom",
            animation: animate
              ? `np-eq 0.9s ease-in-out ${i * 0.15}s infinite`
              : "none",
          }}
        />
      ))}
    </div>
  );
}

export function NowPlayingWidget({ params }: { params: NowPlayingParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const isNeon = params.style === "neon";
  const spin = params.spin;

  const accent = `#${colors.accent}`;
  const titleColor = isNeon ? `#${colors.accentBright}` : `#${colors.text}`;
  const artistColor = isNeon ? `#${colors.accent}` : `#${colors.textDim}`;
  const eyebrowColor = isNeon ? `#${colors.accent}` : `#${colors.textDim}`;

  const elapsed = (TRACK_LENGTH * params.progress) / 100;

  const discProps: DiscProps = { colors, mode, spin, isNeon };
  const disc =
    params.variant === "cassette" ? (
      <CassetteDisc {...discProps} />
    ) : params.variant === "cd" ? (
      <CdDisc {...discProps} />
    ) : (
      <VinylDisc {...discProps} />
    );

  const eyebrowLabel = isNeon ? "> now_playing" : "NOW PLAYING";

  return (
    <WidgetShell params={params}>
      <style>{`
        @keyframes np-spin { to { transform: rotate(360deg); } }
        @keyframes np-eq {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
      `}</style>
      <div
        className="flex items-center"
        style={{ gap: 20, padding: "8px 20px", maxWidth: 470, width: "100%" }}
      >
        {disc}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <Equalizer color={accent} animate={spin} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: isNeon ? 1 : 1.5,
                textTransform: isNeon ? "none" : "uppercase",
                color: eyebrowColor,
                textShadow: "var(--w-text-shadow)",
              }}
            >
              {eyebrowLabel}
            </span>
          </div>
          {/* Title */}
          <div
            style={{
              fontSize: 20,
              lineHeight: 1.2,
              fontWeight: 700,
              color: titleColor,
              textShadow: "var(--w-text-shadow)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isNeon ? `♪ ${params.title}` : params.title}
          </div>
          {/* Artist */}
          <div
            style={{
              fontSize: 13,
              marginTop: 2,
              color: artistColor,
              opacity: isNeon ? 0.85 : 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.artist}
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 14, width: "100%" }}>
            <div
              style={{
                position: "relative",
                height: 4,
                borderRadius: 3,
                background: `#${colors.track}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${params.progress}%`,
                  borderRadius: 3,
                  background: accent,
                  boxShadow: isNeon ? `0 0 8px ${hexToRgba(colors.accent, 0.7)}` : "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${params.progress}%`,
                  width: 9,
                  height: 9,
                  marginTop: -4.5,
                  marginLeft: -4.5,
                  borderRadius: "50%",
                  background: accent,
                  boxShadow: isNeon
                    ? `0 0 8px ${hexToRgba(colors.accent, 0.9)}`
                    : `0 1px 3px rgba(0,0,0,0.3)`,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: 10,
                fontVariantNumeric: "tabular-nums",
                color: `#${colors.textFaint}`,
              }}
            >
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(TRACK_LENGTH)}</span>
            </div>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
