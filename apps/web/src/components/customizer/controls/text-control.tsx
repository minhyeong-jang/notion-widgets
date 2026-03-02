"use client";

import { useState, useRef, useEffect } from "react";
import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import { getControlLabel } from "@/i18n/widget-locale";

interface TextControlProps {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
  locale: Locale;
}

export function TextControl({
  control,
  value,
  onChange,
  disabled,
  locale,
}: TextControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const composingRef = useRef(false);

  // Sync from parent when value changes externally
  useEffect(() => {
    if (!composingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-zinc-300 shrink-0">
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <input
        type="text"
        value={localValue}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          onChange(control.key, e.currentTarget.value);
        }}
        onChange={(e) => {
          setLocalValue(e.target.value);
          if (!composingRef.current) {
            onChange(control.key, e.target.value);
          }
        }}
        disabled={disabled}
        className="w-40 px-2 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-zinc-500"
        placeholder={String(control.defaultValue)}
      />
    </div>
  );
}
