"use client";

import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import { getControlLabel } from "@/i18n/widget-locale";

interface ColorControlProps {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
  locale: Locale;
}

export function ColorControl({
  control,
  value,
  onChange,
  disabled,
  locale,
}: ColorControlProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-zinc-300 shrink-0">
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={`#${value}`}
          onChange={(e) => onChange(control.key, e.target.value.slice(1))}
          disabled={disabled}
          className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const hex = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
            onChange(control.key, hex);
          }}
          disabled={disabled}
          maxLength={6}
          className="w-20 px-2 py-1 text-xs font-mono bg-zinc-800 border border-zinc-700 rounded text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-zinc-500"
          placeholder="hex"
        />
      </div>
    </div>
  );
}
