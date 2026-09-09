"use client";

import { useMemo } from "react";
import qrcode from "qrcode-generator";
import { resolveColors } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import type { QrCodeParams } from "./schema";

const QUIET = 4; // quiet-zone width in modules (QR spec minimum)

function isFinder(row: number, col: number, count: number): boolean {
  return (
    (row < 7 && col < 7) || // top-left
    (row < 7 && col >= count - 7) || // top-right
    (row >= count - 7 && col < 7) // bottom-left
  );
}

/** One styled finder "eye": dark outer ring + light hole + accent center. */
function Eye({
  x,
  y,
  outer,
  hole,
  inner,
}: {
  x: number;
  y: number;
  outer: string;
  hole: string;
  inner: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={7} height={7} rx={1.75} fill={outer} />
      <rect x={x + 1} y={y + 1} width={5} height={5} rx={1.15} fill={hole} />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.75} fill={inner} />
    </g>
  );
}

function QrSvg({
  data,
  ecLevel,
  variant,
  chipBg,
  dataColor,
  eyeOuter,
  eyeInner,
}: {
  data: string;
  ecLevel: "L" | "M" | "Q" | "H";
  variant: "square" | "rounded" | "dots";
  chipBg: string;
  dataColor: string;
  eyeOuter: string;
  eyeInner: string;
}) {
  const { count, cells } = useMemo(() => {
    const qr = qrcode(0, ecLevel);
    qr.addData(data);
    qr.make();
    const n = qr.getModuleCount();
    const c: Array<{ r: number; col: number }> = [];
    for (let r = 0; r < n; r++) {
      for (let col = 0; col < n; col++) {
        if (qr.isDark(r, col) && !isFinder(r, col, n)) {
          c.push({ r, col });
        }
      }
    }
    return { count: n, cells: c };
  }, [data, ecLevel]);

  const vb = count + QUIET * 2;

  return (
    <svg
      viewBox={`0 0 ${vb} ${vb}`}
      width="100%"
      height="100%"
      shapeRendering="geometricPrecision"
      style={{ display: "block" }}
      role="img"
      aria-label={data}
    >
      <rect x={0} y={0} width={vb} height={vb} fill={chipBg} />
      <g transform={`translate(${QUIET},${QUIET})`}>
        {cells.map(({ r, col }, i) => {
          if (variant === "dots") {
            return <circle key={i} cx={col + 0.5} cy={r + 0.5} r={0.58} fill={dataColor} />;
          }
          if (variant === "rounded") {
            return (
              <rect key={i} x={col + 0.02} y={r + 0.02} width={0.96} height={0.96} rx={0.24} fill={dataColor} />
            );
          }
          return <rect key={i} x={col} y={r} width={1.02} height={1.02} fill={dataColor} />;
        })}
        <Eye x={0} y={0} outer={eyeOuter} hole={chipBg} inner={eyeInner} />
        <Eye x={count - 7} y={0} outer={eyeOuter} hole={chipBg} inner={eyeInner} />
        <Eye x={0} y={count - 7} outer={eyeOuter} hole={chipBg} inner={eyeInner} />
      </g>
    </svg>
  );
}

export function QrCodeWidget({ params }: { params: QrCodeParams }) {
  const mode = useWidgetColorMode();
  const modeColors = resolveColors(params.accent, mode);
  // The QR itself must stay dark-on-light to scan reliably regardless of the
  // widget theme, so its palette is always derived from the light mode.
  const light = resolveColors(params.accent, "light");
  const chipBg = `#${light.surface}`;
  const dataColor = `#${light.text}`;
  const eyeOuter = `#${light.text}`;
  const eyeInner = `#${light.accent}`;

  const captionColor = `#${modeColors.accent}`;
  const hasData = params.data.trim().length > 0;
  const caption = params.caption.trim();

  const isNeon = params.style === "neon";
  const chipShadow = isNeon
    ? `0 0 30px #${modeColors.accent}66, 0 0 0 3px #${modeColors.accent}`
    : `0 10px 34px rgba(0,0,0,0.18), 0 0 0 5px #${modeColors.accentTint}`;

  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center gap-3 px-6">
        <div
          style={{
            background: chipBg,
            borderRadius: 18,
            overflow: "hidden",
            padding: 10,
            width: "min(220px, 60vw)",
            aspectRatio: "1 / 1",
            boxShadow: chipShadow,
          }}
        >
          {hasData ? (
            <QrSvg
              data={params.data}
              ecLevel={params.ecLevel}
              variant={params.variant}
              chipBg={chipBg}
              dataColor={dataColor}
              eyeOuter={eyeOuter}
              eyeInner={eyeInner}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-center text-xs"
              style={{ color: `#${light.textDim}` }}
            >
              Enter a URL or text
            </div>
          )}
        </div>

        {caption && (
          <span
            className="text-sm font-semibold text-center max-w-[240px] truncate"
            style={{ color: captionColor, textShadow: "var(--w-text-shadow)" }}
          >
            {caption}
          </span>
        )}
      </div>
    </WidgetShell>
  );
}
