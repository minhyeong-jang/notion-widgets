"use client";

import { useState, useCallback } from "react";
import { buildEmbedUrl } from "@nw/widget-core";
import { Copy, Check } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";

interface UrlGeneratorProps {
  widgetId: string;
  params: Record<string, string>;
  dict: Dictionary;
}

export function UrlGenerator({ widgetId, params, dict }: UrlGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const embedPath = buildEmbedUrl(widgetId, params);

  const handleCopy = useCallback(async () => {
    const fullUrl = `${window.location.origin}${embedPath}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = fullUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [embedPath]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 min-w-0 overflow-x-auto rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3">
          <code className="text-xs text-zinc-300 break-all">
            {embedPath}
          </code>
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            copied
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? dict.customizer.copied : dict.customizer.copyUrl}
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        {dict.customizer.embedInstruction}
      </p>
    </div>
  );
}
