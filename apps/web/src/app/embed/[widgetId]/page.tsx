import { getAllWidgets } from "@nw/widget-core";
// Side-effect import: registers all widgets
import "@nw/widgets";

import { WidgetRenderer } from "./widget-renderer";

export function generateStaticParams() {
  return getAllWidgets().map((w) => ({ widgetId: w.meta.id }));
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ widgetId: string }>;
}) {
  const { widgetId } = await params;
  return <WidgetRenderer widgetId={widgetId} />;
}
