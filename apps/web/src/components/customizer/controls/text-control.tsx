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
 * If control has options → multi-value tag badge UI
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
  const selected = value
    ? value.split(",").filter(Boolean)
    : [];
  const allOptions = control.options ?? [];
  const available = allOptions.filter(
    (opt) => !selected.includes(opt.value)
  );

  const removeTag = (tag: string) => {
    const next = selected.filter((s) => s !== tag);
    onChange(control.key, next.join(","));
  };

  const addTag = (tag: string) => {
    const next = [...selected, tag];
    onChange(control.key, next.join(","));
  };

  // Display label for a tag value
  const getLabel = (val: string) => {
    const opt = allOptions.find((o) => o.value === val);
    return opt ? opt.label : val.split("/").pop()?.replace(/_/g, " ") ?? val;
  };

  return (
    <div>
      <label
        className="block text-sm font-semibold"
        style={{ color: "var(--text)", marginBottom: 10 }}
      >
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: available.length > 0 ? 10 : 0 }}>
        {selected.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => !disabled && removeTag(tag)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 font-mono font-semibold uppercase disabled:opacity-40 disabled:cursor-not-allowed"
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
            <span
              style={{
                fontSize: 14,
                color: "var(--text-faint)",
                marginLeft: 2,
              }}
            >
              &times;
            </span>
          </button>
        ))}
      </div>

      {/* Available options */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {available.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => !disabled && addTag(opt.value)}
              disabled={disabled}
              className="inline-flex items-center gap-1 font-mono uppercase disabled:opacity-40 disabled:cursor-not-allowed"
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
              <span style={{ fontSize: 13 }}>+</span> {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
