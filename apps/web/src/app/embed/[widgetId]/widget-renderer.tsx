"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "@nw/widgets";
import { getWidget, type WidgetDefinition } from "@nw/widget-core";
import { useWidgetParams } from "@/hooks/use-widget-params";
import { useColorMode } from "@/hooks/use-color-mode";
import { ColorModeContext } from "@nw/widgets/color-mode-context";
import { Watermark } from "@/components/shared/watermark";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WidgetWithParams({ widget }: { widget: WidgetDefinition<any> }) {
  const params = useWidgetParams(widget);
  const Component = widget.component;
  return <Component params={params} />;
}

function WidgetSkeleton() {
  return (
    <div className="min-h-dvh" />
  );
}

function WidgetRendererInner({ widgetId }: { widgetId: string }) {
  const widget = getWidget(widgetId);
  const searchParams = useSearchParams();
  const modeParam = (searchParams.get("colorMode") || searchParams.get("mode")) as "dark" | "light" | null;
  const systemMode = useColorMode();
  const colorMode = modeParam || systemMode;

  if (!widget) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p style={{ color: colorMode === "dark" ? "#aaa" : "#555" }}>Widget not found: {widgetId}</p>
      </div>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <Suspense fallback={<WidgetSkeleton />}>
        <WidgetWithParams widget={widget} />
        <Watermark />
      </Suspense>
    </ColorModeContext.Provider>
  );
}

export function WidgetRenderer({ widgetId }: { widgetId: string }) {
  return (
    <Suspense fallback={<WidgetSkeleton />}>
      <WidgetRendererInner widgetId={widgetId} />
    </Suspense>
  );
}
