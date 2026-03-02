"use client";

import { useSearchParams } from "next/navigation";
import { parseWidgetParams, type WidgetDefinition } from "@nw/widget-core";

export function useWidgetParams<TParams>(widget: WidgetDefinition<TParams>): TParams {
  const searchParams = useSearchParams();
  return parseWidgetParams(widget, searchParams);
}
