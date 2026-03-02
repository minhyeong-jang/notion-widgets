"use client";

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

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
        style={{ aspectRatio }}
      >
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full"
          title="Widget Preview"
        />
      </div>
      <p className="mt-2 text-xs text-zinc-600 text-center">
        {dict.customizer.livePreview}
      </p>
    </div>
  );
}
