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
      { value: "minimal", label: "Minimal", labelKo: "미니멀" },
      { value: "list", label: "List", labelKo: "목록" },
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
      { value: "America/New_York", label: "New York", labelKo: "뉴욕" },
      { value: "America/Los_Angeles", label: "Los Angeles", labelKo: "로스앤젤레스" },
      { value: "America/Chicago", label: "Chicago", labelKo: "시카고" },
      { value: "America/Denver", label: "Denver", labelKo: "덴버" },
      { value: "America/Toronto", label: "Toronto", labelKo: "토론토" },
      { value: "America/Vancouver", label: "Vancouver", labelKo: "밴쿠버" },
      { value: "America/Sao_Paulo", label: "São Paulo", labelKo: "상파울루" },
      { value: "America/Mexico_City", label: "Mexico City", labelKo: "멕시코시티" },
      { value: "America/Buenos_Aires", label: "Buenos Aires", labelKo: "부에노스아이레스" },
      { value: "America/Bogota", label: "Bogotá", labelKo: "보고타" },
      { value: "America/Lima", label: "Lima", labelKo: "리마" },
      { value: "America/Santiago", label: "Santiago", labelKo: "산티아고" },
      { value: "Pacific/Honolulu", label: "Honolulu", labelKo: "호놀룰루" },
      { value: "America/Anchorage", label: "Anchorage", labelKo: "앵커리지" },
      // Europe
      { value: "Europe/London", label: "London", labelKo: "런던" },
      { value: "Europe/Paris", label: "Paris", labelKo: "파리" },
      { value: "Europe/Berlin", label: "Berlin", labelKo: "베를린" },
      { value: "Europe/Madrid", label: "Madrid", labelKo: "마드리드" },
      { value: "Europe/Rome", label: "Rome", labelKo: "로마" },
      { value: "Europe/Amsterdam", label: "Amsterdam", labelKo: "암스테르담" },
      { value: "Europe/Zurich", label: "Zurich", labelKo: "취리히" },
      { value: "Europe/Stockholm", label: "Stockholm", labelKo: "스톡홀름" },
      { value: "Europe/Oslo", label: "Oslo", labelKo: "오슬로" },
      { value: "Europe/Helsinki", label: "Helsinki", labelKo: "헬싱키" },
      { value: "Europe/Warsaw", label: "Warsaw", labelKo: "바르샤바" },
      { value: "Europe/Prague", label: "Prague", labelKo: "프라하" },
      { value: "Europe/Vienna", label: "Vienna", labelKo: "비엔나" },
      { value: "Europe/Athens", label: "Athens", labelKo: "아테네" },
      { value: "Europe/Istanbul", label: "Istanbul", labelKo: "이스탄불" },
      { value: "Europe/Moscow", label: "Moscow", labelKo: "모스크바" },
      { value: "Europe/Lisbon", label: "Lisbon", labelKo: "리스본" },
      // Middle East / Africa
      { value: "Asia/Dubai", label: "Dubai", labelKo: "두바이" },
      { value: "Asia/Riyadh", label: "Riyadh", labelKo: "리야드" },
      { value: "Asia/Tehran", label: "Tehran", labelKo: "테헤란" },
      { value: "Africa/Cairo", label: "Cairo", labelKo: "카이로" },
      { value: "Africa/Lagos", label: "Lagos", labelKo: "라고스" },
      { value: "Africa/Johannesburg", label: "Johannesburg", labelKo: "요하네스버그" },
      { value: "Africa/Nairobi", label: "Nairobi", labelKo: "나이로비" },
      // Asia
      { value: "Asia/Seoul", label: "Seoul", labelKo: "서울" },
      { value: "Asia/Tokyo", label: "Tokyo", labelKo: "도쿄" },
      { value: "Asia/Shanghai", label: "Shanghai", labelKo: "상하이" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", labelKo: "홍콩" },
      { value: "Asia/Taipei", label: "Taipei", labelKo: "타이베이" },
      { value: "Asia/Singapore", label: "Singapore", labelKo: "싱가포르" },
      { value: "Asia/Bangkok", label: "Bangkok", labelKo: "방콕" },
      { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh", labelKo: "호찌민" },
      { value: "Asia/Jakarta", label: "Jakarta", labelKo: "자카르타" },
      { value: "Asia/Kolkata", label: "Mumbai", labelKo: "뭄바이" },
      { value: "Asia/Karachi", label: "Karachi", labelKo: "카라치" },
      { value: "Asia/Dhaka", label: "Dhaka", labelKo: "다카" },
      { value: "Asia/Manila", label: "Manila", labelKo: "마닐라" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", labelKo: "쿠알라룸푸르" },
      // Oceania
      { value: "Australia/Sydney", label: "Sydney", labelKo: "시드니" },
      { value: "Australia/Melbourne", label: "Melbourne", labelKo: "멜버른" },
      { value: "Australia/Perth", label: "Perth", labelKo: "퍼스" },
      { value: "Pacific/Auckland", label: "Auckland", labelKo: "오클랜드" },
      { value: "Pacific/Fiji", label: "Fiji", labelKo: "피지" },
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
      { value: "12h", label: "12h", labelKo: "12시간" },
      { value: "24h", label: "24h", labelKo: "24시간" },
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
