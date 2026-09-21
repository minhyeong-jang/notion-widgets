"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

/** A stylized "no photo" scene drawn entirely from accent tones. */
function Placeholder({
  id,
  accent,
  accentBright,
  accentDeep,
  paper,
}: {
  id: string;
  accent: string;
  accentBright: string;
  accentDeep: string;
  paper: string;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 120"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block" }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentBright} stopOpacity={0.55} />
          <stop offset="100%" stopColor={accent} stopOpacity={0.28} />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`${accent}22`} />
      <rect width="120" height="120" fill={`url(#${id}-sky)`} />
      <circle cx="88" cy="34" r="12" fill={accentBright} opacity={0.85} />
      <path d="M0 120 L34 66 L58 96 L82 58 L120 120 Z" fill={accentDeep} opacity={0.9} />
      <path d="M0 120 L26 84 L48 120 Z" fill={accent} opacity={0.8} />
      <rect x="50" y="52" width="20" height="16" rx="3" fill="none" stroke={paper} strokeWidth={2.2} opacity={0.9} />
      <circle cx="60" cy="60" r="3.4" fill="none" stroke={paper} strokeWidth={2.2} opacity={0.9} />
    </svg>
  );
}

export function PhotoImage({
  src,
  fit,
  placeholderId,
  accent,
  accentBright,
  accentDeep,
  paper,
  style,
}: {
  src: string;
  fit: "cover" | "contain";
  placeholderId: string;
  accent: string;
  accentBright: string;
  accentDeep: string;
  paper: string;
  style?: CSSProperties;
}) {
  const [errored, setErrored] = useState(false);

  // Reset the error state whenever the source changes.
  useEffect(() => {
    setErrored(false);
  }, [src]);

  const trimmed = src.trim();
  const showImage = trimmed.length > 0 && !errored;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: `${accent}18`,
        ...style,
      }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={trimmed}
          alt=""
          onError={() => setErrored(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            objectPosition: "center",
            display: "block",
          }}
        />
      ) : (
        <Placeholder
          id={placeholderId}
          accent={accent}
          accentBright={accentBright}
          accentDeep={accentDeep}
          paper={paper}
        />
      )}
    </div>
  );
}
