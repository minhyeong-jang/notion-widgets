export interface WeatherInfo {
  emoji: string;
  label: string;
  labelKo: string;
}

/**
 * WMO Weather interpretation codes (WW).
 * https://open-meteo.com/en/docs
 */
export const weatherCodes: Record<number, WeatherInfo> = {
  0: { emoji: "\u2600\uFE0F", label: "Clear sky", labelKo: "\uB9D1\uC74C" },
  1: { emoji: "\uD83C\uDF24\uFE0F", label: "Mainly clear", labelKo: "\uB300\uCCB4\uB85C \uB9D1\uC74C" },
  2: { emoji: "\u26C5", label: "Partly cloudy", labelKo: "\uAD6C\uB984 \uC870\uAE08" },
  3: { emoji: "\u2601\uFE0F", label: "Overcast", labelKo: "\uD750\uB9BC" },
  45: { emoji: "\uD83C\uDF2B\uFE0F", label: "Fog", labelKo: "\uC548\uAC1C" },
  48: { emoji: "\uD83C\uDF2B\uFE0F", label: "Rime fog", labelKo: "\uC11C\uB9AC \uC548\uAC1C" },
  51: { emoji: "\uD83C\uDF26\uFE0F", label: "Light drizzle", labelKo: "\uAC00\uBCBC\uC6B4 \uC774\uC2AC\uBE44" },
  53: { emoji: "\uD83C\uDF26\uFE0F", label: "Moderate drizzle", labelKo: "\uC774\uC2AC\uBE44" },
  55: { emoji: "\uD83C\uDF26\uFE0F", label: "Dense drizzle", labelKo: "\uC9C4\uC740 \uC774\uC2AC\uBE44" },
  56: { emoji: "\uD83C\uDF27\uFE0F", label: "Light freezing drizzle", labelKo: "\uAC00\uBCBC\uC6B4 \uC5BC\uC5B4\uBD99\uB294 \uBE44" },
  57: { emoji: "\uD83C\uDF27\uFE0F", label: "Dense freezing drizzle", labelKo: "\uC5BC\uC5B4\uBD99\uB294 \uBE44" },
  61: { emoji: "\uD83C\uDF27\uFE0F", label: "Slight rain", labelKo: "\uC57D\uD55C \uBE44" },
  63: { emoji: "\uD83C\uDF27\uFE0F", label: "Moderate rain", labelKo: "\uBE44" },
  65: { emoji: "\uD83C\uDF27\uFE0F", label: "Heavy rain", labelKo: "\uD3ED\uC6B0" },
  66: { emoji: "\uD83C\uDF28\uFE0F", label: "Light freezing rain", labelKo: "\uAC00\uBCBC\uC6B4 \uC5BC\uC5B4\uBD99\uB294 \uBE44" },
  67: { emoji: "\uD83C\uDF28\uFE0F", label: "Heavy freezing rain", labelKo: "\uC5BC\uC5B4\uBD99\uB294 \uD3ED\uC6B0" },
  71: { emoji: "\uD83C\uDF28\uFE0F", label: "Slight snow", labelKo: "\uC57D\uD55C \uB208" },
  73: { emoji: "\uD83C\uDF28\uFE0F", label: "Moderate snow", labelKo: "\uB208" },
  75: { emoji: "\uD83C\uDF28\uFE0F", label: "Heavy snow", labelKo: "\uD3ED\uC124" },
  77: { emoji: "\u2744\uFE0F", label: "Snow grains", labelKo: "\uC2F8\uB77D\uB208" },
  80: { emoji: "\uD83C\uDF26\uFE0F", label: "Slight showers", labelKo: "\uAC00\uBCBC\uC6B4 \uC18C\uB098\uAE30" },
  81: { emoji: "\uD83C\uDF27\uFE0F", label: "Moderate showers", labelKo: "\uC18C\uB098\uAE30" },
  82: { emoji: "\u26C8\uFE0F", label: "Violent showers", labelKo: "\uAC15\uD55C \uC18C\uB098\uAE30" },
  85: { emoji: "\uD83C\uDF28\uFE0F", label: "Slight snow showers", labelKo: "\uAC00\uBCBC\uC6B4 \uB208\uBC1C" },
  86: { emoji: "\uD83C\uDF28\uFE0F", label: "Heavy snow showers", labelKo: "\uAC15\uD55C \uB208\uBC1C" },
  95: { emoji: "\u26C8\uFE0F", label: "Thunderstorm", labelKo: "\uB1CC\uC6B0" },
  96: { emoji: "\u26C8\uFE0F", label: "Thunderstorm with slight hail", labelKo: "\uB1CC\uC6B0\uC640 \uC57D\uD55C \uC6B0\uBC15" },
  99: { emoji: "\u26C8\uFE0F", label: "Thunderstorm with heavy hail", labelKo: "\uB1CC\uC6B0\uC640 \uAC15\uD55C \uC6B0\uBC15" },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return weatherCodes[code] ?? { emoji: "\u2753", label: "Unknown", labelKo: "\uC54C \uC218 \uC5C6\uC74C" };
}
