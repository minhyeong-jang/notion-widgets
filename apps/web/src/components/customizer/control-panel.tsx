"use client";

import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getControlLabel } from "@/i18n/widget-locale";
import { SelectControl } from "./controls/select-control";
import { ToggleControl } from "./controls/toggle-control";
import { SliderControl } from "./controls/slider-control";
import { DateControl } from "./controls/date-control";
import { TextControl } from "./controls/text-control";

interface ControlPanelProps {
  controls: ControlDefinition[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  locale: Locale;
  dict: Dictionary;
}

const groupOrder = ["appearance", "color", "content", "advanced"];

const ACCENT_SWATCHES = [
  { key: "green", color: "#7fb686" },
  { key: "red", color: "#ef4444" },
  { key: "blue", color: "#3b82f6" },
  { key: "ocean", color: "#06b6d4" },
  { key: "sunset", color: "#f97316" },
  { key: "purple", color: "#a855f7" },
] as const;

function AccentSwatchControl({
  control,
  value,
  onChange,
  locale,
}: {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  locale: Locale;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm shrink-0" style={{ color: "var(--text-dim)" }}>
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <div className="flex items-center gap-1.5">
        {ACCENT_SWATCHES.map((swatch) => (
          <button
            key={swatch.key}
            type="button"
            onClick={() => onChange(control.key, swatch.key)}
            className="cursor-pointer transition-transform hover:scale-110"
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: swatch.color,
              border: value === swatch.key ? "2.5px solid var(--text)" : "2.5px solid transparent",
              padding: 0,
              outline: "none",
            }}
            aria-label={`Accent: ${swatch.key}`}
          />
        ))}
      </div>
    </div>
  );
}

function ControlRenderer({
  control,
  value,
  onChange,
  locale,
}: {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  locale: Locale;
}) {
  const disabled = control.isPremium;

  // Accent control gets special swatch rendering
  if (control.key === "accent") {
    return (
      <AccentSwatchControl
        control={control}
        value={value}
        onChange={onChange}
        locale={locale}
      />
    );
  }

  switch (control.type) {
    case "select":
      return (
        <SelectControl
          control={control}
          value={value}
          onChange={onChange}
          disabled={disabled}
          locale={locale}
        />
      );
    case "toggle":
      return (
        <ToggleControl
          control={control}
          value={value}
          onChange={onChange}
          disabled={disabled}
          locale={locale}
        />
      );
    case "slider":
      return (
        <SliderControl
          control={control}
          value={value}
          onChange={onChange}
          disabled={disabled}
          locale={locale}
        />
      );
    case "date":
      return (
        <DateControl
          control={control}
          value={value}
          onChange={onChange}
          disabled={disabled}
          locale={locale}
        />
      );
    case "text":
      return (
        <TextControl
          control={control}
          value={value}
          onChange={onChange}
          disabled={disabled}
          locale={locale}
        />
      );
    default:
      return null;
  }
}

export function ControlPanel({
  controls,
  values,
  onChange,
  locale,
  dict,
}: ControlPanelProps) {
  const grouped = new Map<string, ControlDefinition[]>();

  for (const control of controls) {
    const group = control.group ?? "content";
    if (!grouped.has(group)) {
      grouped.set(group, []);
    }
    grouped.get(group)!.push(control);
  }

  const sortedGroups = groupOrder.filter((g) => grouped.has(g));

  const groupLabels: Record<string, string> = {
    appearance: dict.controlGroups.appearance,
    color: dict.controlGroups.color,
    content: dict.controlGroups.content,
    advanced: dict.controlGroups.advanced,
  };

  return (
    <div className="space-y-6">
      {sortedGroups.map((group) => (
        <div key={group}>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-faint)" }}>
            {groupLabels[group] ?? group}
          </h3>
          <div className="space-y-3">
            {grouped.get(group)!.map((control) => (
              <ControlRenderer
                key={control.key}
                control={control}
                value={values[control.key] ?? String(control.defaultValue)}
                onChange={onChange}
                locale={locale}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
