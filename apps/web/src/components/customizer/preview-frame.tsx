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
  dict,
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
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
        style={{ aspectRatio }}
      >
        <iframe
          src={activeSrc}
          className="absolute inset-0 w-full h-full"
          title="Widget Preview"
        />
        {nextSrc && (
          <iframe
            ref={nextIframeRef}
            src={nextSrc}
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            title="Widget Preview Loading"
            onLoad={handleNextLoad}
          />
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-600 text-center">
        {dict.customizer.livePreview}
      </p>
    </div>
  );
}
