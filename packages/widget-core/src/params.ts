import type { WidgetDefinition } from "./types";

export function parseWidgetParams<TParams>(
  widget: WidgetDefinition<TParams>,
  searchParams: URLSearchParams,
): TParams {
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  const result = widget.paramsSchema.safeParse(raw);
  if (result.success) {
    return result.data;
  }

  return widget.defaultParams;
}

export function buildEmbedUrl(
  widgetId: string,
  params: Record<string, unknown>,
  baseUrl = "/embed/",
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    searchParams.set(key, String(value));
  }

  const qs = searchParams.toString();
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return qs ? `${base}${widgetId}?${qs}` : `${base}${widgetId}`;
}
