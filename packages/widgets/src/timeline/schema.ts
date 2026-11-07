import { z } from "zod";

const booleanStr = z.enum(["true", "false"]).transform((v) => v === "true");

export const timelineSchema = z.object({
  style: z.string().default("minimal"),
  accent: z.string().default("green"),
  locale: z.string().default("en-US"),
  variant: z.enum(["vertical", "horizontal", "compact"]).default("vertical"),
  title: z.string().default("Roadmap"),
  // Events are separated by "|". Each event is "label::date::status".
  // status ∈ done | active | upcoming (optional, defaults to "upcoming").
  items: z
    .string()
    .default(
      "Research::Q1::done|Design::Q2::done|Build::Q3::active|Launch::Q4::upcoming",
    ),
  showDate: booleanStr.default("true"),
});

export type TimelineParams = z.infer<typeof timelineSchema>;

export const timelineDefaults: TimelineParams = timelineSchema.parse({});

export type EventStatus = "done" | "active" | "upcoming";

export interface TimelineEvent {
  label: string;
  date: string;
  status: EventStatus;
}

/** Split the "|"-separated items param into structured events. */
export function parseEvents(items: string): TimelineEvent[] {
  return items
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const parts = entry.split("::").map((p) => p.trim());
      const label = parts[0] ?? "";
      const date = parts[1] ?? "";
      const raw = parts[2] ?? "";
      const status: EventStatus =
        raw === "done" || raw === "active" || raw === "upcoming"
          ? raw
          : "upcoming";
      return { label, date, status };
    })
    .filter((e) => e.label)
    .slice(0, 8);
}
