"use client";

import { Suspense } from "react";
import "@nw/widgets";
import { getWidget } from "@nw/widget-core";
import { useWidgetParams } from "@/hooks/use-widget-params";
import { FlipClockWidget } from "@nw/widgets/flip-clock/widget";
import { Watermark } from "@/components/shared/watermark";

const widget = getWidget("flip-clock")!;

function FlipClockWithParams() {
  const params = useWidgetParams(widget);
  return <FlipClockWidget params={params} />;
}

export default function TimePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-zinc-900" />}>
      <FlipClockWithParams />
      <Watermark />
    </Suspense>
  );
}
