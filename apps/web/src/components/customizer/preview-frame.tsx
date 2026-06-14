"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { buildEmbedUrl } from "@nw/widget-core";
import type { Dictionary } from "@/i18n/get-dictionary";

interface PreviewFrameProps {
  widgetId: string;
  params: Record<string, string>;
  recommendedSize?: { width: number; height: number };
  dict: Dictionary;
}

export function PreviewFrame({
  widgetId,
  params,
  recommendedSize,
}: PreviewFrameProps) {
  const [mode, setMode] = useState("dark");
  const [height, setHeight] = useState(
    recommendedSize ? Math.max(recommendedSize.height, 280) : 320
  );
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("nw-mode-v1");
    if (saved) {
      setMode(saved);
    } else {
      const sys = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      setMode(sys);
    }

    const handler = (e: Event) => {
      const m = (e as CustomEvent).detail;
      if (m) setMode(m);
    };
    window.addEventListener("nw-mode-change", handler);
    return () => window.removeEventListener("nw-mode-change", handler);
  }, []);

  const allParams = { ...params, mode };
  const src = buildEmbedUrl(widgetId, allParams);

  const [activeSrc, setActiveSrc] = useState(src);
  const [nextSrc, setNextSrc] = useState<string | null>(null);
  const nextIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (src !== activeSrc) {
      setNextSrc(src);
    }
  }, [src, activeSrc]);

  const handleNextLoad = () => {
    if (nextSrc) {
      setActiveSrc(nextSrc);
      setNextSrc(null);
    }
  };

  // Drag-to-resize
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = height;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [height]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientY - startY.current;
    setHeight(Math.max(200, startHeight.current + delta));
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="relative w-full">
      <div style={{ height }}>
        <iframe
          src={activeSrc}
          className="absolute inset-0 w-full h-full"
          style={{ border: "none" }}
          title="Widget Preview"
        />
        {nextSrc && (
          <iframe
            ref={nextIframeRef}
            src={nextSrc}
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            style={{ border: "none" }}
            title="Widget Preview Loading"
            onLoad={handleNextLoad}
          />
        )}
      </div>

      {/* Resize handle */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex items-center justify-center"
        style={{
          height: 18,
          cursor: "ns-resize",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: "var(--border-strong)",
          }}
        />
      </div>
    </div>
  );
}
