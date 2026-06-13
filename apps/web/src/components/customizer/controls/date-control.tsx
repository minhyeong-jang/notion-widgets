"use client";

import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import { getControlLabel } from "@/i18n/widget-locale";

interface DateControlProps {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
  locale: Locale;
}

export function DateControl({
  control,
  value,
  onChange,
  disabled,
  locale,
}: DateControlProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm shrink-0" style={{ color: "var(--text-dim)" }}>
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(control.key, e.target.value)}
        disabled={disabled}
        className="px-2 py-1 text-sm rounded disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        style={{
          backgroundColor: "var(--inset)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      />
    </div>
  );
}
