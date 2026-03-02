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
      <label className="text-sm text-zinc-300 shrink-0">
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(control.key, e.target.value)}
        disabled={disabled}
        className="px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-zinc-500 cursor-pointer"
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
