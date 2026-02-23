import type { ComponentType } from "react";

export interface WidgetMeta {
  id: string;
  name: string;
  description: string;
}

export interface WidgetDefinition {
  meta: WidgetMeta;
  component: ComponentType;
}

const registry = new Map<string, WidgetDefinition>();

export function registerWidget(def: WidgetDefinition): void {
  if (registry.has(def.meta.id)) {
    console.warn(`Widget "${def.meta.id}" already registered, overwriting.`);
  }
  registry.set(def.meta.id, def);
}

export function getWidget(id: string): WidgetDefinition | undefined {
  return registry.get(id);
}

export function getAllWidgets(): WidgetDefinition[] {
  return Array.from(registry.values());
}
