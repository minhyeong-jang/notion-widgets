import type { WidgetDefinition } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = new Map<string, WidgetDefinition<any>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerWidget(def: WidgetDefinition<any>): void {
  if (registry.has(def.meta.id)) {
    console.warn(`Widget "${def.meta.id}" already registered, overwriting.`);
  }
  registry.set(def.meta.id, def);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getWidget(id: string): WidgetDefinition<any> | undefined {
  return registry.get(id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAllWidgets(): WidgetDefinition<any>[] {
  return Array.from(registry.values());
}
