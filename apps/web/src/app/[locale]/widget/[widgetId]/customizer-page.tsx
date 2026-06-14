"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { getWidget, getAllWidgets, buildEmbedUrl } from "@nw/widget-core";
import "@nw/widgets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getWidgetName, getWidgetDescription } from "@/i18n/widget-locale";
import { ControlPanel } from "@/components/customizer/control-panel";
import { PreviewFrame } from "@/components/customizer/preview-frame";
import { WidgetCard } from "@/components/shared/widget-card";
import { Footer } from "@/components/shared/footer";
import Link from "next/link";

interface CustomizerPageProps {
  widgetId: string;
  locale: Locale;
  dict: Dictionary;
}

export function CustomizerPage({ widgetId, locale, dict }: CustomizerPageProps) {
  const widget = getWidget(widgetId);
  const allWidgets = useMemo(() => getAllWidgets(), []);

  const [currentParams, setCurrentParams] = useState<Record<string, string>>(
    () => {
      const params: Record<string, string> = {};
      if (widget) {
        for (const control of widget.controls ?? []) {
          params[control.key] = String(control.defaultValue);
        }
      }
      return params;
    }
  );

  const [ready, setReady] = useState(false);

  // On mount: merge URL params + site accent, then mark ready
  useEffect(() => {
    const updates: Record<string, string> = {};

    // 1) URL params take priority (shared links)
    const url = new URL(window.location.href);
    url.searchParams.forEach((v, k) => { updates[k] = v; });

    // 2) Site accent as fallback (if not in URL)
    if (!updates.accent) {
      const siteAccent = localStorage.getItem("nw-accent-v1");
      if (siteAccent) updates.accent = siteAccent;
    }

    if (Object.keys(updates).length > 0) {
      setCurrentParams(prev => {
        const merged = { ...prev, ...updates };
        // Sync merged params to URL
        const next = new URL(window.location.href);
        for (const [k, v] of Object.entries(merged)) {
          next.searchParams.set(k, v);
        }
        window.history.replaceState(null, "", next.toString());
        return merged;
      });
    }
    setReady(true);
  }, []);

  const handleChange = useCallback((key: string, value: string) => {
    setCurrentParams((prev) => {
      const next = { ...prev, [key]: value };
      const url = new URL(window.location.href);
      url.searchParams.set(key, value);
      window.history.replaceState(null, "", url.toString());
      return next;
    });
  }, []);

  if (!widget) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <p style={{ color: "var(--text-faint)" }}>
          {dict.customizer.widgetNotFound}: {widgetId}
        </p>
      </div>
    );
  }

  const name = getWidgetName(widget, locale);
  const description = getWidgetDescription(widget, locale);
  const isKo = locale === "ko";
  const embedUrl = buildEmbedUrl(
    widgetId,
    currentParams,
    "https://widgets.doriri.dev/embed/"
  );

  // Category label
  const categoryLabels: Record<string, string> = {
    time: isKo ? "시간" : "Time",
    productivity: isKo ? "생산성" : "Productivity",
    lifestyle: isKo ? "라이프스타일" : "Lifestyle",
    utility: isKo ? "유틸리티" : "Utility",
  };
  const categoryLabel = categoryLabels[widget.category || ""] || "";

  // Related widgets (same category, exclude current)
  const related = allWidgets
    .filter((w) => w.category === widget.category && w.meta.id !== widgetId)
    .slice(0, 4);

  return (
    <main style={{ color: "var(--text)" }}>
      <div className="mx-auto px-8" style={{ maxWidth: "var(--maxw)" }}>
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 pt-6 pb-2"
          style={{ fontSize: "13px" }}
        >
          <Link
            href={`/${locale}/widgets`}
            style={{ color: "var(--text-dim)", textDecoration: "none" }}
            className="hover:underline"
          >
            {isKo ? "위젯 갤러리" : "Widget Gallery"}
          </Link>
          <span style={{ color: "var(--text-faint)" }}>/</span>
          <span style={{ color: "var(--text-faint)" }}>{categoryLabel}</span>
        </div>

        {/* Header */}
        <div style={{ paddingBottom: 28 }}>
          <h1
            className="font-extrabold"
            style={{ fontSize: 34, letterSpacing: "-0.02em" }}
          >
            {name}
          </h1>
          <p
            style={{
              marginTop: 8,
              fontSize: "15px",
              color: "var(--text-dim)",
            }}
          >
            {description}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {[
              widget.meta.id,
              categoryLabel,
              widget.recommendedSize
                ? `${isKo ? "권장" : "Size"} ${widget.recommendedSize.width} × ${widget.recommendedSize.height}`
                : null,
            ]
              .filter(Boolean)
              .map((badge, i) => (
                <span
                  key={i}
                  className="font-mono"
                  style={{
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: 7,
                    border: "1px solid var(--border)",
                    color: "var(--text-faint)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  {badge}
                </span>
              ))}
          </div>
        </div>

        {/* 2-column: preview + controls */}
        <div className="detail-grid">
          {/* Preview */}
          <div className="detail-preview">
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 18,
                overflow: "hidden",
                backgroundColor: "var(--inset)",
              }}
            >
              {/* Stage label */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{
                  borderBottom: "1px solid var(--border-soft)",
                  fontSize: "11px",
                }}
              >
                <span
                  className="font-mono font-bold tracking-wider uppercase"
                  style={{ color: "var(--text-faint)" }}
                >
                  Live Preview
                </span>
                <span
                  className="flex items-center gap-1.5"
                  style={{ color: "var(--accent)", fontSize: "11px" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  {isKo ? "실시간" : "Live"}
                </span>
              </div>
              {/* Iframe preview — wait until params are ready to avoid accent flash */}
              {ready && (
                <PreviewFrame
                  widgetId={widgetId}
                  params={currentParams}
                  recommendedSize={widget.recommendedSize}
                  dict={dict}
                />
              )}
            </div>
          </div>

          {/* Controls panel */}
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 16,
              backgroundColor: "var(--surface)",
              padding: "22px 20px",
            }}
          >
            <h2
              className="font-bold"
              style={{ fontSize: 16, marginBottom: 6 }}
            >
              {isKo ? "커스터마이징" : "Customize"}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-faint)",
                marginBottom: 20,
              }}
            >
              {isKo
                ? "설정은 URL에 저장됩니다. 가입이 필요 없어요."
                : "Settings are saved in the URL. No sign-up needed."}
            </p>
            <ControlPanel
              controls={widget.controls ?? []}
              values={currentParams}
              onChange={handleChange}
              locale={locale}
              dict={dict}
            />
          </div>
        </div>

        {/* Embed URL bar */}
        <div
          style={{
            marginTop: 22,
            border: "1px solid var(--border)",
            borderRadius: 16,
            backgroundColor: "var(--surface)",
            padding: 20,
          }}
        >
          <h2
            className="font-bold"
            style={{ fontSize: 14, marginBottom: 13 }}
          >
            {isKo ? "임베드 URL" : "Embed URL"}
          </h2>
          <EmbedUrlRow url={embedUrl} isKo={isKo} />
          <p
            style={{
              marginTop: 12,
              fontSize: "12.5px",
              color: "var(--text-faint)",
            }}
          >
            {isKo ? "Notion에서 " : "In Notion, add "}
            <span
              className="font-mono"
              style={{
                color: "var(--accent)",
                backgroundColor: "var(--accent-tint)",
                padding: "1px 6px",
                borderRadius: 5,
              }}
            >
              /embed
            </span>
            {isKo
              ? " 블록을 추가한 뒤 위 URL을 붙여넣으세요."
              : " block, then paste the URL above."}
          </p>
        </div>

        {/* Related widgets */}
        {related.length > 0 && (
          <div style={{ marginTop: 56, paddingBottom: 40 }}>
            <div
              className="font-mono font-bold tracking-wider uppercase"
              style={{
                fontSize: "11px",
                color: "var(--text-faint)",
                marginBottom: 18,
                letterSpacing: "0.12em",
              }}
            >
              {isKo ? "같은 카테고리의 다른 위젯" : "More from this category"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {related.map((w) => (
                <WidgetCard
                  key={w.meta.id}
                  widgetId={w.meta.id}
                  name={getWidgetName(w, locale)}
                  description={getWidgetDescription(w, locale)}
                  locale={locale}
                  recommendedSize={w.recommendedSize}
                  category={w.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* Responsive styles */}
      <style>{`
        .detail-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: 1.1fr 0.72fr;
        }
        .detail-preview {
          position: sticky;
          top: 76px;
          align-self: start;
        }
        @media (max-width: 860px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
          .detail-preview {
            position: static;
          }
        }
        .embed-url-row {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }
        @media (max-width: 560px) {
          .embed-url-row {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

function EmbedUrlRow({ url, isKo }: { url: string; isKo: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="embed-url-row">
      <code
        className="flex-1 overflow-x-auto whitespace-nowrap flex items-center font-mono"
        style={{
          fontSize: "12.5px",
          color: "var(--text-dim)",
          backgroundColor: "var(--inset)",
          border: "1px solid var(--border-soft)",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        {url}
      </code>
      <button
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold"
        style={{
          fontSize: 14,
          borderRadius: 10,
          padding: "0 18px",
          border: "none",
          cursor: "pointer",
          backgroundColor: copied ? "var(--accent-deep)" : "var(--accent)",
          color: "var(--btn-text)",
          minHeight: 44,
        }}
      >
        {copied
          ? isKo
            ? "복사됨!"
            : "Copied!"
          : isKo
            ? "URL 복사"
            : "Copy URL"}
      </button>
    </div>
  );
}
