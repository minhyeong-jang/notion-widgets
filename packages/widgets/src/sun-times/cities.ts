export interface City {
  id: string;
  name: string;
  nameKo: string;
  lat: number;
  lng: number;
  /** IANA timezone id — used only to format the display times in local time */
  tz: string;
}

export const CITIES: City[] = [
  { id: "seoul", name: "Seoul", nameKo: "서울", lat: 37.5665, lng: 126.978, tz: "Asia/Seoul" },
  { id: "tokyo", name: "Tokyo", nameKo: "도쿄", lat: 35.6762, lng: 139.6503, tz: "Asia/Tokyo" },
  { id: "singapore", name: "Singapore", nameKo: "싱가포르", lat: 1.3521, lng: 103.8198, tz: "Asia/Singapore" },
  { id: "mumbai", name: "Mumbai", nameKo: "뭄바이", lat: 19.076, lng: 72.8777, tz: "Asia/Kolkata" },
  { id: "dubai", name: "Dubai", nameKo: "두바이", lat: 25.2048, lng: 55.2708, tz: "Asia/Dubai" },
  { id: "london", name: "London", nameKo: "런던", lat: 51.5074, lng: -0.1278, tz: "Europe/London" },
  { id: "paris", name: "Paris", nameKo: "파리", lat: 48.8566, lng: 2.3522, tz: "Europe/Paris" },
  { id: "berlin", name: "Berlin", nameKo: "베를린", lat: 52.52, lng: 13.405, tz: "Europe/Berlin" },
  { id: "newyork", name: "New York", nameKo: "뉴욕", lat: 40.7128, lng: -74.006, tz: "America/New_York" },
  { id: "losangeles", name: "Los Angeles", nameKo: "로스앤젤레스", lat: 34.0522, lng: -118.2437, tz: "America/Los_Angeles" },
  { id: "saopaulo", name: "São Paulo", nameKo: "상파울루", lat: -23.5505, lng: -46.6333, tz: "America/Sao_Paulo" },
  { id: "sydney", name: "Sydney", nameKo: "시드니", lat: -33.8688, lng: 151.2093, tz: "Australia/Sydney" },
];

const cityMap = new Map(CITIES.map((c) => [c.id, c]));

export function getCity(id: string): City {
  return cityMap.get(id) ?? CITIES[0];
}
