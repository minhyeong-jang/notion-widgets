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
    <div>
      <label
        className="block text-sm font-semibold"
        style={{ color: "var(--text)", marginBottom: 10 }}
      >
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(control.key, e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        style={{
          backgroundColor: "var(--inset)",
          border: "1px solid var(--border-soft)",
          color: "var(--text)",
        }}
      />
    </div>
  );
}
