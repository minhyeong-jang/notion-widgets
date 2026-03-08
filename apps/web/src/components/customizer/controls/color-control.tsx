"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";
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
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isBg = control.key === "bg";

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const pickerValue = value.startsWith("#") ? value : `#${value}`;

  const handlePickerChange = useCallback(
    (newColor: string) => {
      onChange(control.key, newColor.slice(1));
    },
    [control.key, onChange],
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 8);
      onChange(control.key, hex);
    },
    [control.key, onChange],
  );

  const hasAlpha = value.length === 8 && value.slice(6).toLowerCase() !== "ff";

  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-zinc-300 shrink-0">
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <div className="relative flex items-center gap-1.5" ref={popoverRef}>
        {/* Swatch */}
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className="w-7 h-7 rounded-md ring-1 ring-zinc-600 ring-offset-1 ring-offset-zinc-900 cursor-pointer transition-shadow hover:ring-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#3f3f46 0% 25%, #27272a 0% 50%)",
            backgroundSize: "6px 6px",
          }}
        >
          <div
            className="w-full h-full"
            style={{ backgroundColor: pickerValue }}
          />
        </button>

        {/* Hex input */}
        <div className="flex items-center bg-zinc-800/80 rounded-md border border-zinc-700/60 overflow-hidden">
          <span className="pl-2 text-[10px] text-zinc-500 select-none">#</span>
          <input
            type="text"
            value={value}
            onChange={handleTextChange}
            disabled={disabled}
            maxLength={8}
            className="w-[4.5rem] pl-0.5 pr-2 py-1 text-xs font-mono bg-transparent text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
            placeholder={isBg ? "rrggbbaa" : "rrggbb"}
          />
        </div>

        {/* Popover picker */}
        {open && (
          <div className="absolute top-full mt-2 right-0 z-50 rounded-xl bg-zinc-900 border border-zinc-700/60 shadow-2xl shadow-black/40 overflow-hidden color-picker-popover">
            <div className="p-3">
              {isBg ? (
                <HexAlphaColorPicker
                  color={pickerValue}
                  onChange={handlePickerChange}
                />
              ) : (
                <HexColorPicker
                  color={pickerValue}
                  onChange={handlePickerChange}
                />
              )}
            </div>
            {isBg && (
              <div className="px-3 pb-2">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>opacity</span>
                  <span>{value.length === 8 ? Math.round((parseInt(value.slice(6), 16) / 255) * 100) : 100}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Picker CSS overrides */}
      <style jsx global>{`
        .color-picker-popover .react-colorful {
          width: 200px;
          height: 160px;
        }
        .color-picker-popover .react-colorful__saturation {
          border-radius: 8px;
          border-bottom: none;
        }
        .color-picker-popover .react-colorful__hue,
        .color-picker-popover .react-colorful__alpha {
          height: 10px;
          border-radius: 5px;
          margin-top: 10px;
        }
        .color-picker-popover .react-colorful__pointer {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }
        .color-picker-popover .react-colorful__saturation-pointer {
          width: 18px;
          height: 18px;
          border-width: 2px;
        }
      `}</style>
    </div>
  );
}
