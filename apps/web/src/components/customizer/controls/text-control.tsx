"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import { getControlLabel } from "@/i18n/widget-locale";

interface TextControlProps {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
  locale: Locale;
}

export function TextControl(props: TextControlProps) {
  if (props.control.options && props.control.options.length > 0) {
    return <TagBadgeControl {...props} />;
  }
  return <SimpleTextControl {...props} />;
}

/* ── Simple text input ─────────────────────────── */

function SimpleTextControl({
  control, value, onChange, disabled, locale,
}: TextControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const composingRef = useRef(false);

  useEffect(() => {
    if (!composingRef.current) setLocalValue(value);
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-semibold" style={{ color: "var(--text)", marginBottom: 10 }}>
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <input
        type="text"
        value={localValue}
        onCompositionStart={() => { composingRef.current = true; }}
        onCompositionEnd={(e) => { composingRef.current = false; onChange(control.key, e.currentTarget.value); }}
        onChange={(e) => { setLocalValue(e.target.value); if (!composingRef.current) onChange(control.key, e.target.value); }}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        style={{ backgroundColor: "var(--inset)", border: "1px solid var(--border-soft)", color: "var(--text)" }}
        placeholder={String(control.defaultValue)}
      />
    </div>
  );
}

/* ── Timezone helpers ──────────────────────────── */

type TzOption = { value: string; label: string; labelKo?: string; gmt: string; offsetMin: number };

function getGmtOffset(tz: string): { gmt: string; offsetMin: number } {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, timeZoneName: "shortOffset",
    }).formatToParts(now);
    const offsetPart = parts.find(p => p.type === "timeZoneName")?.value ?? "";
    // offsetPart is like "GMT+9", "GMT-5", "GMT+5:30", "GMT"
    const offsetMin = (() => {
      const m = offsetPart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (!m) return 0;
      const sign = m[1] === "+" ? 1 : -1;
      return sign * (parseInt(m[2]!) * 60 + parseInt(m[3] || "0"));
    })();
    return { gmt: offsetPart || "GMT+0", offsetMin };
  } catch {
    return { gmt: "GMT", offsetMin: 0 };
  }
}

function getCityDisplay(tz: string): string {
  const city = tz.split("/").pop() ?? tz;
  return city.replace(/_/g, " ");
}

function buildAllTimezones(
  predefined: ControlDefinition["options"],
): TzOption[] {
  // Get ALL IANA timezones
  let allZones: string[];
  try {
    allZones = (Intl as unknown as { supportedValuesOf(key: string): string[] }).supportedValuesOf("timeZone");
  } catch {
    // Fallback: just use predefined
    return (predefined ?? []).map(o => {
      const { gmt, offsetMin } = getGmtOffset(o.value);
      return { ...o, gmt, offsetMin };
    });
  }

  const predefinedMap = new Map((predefined ?? []).map(o => [o.value, o]));
  const result: TzOption[] = [];

  for (const tz of allZones) {
    // Skip obscure region-only entries
    if (!tz.includes("/")) continue;
    const { gmt, offsetMin } = getGmtOffset(tz);
    const pre = predefinedMap.get(tz);
    result.push({
      value: tz,
      label: pre?.label ?? getCityDisplay(tz),
      labelKo: pre?.labelKo,
      gmt,
      offsetMin,
    });
  }

  // Sort by GMT offset
  result.sort((a, b) => a.offsetMin - b.offsetMin);
  return result;
}

/* ── Tag badge + search select ─────────────────── */

function TagBadgeControl({
  control, value, onChange, disabled, locale,
}: TextControlProps) {
  const isKo = locale === "ko";
  const selected = value ? value.split(",").filter(Boolean) : [];

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build full timezone list (memoized)
  const allTimezones = useMemo(
    () => buildAllTimezones(control.options),
    [control.options],
  );

  const allOptions = control.options ?? [];
  const useSearch = allTimezones.length > 15 || allOptions.length > 15;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const removeTag = (tag: string) => {
    onChange(control.key, selected.filter(s => s !== tag).join(","));
  };

  const addTag = (tag: string) => {
    onChange(control.key, [...selected, tag].join(","));
    setSearch("");
    setIsOpen(false);
  };

  const getLabel = (val: string): string => {
    const tz = allTimezones.find(o => o.value === val);
    if (tz) return isKo && tz.labelKo ? tz.labelKo : tz.label;
    return getCityDisplay(val);
  };

  const getGmt = (val: string): string => {
    const tz = allTimezones.find(o => o.value === val);
    return tz?.gmt ?? "";
  };

  // Available = not selected
  const available = allTimezones.filter(o => !selected.includes(o.value));

  // Filter by search
  const filtered = search
    ? available.filter(o => {
        const q = search.toLowerCase();
        return (
          o.label.toLowerCase().includes(q) ||
          (o.labelKo && o.labelKo.includes(q)) ||
          o.value.toLowerCase().includes(q) ||
          o.gmt.toLowerCase().includes(q)
        );
      })
    : available;

  return (
    <div ref={containerRef}>
      <label className="block text-sm font-semibold" style={{ color: "var(--text)", marginBottom: 10 }}>
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 10 }}>
        {selected.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => !disabled && removeTag(tag)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontSize: 12, padding: "7px 12px", borderRadius: 8,
              border: "1px solid var(--border)", backgroundColor: "var(--surface)",
              color: "var(--text)", cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {getLabel(tag)}
            <span className="font-mono" style={{ fontSize: 10, color: "var(--text-faint)", marginLeft: 4 }}>
              {getGmt(tag)}
            </span>
            <span style={{ fontSize: 14, color: "var(--text-faint)", marginLeft: 2 }}>&times;</span>
          </button>
        ))}
      </div>

      {/* Search select or flat badge list */}
      {useSearch ? (
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            className="w-full px-3 py-2.5 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
            style={{ backgroundColor: "var(--inset)", border: "1px solid var(--border-soft)", color: "var(--text)" }}
            placeholder={isKo ? "도시 검색... (예: Vienna, 비엔나, GMT+1)" : "Search city... (e.g. Vienna, GMT+1)"}
          />
          {isOpen && filtered.length > 0 && (
            <div
              className="absolute z-50 w-full mt-1 overflow-y-auto"
              style={{
                maxHeight: 240, borderRadius: 12,
                border: "1px solid var(--border)", backgroundColor: "var(--surface)",
                boxShadow: "0 8px 24px -8px var(--shadow)",
              }}
            >
              {filtered.slice(0, 30).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => addTag(opt.value)}
                  className="w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors duration-100 cursor-pointer"
                  style={{ color: "var(--text)", borderBottom: "1px solid var(--border-soft)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--inset)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <span>
                    {isKo && opt.labelKo ? opt.labelKo : opt.label}
                    {isKo && opt.labelKo && (
                      <span style={{ color: "var(--text-faint)", marginLeft: 6, fontSize: 11 }}>{opt.label}</span>
                    )}
                    {!isKo && opt.labelKo && (
                      <span style={{ color: "var(--text-faint)", marginLeft: 6, fontSize: 11 }}>{opt.labelKo}</span>
                    )}
                  </span>
                  <span className="font-mono shrink-0" style={{ fontSize: 11, color: "var(--text-faint)" }}>
                    {opt.gmt}
                  </span>
                </button>
              ))}
              {filtered.length > 30 && (
                <div className="px-3 py-2 text-xs" style={{ color: "var(--text-faint)" }}>
                  {isKo ? `외 ${filtered.length - 30}개 — 검색어를 입력하세요` : `${filtered.length - 30} more — type to search`}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        available.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {available.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => !disabled && addTag(opt.value)}
                disabled={disabled}
                className="inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontSize: 12, padding: "7px 12px", borderRadius: 8,
                  border: "1px dashed var(--border-soft)", backgroundColor: "transparent",
                  color: "var(--text-faint)", cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                <span style={{ fontSize: 13 }}>+</span>{" "}
                {isKo && opt.labelKo ? opt.labelKo : opt.label}
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}
