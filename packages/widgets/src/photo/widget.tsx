"use client";

import type { CSSProperties } from "react";
import { resolveColors, getStyleDesign } from "@nw/widget-core";
import { WidgetShell } from "../widget-shell";
import { useWidgetColorMode } from "../color-mode-context";
import { PhotoImage } from "./photo-image";
import { getPhotoStrings } from "./strings";
import type { PhotoParams } from "./schema";

const TILT: Record<string, number> = { none: 0, left: -4, right: 4 };

export function PhotoWidget({ params }: { params: PhotoParams }) {
  const mode = useWidgetColorMode();
  const colors = resolveColors(params.accent, mode);
  const t = getPhotoStrings(params.locale);
  const isDark = mode === "dark";
  const isNeon = params.style === "neon";
  const hasShellCard = Boolean(getStyleDesign(params.style).contentCard);

  const accent = `#${colors.accent}`;
  const accentBright = `#${colors.accentBright}`;
  const accentDeep = `#${colors.accentDeep}`;
  const text = `#${colors.text}`;
  const textDim = `#${colors.textDim}`;

  // Bright "photo paper": near-white in both modes, derived from tokens.
  const paper = isDark ? `#${colors.text}` : `#${colors.surface}`;
  // Dark ink that sits on the bright paper.
  const paperInk = isDark ? `#${colors.bg}` : `#${colors.text}`;
  const rotate = TILT[params.tilt] ?? 0;

  const placeholderId = `ph-${params.accent}-${mode}-${params.variant}`;

  const photoProps = {
    src: params.src,
    fit: params.fit,
    placeholderId,
    accent,
    accentBright,
    accentDeep,
    paper,
  };

  const dropShadow = isDark
    ? "0 10px 30px rgba(0,0,0,0.45)"
    : "0 10px 30px rgba(0,0,0,0.16)";

  // ───────────────────────── POLAROID ─────────────────────────
  if (params.variant === "polaroid") {
    const PW = 232; // photo width
    const PH = 224; // photo height

    let wrapStyle: CSSProperties;
    let ink: string;
    let inkDim: string;
    let mono = false;

    if (isNeon) {
      wrapStyle = {
        background: `#${colors.surface}`,
        border: `1.5px solid ${accent}`,
        borderRadius: 4,
        padding: "12px 12px 40px",
        boxShadow: `0 0 22px ${accent}55, inset 0 0 12px ${accent}18`,
      };
      ink = accentBright;
      inkDim = accent;
      mono = true;
    } else if (hasShellCard) {
      // The frosted/soft shell card already provides the "paper" — sit flush.
      wrapStyle = { background: "transparent", padding: 0 };
      ink = text;
      inkDim = textDim;
    } else {
      wrapStyle = {
        background: paper,
        borderRadius: 3,
        padding: "12px 12px 40px",
        boxShadow: dropShadow,
      };
      ink = paperInk;
      inkDim = `${paperInk}99`;
    }

    return (
      <WidgetShell params={params}>
        <div
          style={{
            transform: rotate ? `rotate(${rotate}deg)` : undefined,
            transition: "transform .2s ease",
          }}
        >
          <div style={wrapStyle}>
            <PhotoImage
              {...photoProps}
              style={{
                width: PW,
                height: PH,
                borderRadius: isNeon ? 2 : 1,
              }}
            />
            <div
              style={{
                width: PW,
                marginTop: hasShellCard ? 14 : 12,
                textAlign: "center",
                minHeight: 20,
              }}
            >
              <span
                style={{
                  color: params.caption ? ink : inkDim,
                  fontSize: 15,
                  fontFamily: mono
                    ? "monospace"
                    : '"Segoe Script", "Bradley Hand", "Comic Sans MS", cursive',
                  letterSpacing: mono ? "1px" : "0.3px",
                }}
              >
                {mono && params.caption ? "> " : ""}
                {params.caption || t.addPhoto}
              </span>
            </div>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ───────────────────────── FILM ─────────────────────────
  if (params.variant === "film") {
    const PW = 250;
    const PH = 176;
    const filmBody = isDark ? `#${colors.surface2}` : `#${colors.text}`;
    const sprocket = isNeon ? accent : isDark ? `#${colors.inset}` : `#${colors.bgSoft}`;
    // Caption sits on the near-black film body → always a light tone (or accent for neon).
    const filmInk = isNeon ? accentBright : isDark ? `#${colors.textDim}` : `#${colors.bgSoft}`;
    const holes = Array.from({ length: 8 });

    const SprocketRow = () => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 10px",
          height: 20,
          alignItems: "center",
        }}
      >
        {holes.map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 10,
              borderRadius: 2,
              background: sprocket,
              opacity: isNeon ? 0.5 : 0.85,
              boxShadow: isNeon ? `0 0 6px ${accent}` : undefined,
            }}
          />
        ))}
      </div>
    );

    return (
      <WidgetShell params={params}>
        <div
          style={{
            transform: rotate ? `rotate(${rotate}deg)` : undefined,
            background: filmBody,
            borderRadius: 6,
            paddingBottom: 6,
            boxShadow: isNeon ? `0 0 22px ${accent}44` : dropShadow,
            border: isNeon ? `1px solid ${accent}55` : undefined,
          }}
        >
          <SprocketRow />
          <div
            style={{
              padding: "0 10px",
            }}
          >
            <PhotoImage
              {...photoProps}
              style={{
                width: PW,
                height: PH,
                borderRadius: 2,
                border: isNeon ? `1px solid ${accent}66` : `1px solid ${accent}22`,
              }}
            />
          </div>
          <SprocketRow />
          <div
            style={{
              padding: "2px 12px 4px",
              textAlign: "center",
              minHeight: 18,
            }}
          >
            <span
              style={{
                color: filmInk,
                fontSize: 11,
                fontFamily: "monospace",
                letterSpacing: "2px",
                textTransform: "uppercase",
                opacity: params.caption ? 0.95 : 0.6,
              }}
            >
              {(params.caption || t.addPhoto)}
            </span>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // ───────────────────────── FRAME ─────────────────────────
  const PW = 236;
  const PH = 180;
  const frameColor = isNeon ? accent : `#${colors.borderStrong}`;
  const matColor = isNeon ? `#${colors.surface}` : paper;
  const plaqueText = isNeon ? accentBright : text;

  return (
    <WidgetShell params={params}>
      <div
        style={{
          transform: rotate ? `rotate(${rotate}deg)` : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            background: frameColor,
            padding: isNeon ? 3 : 7,
            borderRadius: isNeon ? 4 : 5,
            boxShadow: isNeon
              ? `0 0 22px ${accent}55, inset 0 0 8px ${accent}22`
              : dropShadow,
            border: isNeon ? `1.5px solid ${accent}` : `1px solid #${colors.borderStrong}`,
          }}
        >
          <div
            style={{
              background: matColor,
              padding: 12,
              borderRadius: 2,
              boxShadow: isNeon ? undefined : "inset 0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            <PhotoImage
              {...photoProps}
              style={{
                width: PW,
                height: PH,
                borderRadius: 1,
                border: `1px solid ${accent}33`,
              }}
            />
          </div>
        </div>
        <div style={{ textAlign: "center", minHeight: 18 }}>
          <span
            style={{
              color: params.caption ? plaqueText : textDim,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: isNeon ? "monospace" : undefined,
              letterSpacing: isNeon ? "1.5px" : "0.02em",
            }}
          >
            {isNeon && params.caption ? "// " : ""}
            {params.caption || t.addPhoto}
          </span>
        </div>
      </div>
    </WidgetShell>
  );
}
