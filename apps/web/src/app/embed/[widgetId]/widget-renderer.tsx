"use client";

import { Suspense } from "react";
import "@nw/widgets";
import { getWidget, type WidgetDefinition } from "@nw/widget-core";
import { useWidgetParams } from "@/hooks/use-widget-params";
import { Watermark } from "@/components/shared/watermark";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WidgetWithParams({ widget }: { widget: WidgetDefinition<any> }) {
  const params = useWidgetParams(widget);
  const Component = widget.component;
  return <Component params={params} />;
}

function WidgetSkeleton() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-zinc-900">
      <div className="w-16 h-16 rounded-full bg-zinc-700 animate-pulse" />
    </div>
  );
}

export function WidgetRenderer({ widgetId }: { widgetId: string }) {
  const widget = getWidget(widgetId);

  if (!widget) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-900">
        <p className="text-white">Widget not found: {widgetId}</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<WidgetSkeleton />}>
      <WidgetWithParams widget={widget} />
      <Watermark />
    </Suspense>
  );
}
