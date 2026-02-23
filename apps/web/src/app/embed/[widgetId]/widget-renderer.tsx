"use client";

// Side-effect import to register widgets (needed on client too)
import "@nw/widgets";
import { getWidget } from "@nw/widget-core";

export function WidgetRenderer({ widgetId }: { widgetId: string }) {
  const widget = getWidget(widgetId);

  if (!widget) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <p className="text-white">Widget not found: {widgetId}</p>
      </div>
    );
  }

  const WidgetComponent = widget.component;
  return <WidgetComponent />;
}
