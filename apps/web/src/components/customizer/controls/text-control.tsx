"use client";

import { useState, useRef, useEffect } from "react";
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

/**
 * If control has options → multi-value tag badge UI with search
 * Otherwise → simple text input
 */
export function TextControl({
  control,
  value,
  onChange,
  disabled,
  locale,
}: TextControlProps) {
  if (control.options && control.options.length > 0) {
    return (
      <TagBadgeControl
        control={control}
        value={value}
        onChange={onChange}
        disabled={disabled}
        locale={locale}
      />
    );
  }

  return (
    <SimpleTextControl
      control={control}
      value={value}
      onChange={onChange}
      disabled={disabled}
      locale={locale}
    />
  );
}

function SimpleTextControl({
  control,
  value,
  onChange,
  disabled,
  locale,
}: TextControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const composingRef = useRef(false);

  useEffect(() => {
    if (!composingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  return (
    <div>
      <label
        className="block text-sm font-semibold"
        style={{ color: "var(--text)", marginBottom: 10 }}
      >
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <input
        type="text"
        value={localValue}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          onChange(control.key, e.currentTarget.value);
        }}
        onChange={(e) => {
          setLocalValue(e.target.value);
          if (!composingRef.current) {
            onChange(control.key, e.target.value);
          }
        }}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        style={{
          backgroundColor: "var(--inset)",
          border: "1px solid var(--border-soft)",
          color: "var(--text)",
        }}
        placeholder={String(control.defaultValue)}
      />
    </div>
  );
}

function TagBadgeControl({
  control,
  value,
  onChange,
  disabled,
  locale,
}: TextControlProps) {
  const isKo = locale === "ko";
  const selected = value ? value.split(",").filter(Boolean) : [];
  const allOptions = control.options ?? [];
  const available = allOptions.filter((opt) => !selected.includes(opt.value));

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
    const next = selected.filter((s) => s !== tag);
    onChange(control.key, next.join(","));
  };

  const addTag = (tag: string) => {
    const next = [...selected, tag];
    onChange(control.key, next.join(","));
    setSearch("");
    setIsOpen(false);
  };

  const getLabel = (val: string) => {
    const opt = allOptions.find((o) => o.value === val);
    if (!opt) return val.split("/").pop()?.replace(/_/g, " ") ?? val;
    return isKo && opt.labelKo ? opt.labelKo : opt.label;
  };

  // Filter available options by search
  const filtered = search
    ? available.filter((opt) => {
        const q = search.toLowerCase();
        return (
          opt.label.toLowerCase().includes(q) ||
          (opt.labelKo && opt.labelKo.includes(q)) ||
          opt.value.toLowerCase().includes(q)
        );
      })
    : available;

  // Show many options → use search mode
  const useSearch = allOptions.length > 15;

  return (
    <div ref={containerRef}>
      <label
        className="block text-sm font-semibold"
        style={{ color: "var(--text)", marginBottom: 10 }}
      >
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 10 }}>
        {selected.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => !disabled && removeTag(tag)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontSize: 12,
              padding: "7px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {getLabel(tag)}
            <span style={{ fontSize: 14, color: "var(--text-faint)", marginLeft: 2 }}>
              &times;
            </span>
          </button>
        ))}
      </div>

      {/* Search select or flat badge list */}
      {useSearch ? (
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            className="w-full px-3 py-2.5 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
            style={{
              backgroundColor: "var(--inset)",
              border: "1px solid var(--border-soft)",
              color: "var(--text)",
            }}
            placeholder={isKo ? "도시 검색..." : "Search city..."}
          />
          {isOpen && filtered.length > 0 && (
            <div
              className="absolute z-50 w-full mt-1 overflow-y-auto"
              style={{
                maxHeight: 200,
                borderRadius: 12,
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                boxShadow: "0 8px 24px -8px var(--shadow)",
              }}
            >
              {filtered.slice(0, 20).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => addTag(opt.value)}
                  className="w-full text-left px-3 py-2 text-sm transition-colors duration-100 cursor-pointer"
                  style={{ color: "var(--text)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--inset)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <span>{isKo && opt.labelKo ? opt.labelKo : opt.label}</span>
                  {isKo && opt.labelKo && (
                    <span style={{ color: "var(--text-faint)", marginLeft: 6, fontSize: 11 }}>
                      {opt.label}
                    </span>
                  )}
                  {!isKo && opt.labelKo && (
                    <span style={{ color: "var(--text-faint)", marginLeft: 6, fontSize: 11 }}>
                      {opt.labelKo}
                    </span>
                  )}
                </button>
              ))}
              {filtered.length > 20 && (
                <div
                  className="px-3 py-2 text-xs"
                  style={{ color: "var(--text-faint)" }}
                >
                  {isKo ? `외 ${filtered.length - 20}개...` : `${filtered.length - 20} more...`}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        available.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {available.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => !disabled && addTag(opt.value)}
                disabled={disabled}
                className="inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontSize: 12,
                  padding: "7px 12px",
                  borderRadius: 8,
                  border: "1px dashed var(--border-soft)",
                  backgroundColor: "transparent",
                  color: "var(--text-faint)",
                  cursor: disabled ? "not-allowed" : "pointer",
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
