"use client";

import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { MandalaParams } from "./schema";
import { buildMandala, type MandalaLayer } from "./geometry";

export function MandalaWidget({ params }: { params: MandalaParams }) {
  const colorMode = useWidgetColorMode();
  const colors = resolveColors(params.accent, colorMode);
  const isDark = colorMode === "dark";
  const isNeon = params.style === "neon";

  const layers = buildMandala(params.variant, params.complexity);

  const shadeColor: Record<MandalaLayer["shade"], string> = {
    bright: `#${colors.accentBright}`,
    base: `#${colors.accent}`,
    deep: `#${colors.accentDeep}`,
    dim: `#${isDark ? colors.accentDim : colors.border}`,
  };

  // Glow strength: strongest for neon, soft in dark, none in light.
  const glowStd = isNeon ? 1.9 : isDark ? 1.1 : 0;
  const glowOpacity = isNeon ? 1 : 0.8;
  const filterId = `mandala-glow-${params.variant}`;

  const size = 240;
  const duration = params.complexity === "high" ? 90 : 64;

  return (
    <WidgetShell params={params}>
      {params.animate && (
        <style>{`
          @keyframes mandala-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        role="img"
        aria-label={`${params.variant} mandala`}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          {glowStd > 0 && (
            <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation={glowStd}
                floodColor={`#${colors.accentBright}`}
                floodOpacity={glowOpacity}
              />
            </filter>
          )}
        </defs>
        <g
          filter={glowStd > 0 ? `url(#${filterId})` : undefined}
          style={
            params.animate
              ? {
                  animation: `mandala-spin ${duration}s linear infinite`,
                  transformOrigin: "100px 100px",
                }
              : undefined
          }
        >
          {layers.map((layer, i) => (
            <path
              key={i}
              d={layer.d}
              fill="none"
              stroke={shadeColor[layer.shade]}
              strokeWidth={layer.width}
              strokeOpacity={layer.opacity}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {/* center accent dot */}
          <circle cx={100} cy={100} r={2.6} fill={`#${colors.accentBright}`} />
        </g>
      </svg>
    </WidgetShell>
  );
}
