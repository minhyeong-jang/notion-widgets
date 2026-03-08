"use client";

import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { ColorControl } from "./controls/color-control";
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

  switch (control.type) {
    case "color":
      return (
        <ColorControl
          control={control}
          value={value}
          onChange={onChange}
          disabled={disabled}
          locale={locale}
        />
      );
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
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
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
