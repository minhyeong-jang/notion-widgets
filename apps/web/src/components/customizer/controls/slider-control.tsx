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
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <label
          className="text-sm font-semibold"
          style={{ color: "var(--text)" }}
        >
          {getControlLabel(control, locale)}
          {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
        </label>
        <span
          className="text-xs font-mono"
          style={{ color: "var(--text-faint)" }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        value={Number(value)}
        onChange={(e) => onChange(control.key, e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="w-full disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ accentColor: "var(--accent)" }}
      />
    </div>
  );
}
