"use client";

import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import { getControlLabel } from "@/i18n/widget-locale";

interface SelectControlProps {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
  locale: Locale;
}

export function SelectControl({
  control,
  value,
  onChange,
  disabled,
  locale,
}: SelectControlProps) {
  const isKo = locale === "ko";
  const options = control.options ?? [];

  return (
    <div>
      <label
        className="block text-sm font-semibold"
        style={{ color: "var(--text)", marginBottom: 10 }}
      >
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <div
        className="flex"
        style={{
          borderRadius: 12,
          backgroundColor: "var(--inset)",
          border: "1px solid var(--border-soft)",
          padding: 3,
        }}
      >
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(control.key, opt.value)}
              disabled={disabled}
              className="flex-1 font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontSize: 13,
                padding: "9px 12px",
                borderRadius: 9,
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                backgroundColor: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "var(--btn-text)" : "var(--text-dim)",
              }}
            >
              {isKo && opt.labelKo ? opt.labelKo : opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
