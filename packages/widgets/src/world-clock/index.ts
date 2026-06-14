import type { ControlDefinition } from "@nw/widget-core";
import { registerWidget, styleControl, colorThemeControl } from "@nw/widget-core";
import { WorldClockWidget } from "./widget";
import { worldClockSchema, worldClockDefaults } from "./schema";

export { WorldClockWidget } from "./widget";

const controls: ControlDefinition[] = [
  styleControl,
  colorThemeControl,
  {
    key: "variant",
    label: "Variant",
    labelKo: "변형",
    type: "select",
    defaultValue: "minimal",
    options: [
      { value: "minimal", label: "Minimal" },
      { value: "list", label: "List" },
    ],
    group: "appearance",
  },
  {
    key: "timezones",
    label: "Timezones",
    labelKo: "시간대",
    type: "text",
    defaultValue: "America/New_York,Europe/London,Asia/Seoul,Asia/Tokyo",
    options: [
      // Americas
      { value: "America/New_York", label: "New York" },
      { value: "America/Los_Angeles", label: "Los Angeles" },
      { value: "America/Chicago", label: "Chicago" },
      { value: "America/Denver", label: "Denver" },
      { value: "America/Toronto", label: "Toronto" },
      { value: "America/Vancouver", label: "Vancouver" },
      { value: "America/Sao_Paulo", label: "São Paulo" },
      { value: "America/Mexico_City", label: "Mexico City" },
      { value: "America/Buenos_Aires", label: "Buenos Aires" },
      { value: "America/Bogota", label: "Bogotá" },
      { value: "America/Lima", label: "Lima" },
      { value: "America/Santiago", label: "Santiago" },
      { value: "Pacific/Honolulu", label: "Honolulu" },
      { value: "America/Anchorage", label: "Anchorage" },
      // Europe
      { value: "Europe/London", label: "London" },
      { value: "Europe/Paris", label: "Paris" },
      { value: "Europe/Berlin", label: "Berlin" },
      { value: "Europe/Madrid", label: "Madrid" },
      { value: "Europe/Rome", label: "Rome" },
      { value: "Europe/Amsterdam", label: "Amsterdam" },
      { value: "Europe/Zurich", label: "Zurich" },
      { value: "Europe/Stockholm", label: "Stockholm" },
      { value: "Europe/Oslo", label: "Oslo" },
      { value: "Europe/Helsinki", label: "Helsinki" },
      { value: "Europe/Warsaw", label: "Warsaw" },
      { value: "Europe/Prague", label: "Prague" },
      { value: "Europe/Vienna", label: "Vienna" },
      { value: "Europe/Athens", label: "Athens" },
      { value: "Europe/Istanbul", label: "Istanbul" },
      { value: "Europe/Moscow", label: "Moscow" },
      { value: "Europe/Lisbon", label: "Lisbon" },
      // Middle East / Africa
      { value: "Asia/Dubai", label: "Dubai" },
      { value: "Asia/Riyadh", label: "Riyadh" },
      { value: "Asia/Tehran", label: "Tehran" },
      { value: "Africa/Cairo", label: "Cairo" },
      { value: "Africa/Lagos", label: "Lagos" },
      { value: "Africa/Johannesburg", label: "Johannesburg" },
      { value: "Africa/Nairobi", label: "Nairobi" },
      // Asia
      { value: "Asia/Seoul", label: "Seoul" },
      { value: "Asia/Tokyo", label: "Tokyo" },
      { value: "Asia/Shanghai", label: "Shanghai" },
      { value: "Asia/Hong_Kong", label: "Hong Kong" },
      { value: "Asia/Taipei", label: "Taipei" },
      { value: "Asia/Singapore", label: "Singapore" },
      { value: "Asia/Bangkok", label: "Bangkok" },
      { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh" },
      { value: "Asia/Jakarta", label: "Jakarta" },
      { value: "Asia/Kolkata", label: "Mumbai" },
      { value: "Asia/Karachi", label: "Karachi" },
      { value: "Asia/Dhaka", label: "Dhaka" },
      { value: "Asia/Manila", label: "Manila" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur" },
      // Oceania
      { value: "Australia/Sydney", label: "Sydney" },
      { value: "Australia/Melbourne", label: "Melbourne" },
      { value: "Australia/Perth", label: "Perth" },
      { value: "Pacific/Auckland", label: "Auckland" },
      { value: "Pacific/Fiji", label: "Fiji" },
    ],
    group: "content",
  },
  {
    key: "format",
    label: "Time Format",
    labelKo: "시간 형식",
    type: "select",
    defaultValue: "24h",
    options: [
      { value: "12h", label: "12h" },
      { value: "24h", label: "24h" },
    ],
    group: "content",
  },
];

registerWidget({
  meta: {
    id: "world-clock",
    name: "World Clock",
    description: "Display multiple timezone clocks side by side",
  },
  paramsSchema: worldClockSchema,
  defaultParams: worldClockDefaults,
  component: WorldClockWidget,
  controls,
  nameKo: "세계 시계",
  descriptionKo: "여러 시간대의 시계를 나란히 표시합니다",
  category: "time",
  recommendedSize: { width: 400, height: 200 },
});
