"use client";

import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import { getControlLabel } from "@/i18n/widget-locale";

interface SliderControlProps {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
  locale: Locale;
  min?: number;
  max?: number;
  step?: number;
}

export function SliderControl({
  control,
  value,
  onChange,
  disabled,
  locale,
  min = 0,
  max = 100,
  step = 1,
}: SliderControlProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-zinc-300 shrink-0">
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          value={Number(value)}
          onChange={(e) => onChange(control.key, e.target.value)}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className="w-24 accent-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <span className="text-xs font-mono text-zinc-400 w-8 text-right">
          {value}
        </span>
      </div>
    </div>
  );
}
