"use client";

import { useState, useRef, useEffect } from "react";
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
  const src = buildEmbedUrl(widgetId, params);
  const aspectRatio = recommendedSize
    ? `${recommendedSize.width} / ${recommendedSize.height}`
    : "16 / 9";

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

  return (
    <div className="relative w-full" style={{ aspectRatio }}>
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
  );
}
