import type { ControlDefinition } from "./types";

/**
 * Shared locale options for widgets.
 * Value follows BCP 47 format (e.g. "en-US", "ko-KR").
 */
export const LOCALE_OPTIONS = [
  { value: "en-US", label: "English" },
  { value: "ko-KR", label: "한국어" },
  { value: "ja-JP", label: "日本語" },
  { value: "zh-CN", label: "中文" },
  { value: "de-DE", label: "Deutsch" },
  { value: "fr-FR", label: "Français" },
  { value: "es-ES", label: "Español" },
] as const;

/**
 * Shared date format options (Notion-style).
 * Used as Intl.DateTimeFormat options key.
 */
export const DATE_FORMAT_OPTIONS = [
  { value: "full", label: "March 3, 2026" },
  { value: "long", label: "Mar 3, 2026" },
  { value: "short", label: "3/3/2026" },
  { value: "iso", label: "2026-03-03" },
  { value: "relative", label: "D-123" },
] as const;

/**
 * Reusable style ControlDefinition for widget registration.
 * Style = visual design language (font, effects, layout).
 */
export const styleControl: ControlDefinition = {
  key: "style",
  label: "Style",
  labelKo: "스타일",
  type: "select",
  defaultValue: "minimal",
  options: [
    { value: "minimal", label: "Minimal", labelKo: "미니멀" },
    { value: "soft", label: "Soft", labelKo: "소프트" },
    { value: "neon", label: "Neon", labelKo: "네온" },
    { value: "glass", label: "Glass", labelKo: "글래스" },
  ],
  group: "appearance",
};

/** @deprecated Use styleControl instead */
export const themeControl = styleControl;

/**
 * Reusable accent color ControlDefinition for widget registration.
 * Accent = color identity (green, red, blue, etc.).
 */
export const accentControl: ControlDefinition = {
  key: "accent",
  label: "Color",
  labelKo: "색상",
  type: "select",
  defaultValue: "green",
  options: [
    { value: "green", label: "Green" },
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "ocean", label: "Ocean" },
    { value: "sunset", label: "Sunset" },
    { value: "purple", label: "Purple" },
  ],
  group: "appearance",
};

/** @deprecated Use accentControl instead */
export const colorThemeControl = accentControl;

/**
 * Reusable locale ControlDefinition for widget registration.
 */
export const localeControl: ControlDefinition = {
  key: "locale",
  label: "Language",
  labelKo: "언어",
  type: "select",
  defaultValue: "en-US",
  options: [...LOCALE_OPTIONS],
  group: "content",
};

/**
 * Reusable date format ControlDefinition for widget registration.
 */
export const dateFormatControl: ControlDefinition = {
  key: "dateFormat",
  label: "Date Format",
  labelKo: "날짜 형식",
  type: "select",
  defaultValue: "full",
  options: [...DATE_FORMAT_OPTIONS],
  group: "content",
};

/**
 * Format a date according to the chosen format and locale.
 */
export function formatDate(
  date: Date,
  format: string,
  locale: string,
  referenceDate?: Date,
): string {
  switch (format) {
    case "full":
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "long":
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    case "short":
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    case "iso":
      return date.toISOString().slice(0, 10);
    case "relative": {
      const ref = referenceDate ?? new Date();
      const diff = Math.ceil(
        (date.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diff > 0) return `D-${diff}`;
      if (diff === 0) return "D-Day";
      return `D+${Math.abs(diff)}`;
    }
    default:
      return date.toLocaleDateString(locale);
  }
}

/**
 * Get progress bar labels for the given locale.
 */
export function getProgressLabels(locale: string) {
  const lang = locale.slice(0, 2);
  switch (lang) {
    case "ko":
      return { year: "연도", month: "월", quarter: "분기", week: "주", day: "일", targetDate: "목표 날짜" };
    case "ja":
      return { year: "年", month: "月", quarter: "四半期", week: "週", day: "日", targetDate: "目標日" };
    case "zh":
      return { year: "年", month: "月", quarter: "季度", week: "周", day: "日", targetDate: "目标日期" };
    case "de":
      return { year: "Jahr", month: "Monat", quarter: "Quartal", week: "Woche", day: "Tag", targetDate: "Zieldatum" };
    case "fr":
      return { year: "Année", month: "Mois", quarter: "Trimestre", week: "Semaine", day: "Jour", targetDate: "Date cible" };
    case "es":
      return { year: "Año", month: "Mes", quarter: "Trimestre", week: "Semana", day: "Día", targetDate: "Fecha objetivo" };
    default:
      return { year: "Year", month: "Month", quarter: "Quarter", week: "Week", day: "Day", targetDate: "Target Date" };
  }
}
