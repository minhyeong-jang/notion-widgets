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
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm shrink-0" style={{ color: "var(--text-dim)" }}>
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(control.key, e.target.value)}
        disabled={disabled}
        className="px-3 py-1.5 text-sm rounded disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none cursor-pointer"
        style={{
          backgroundColor: "var(--inset)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        {control.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
