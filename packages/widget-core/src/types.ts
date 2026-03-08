import type { ComponentType } from "react";
import type { ZodType } from "zod";

export interface ControlDefinition {
  key: string;
  label: string;
  labelKo: string;
  type: "color" | "select" | "toggle" | "slider" | "date" | "text";
  defaultValue: unknown;
  options?: Array<{ value: string; label: string }>;
  isPremium?: boolean;
  group?: "appearance" | "color" | "content" | "advanced";
}

export interface WidgetMeta {
  id: string;
  name: string;
  description: string;
}

export interface WidgetDefinition<TParams = Record<string, unknown>> {
  meta: WidgetMeta;
  paramsSchema: ZodType<TParams>;
  defaultParams: TParams;
  component: ComponentType<{ params: TParams }>;
  controls?: ControlDefinition[];
  nameKo?: string;
  descriptionKo?: string;
  thumbnail?: string;
  category?: "time" | "productivity" | "lifestyle" | "utility";
  recommendedSize?: { width: number; height: number };
  isPremium?: boolean;
}
