import type { WidgetDefinition, ControlDefinition } from "@nw/widget-core";
import type { Locale } from "./config";

export function getWidgetName(
  widget: WidgetDefinition,
  locale: Locale,
): string {
  return locale === "ko"
    ? (widget.nameKo ?? widget.meta.name)
    : widget.meta.name;
}

export function getWidgetDescription(
  widget: WidgetDefinition,
  locale: Locale,
): string {
  return locale === "ko"
    ? (widget.descriptionKo ?? widget.meta.description)
    : widget.meta.description;
}

export function getControlLabel(
  control: ControlDefinition,
  locale: Locale,
): string {
  return locale === "ko" ? control.labelKo : control.label;
}
