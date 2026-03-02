"use client";

import { Suspense } from "react";
import "@nw/widgets";
import { getWidget } from "@nw/widget-core";
import { useWidgetParams } from "@/hooks/use-widget-params";
import { LifeProgressWidget } from "@nw/widgets/life-progress/widget";
import { Watermark } from "@/components/shared/watermark";

const widget = getWidget("life-progress")!;

function LifeProgressWithParams() {
  const params = useWidgetParams(widget);
  return <LifeProgressWidget params={params} />;
}

export default function LifeProgressPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-zinc-900" />}>
      <LifeProgressWithParams />
      <Watermark />
    </Suspense>
  );
}
