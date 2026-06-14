"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { ControlDefinition } from "@nw/widget-core";
import type { Locale } from "@/i18n/config";
import { getControlLabel } from "@/i18n/widget-locale";

interface TextControlProps {
  control: ControlDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
  locale: Locale;
}

export function TextControl(props: TextControlProps) {
  if (props.control.options && props.control.options.length > 0) {
    return <TagBadgeControl {...props} />;
  }
  return <SimpleTextControl {...props} />;
}

/* ── Simple text input ─────────────────────────── */

function SimpleTextControl({
  control, value, onChange, disabled, locale,
}: TextControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const composingRef = useRef(false);

  useEffect(() => {
    if (!composingRef.current) setLocalValue(value);
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-semibold" style={{ color: "var(--text)", marginBottom: 10 }}>
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>
      <input
        type="text"
        value={localValue}
        onCompositionStart={() => { composingRef.current = true; }}
        onCompositionEnd={(e) => { composingRef.current = false; onChange(control.key, e.currentTarget.value); }}
        onChange={(e) => { setLocalValue(e.target.value); if (!composingRef.current) onChange(control.key, e.target.value); }}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        style={{ backgroundColor: "var(--inset)", border: "1px solid var(--border-soft)", color: "var(--text)" }}
        placeholder={String(control.defaultValue)}
      />
    </div>
  );
}

/* ── Timezone helpers ──────────────────────────── */

type TzOption = {
  value: string;
  label: string;
  labelKo: string;
  country: string;
  countryKo: string;
  gmt: string;
  offsetMin: number;
};

/** Country + Korean name mapping for timezone search. Key = IANA region prefix or city. */
const COUNTRY_MAP: Record<string, [string, string]> = {
  // region → [country, countryKo]
  "Africa/Abidjan": ["Côte d'Ivoire", "코트디부아르"],
  "Africa/Accra": ["Ghana", "가나"],
  "Africa/Addis_Ababa": ["Ethiopia", "에티오피아"],
  "Africa/Algiers": ["Algeria", "알제리"],
  "Africa/Cairo": ["Egypt", "이집트"],
  "Africa/Casablanca": ["Morocco", "모로코"],
  "Africa/Dar_es_Salaam": ["Tanzania", "탄자니아"],
  "Africa/Johannesburg": ["South Africa", "남아프리카공화국"],
  "Africa/Kampala": ["Uganda", "우간다"],
  "Africa/Khartoum": ["Sudan", "수단"],
  "Africa/Kinshasa": ["DR Congo", "콩고민주공화국"],
  "Africa/Lagos": ["Nigeria", "나이지리아"],
  "Africa/Nairobi": ["Kenya", "케냐"],
  "Africa/Tripoli": ["Libya", "리비아"],
  "Africa/Tunis": ["Tunisia", "튀니지"],
  "Africa/Windhoek": ["Namibia", "나미비아"],
  "America/Anchorage": ["USA", "미국"],
  "America/Bogota": ["Colombia", "콜롬비아"],
  "America/Buenos_Aires": ["Argentina", "아르헨티나"],
  "America/Caracas": ["Venezuela", "베네수엘라"],
  "America/Chicago": ["USA", "미국"],
  "America/Denver": ["USA", "미국"],
  "America/Edmonton": ["Canada", "캐나다"],
  "America/Guatemala": ["Guatemala", "과테말라"],
  "America/Guayaquil": ["Ecuador", "에콰도르"],
  "America/Halifax": ["Canada", "캐나다"],
  "America/Havana": ["Cuba", "쿠바"],
  "America/Jamaica": ["Jamaica", "자메이카"],
  "America/La_Paz": ["Bolivia", "볼리비아"],
  "America/Lima": ["Peru", "페루"],
  "America/Los_Angeles": ["USA", "미국"],
  "America/Managua": ["Nicaragua", "니카라과"],
  "America/Manaus": ["Brazil", "브라질"],
  "America/Mexico_City": ["Mexico", "멕시코"],
  "America/Montevideo": ["Uruguay", "우루과이"],
  "America/New_York": ["USA", "미국"],
  "America/Panama": ["Panama", "파나마"],
  "America/Asuncion": ["Paraguay", "파라과이"],
  "America/Phoenix": ["USA", "미국"],
  "America/Puerto_Rico": ["Puerto Rico", "푸에르토리코"],
  "America/Santiago": ["Chile", "칠레"],
  "America/Santo_Domingo": ["Dominican Republic", "도미니카공화국"],
  "America/Sao_Paulo": ["Brazil", "브라질"],
  "America/Tegucigalpa": ["Honduras", "온두라스"],
  "America/Toronto": ["Canada", "캐나다"],
  "America/Vancouver": ["Canada", "캐나다"],
  "America/Winnipeg": ["Canada", "캐나다"],
  "Asia/Almaty": ["Kazakhstan", "카자흐스탄"],
  "Asia/Amman": ["Jordan", "요르단"],
  "Asia/Baghdad": ["Iraq", "이라크"],
  "Asia/Bahrain": ["Bahrain", "바레인"],
  "Asia/Baku": ["Azerbaijan", "아제르바이잔"],
  "Asia/Bangkok": ["Thailand", "태국"],
  "Asia/Beirut": ["Lebanon", "레바논"],
  "Asia/Bishkek": ["Kyrgyzstan", "키르기스스탄"],
  "Asia/Brunei": ["Brunei", "브루나이"],
  "Asia/Calcutta": ["India", "인도"],
  "Asia/Colombo": ["Sri Lanka", "스리랑카"],
  "Asia/Damascus": ["Syria", "시리아"],
  "Asia/Dhaka": ["Bangladesh", "방글라데시"],
  "Asia/Dubai": ["UAE", "아랍에미리트"],
  "Asia/Dushanbe": ["Tajikistan", "타지키스탄"],
  "Asia/Gaza": ["Palestine", "팔레스타인"],
  "Asia/Hong_Kong": ["Hong Kong", "홍콩"],
  "Asia/Ho_Chi_Minh": ["Vietnam", "베트남"],
  "Asia/Jakarta": ["Indonesia", "인도네시아"],
  "Asia/Jerusalem": ["Israel", "이스라엘"],
  "Asia/Kabul": ["Afghanistan", "아프가니스탄"],
  "Asia/Karachi": ["Pakistan", "파키스탄"],
  "Asia/Katmandu": ["Nepal", "네팔"],
  "Asia/Kuala_Lumpur": ["Malaysia", "말레이시아"],
  "Asia/Kuwait": ["Kuwait", "쿠웨이트"],
  "Asia/Macau": ["Macau", "마카오"],
  "Asia/Manila": ["Philippines", "필리핀"],
  "Asia/Muscat": ["Oman", "오만"],
  "Asia/Nicosia": ["Cyprus", "키프로스"],
  "Asia/Phnom_Penh": ["Cambodia", "캄보디아"],
  "Asia/Pyongyang": ["North Korea", "북한"],
  "Asia/Qatar": ["Qatar", "카타르"],
  "Asia/Rangoon": ["Myanmar", "미얀마"],
  "Asia/Riyadh": ["Saudi Arabia", "사우디아라비아"],
  "Asia/Saigon": ["Vietnam", "베트남"],
  "Asia/Seoul": ["South Korea", "대한민국"],
  "Asia/Shanghai": ["China", "중국"],
  "Asia/Singapore": ["Singapore", "싱가포르"],
  "Asia/Taipei": ["Taiwan", "대만"],
  "Asia/Tashkent": ["Uzbekistan", "우즈베키스탄"],
  "Asia/Tbilisi": ["Georgia", "조지아"],
  "Asia/Tehran": ["Iran", "이란"],
  "Asia/Thimphu": ["Bhutan", "부탄"],
  "Asia/Tokyo": ["Japan", "일본"],
  "Asia/Ulaanbaatar": ["Mongolia", "몽골"],
  "Asia/Vientiane": ["Laos", "라오스"],
  "Asia/Vladivostok": ["Russia", "러시아"],
  "Asia/Yekaterinburg": ["Russia", "러시아"],
  "Asia/Yerevan": ["Armenia", "아르메니아"],
  "Atlantic/Reykjavik": ["Iceland", "아이슬란드"],
  "Australia/Adelaide": ["Australia", "호주"],
  "Australia/Brisbane": ["Australia", "호주"],
  "Australia/Darwin": ["Australia", "호주"],
  "Australia/Hobart": ["Australia", "호주"],
  "Australia/Melbourne": ["Australia", "호주"],
  "Australia/Perth": ["Australia", "호주"],
  "Australia/Sydney": ["Australia", "호주"],
  "Europe/Amsterdam": ["Netherlands", "네덜란드"],
  "Europe/Athens": ["Greece", "그리스"],
  "Europe/Belgrade": ["Serbia", "세르비아"],
  "Europe/Berlin": ["Germany", "독일"],
  "Europe/Bratislava": ["Slovakia", "슬로바키아"],
  "Europe/Brussels": ["Belgium", "벨기에"],
  "Europe/Bucharest": ["Romania", "루마니아"],
  "Europe/Budapest": ["Hungary", "헝가리"],
  "Europe/Chisinau": ["Moldova", "몰도바"],
  "Europe/Copenhagen": ["Denmark", "덴마크"],
  "Europe/Dublin": ["Ireland", "아일랜드"],
  "Europe/Helsinki": ["Finland", "핀란드"],
  "Europe/Istanbul": ["Turkey", "터키"],
  "Europe/Kiev": ["Ukraine", "우크라이나"],
  "Europe/Lisbon": ["Portugal", "포르투갈"],
  "Europe/Ljubljana": ["Slovenia", "슬로베니아"],
  "Europe/London": ["United Kingdom", "영국"],
  "Europe/Luxembourg": ["Luxembourg", "룩셈부르크"],
  "Europe/Madrid": ["Spain", "스페인"],
  "Europe/Malta": ["Malta", "몰타"],
  "Europe/Minsk": ["Belarus", "벨라루스"],
  "Europe/Monaco": ["Monaco", "모나코"],
  "Europe/Moscow": ["Russia", "러시아"],
  "Europe/Oslo": ["Norway", "노르웨이"],
  "Europe/Paris": ["France", "프랑스"],
  "Europe/Prague": ["Czech Republic", "체코"],
  "Europe/Riga": ["Latvia", "라트비아"],
  "Europe/Rome": ["Italy", "이탈리아"],
  "Europe/Sarajevo": ["Bosnia", "보스니아"],
  "Europe/Skopje": ["North Macedonia", "북마케도니아"],
  "Europe/Sofia": ["Bulgaria", "불가리아"],
  "Europe/Stockholm": ["Sweden", "스웨덴"],
  "Europe/Tallinn": ["Estonia", "에스토니아"],
  "Europe/Tirane": ["Albania", "알바니아"],
  "Europe/Vienna": ["Austria", "오스트리아"],
  "Europe/Vilnius": ["Lithuania", "리투아니아"],
  "Europe/Warsaw": ["Poland", "폴란드"],
  "Europe/Zagreb": ["Croatia", "크로아티아"],
  "Europe/Zurich": ["Switzerland", "스위스"],
  "Indian/Maldives": ["Maldives", "몰디브"],
  "Indian/Mauritius": ["Mauritius", "모리셔스"],
  "Pacific/Auckland": ["New Zealand", "뉴질랜드"],
  "Pacific/Fiji": ["Fiji", "피지"],
  "Pacific/Guam": ["Guam", "괌"],
  "Pacific/Honolulu": ["USA", "미국"],
  "Pacific/Pago_Pago": ["American Samoa", "미국령 사모아"],
  "Pacific/Port_Moresby": ["Papua New Guinea", "파푸아뉴기니"],
  "Pacific/Tongatapu": ["Tonga", "통가"],
};

/** Korean city name mapping for major cities */
const CITY_KO: Record<string, string> = {
  "Abidjan": "아비장", "Accra": "아크라", "Addis Ababa": "아디스아바바",
  "Algiers": "알제", "Amman": "암만", "Amsterdam": "암스테르담",
  "Anchorage": "앵커리지", "Ankara": "앙카라", "Asuncion": "아순시온",
  "Athens": "아테네", "Auckland": "오클랜드", "Baghdad": "바그다드",
  "Bahrain": "바레인", "Baku": "바쿠", "Bangkok": "방콕",
  "Beijing": "베이징", "Beirut": "베이루트", "Belgrade": "베오그라드",
  "Berlin": "베를린", "Bishkek": "비슈케크", "Bogota": "보고타",
  "Bratislava": "브라티슬라바", "Brisbane": "브리즈번",
  "Brussels": "브뤼셀", "Bucharest": "부쿠레슈티",
  "Budapest": "부다페스트", "Buenos Aires": "부에노스아이레스",
  "Cairo": "카이로", "Calcutta": "콜카타", "Caracas": "카라카스",
  "Casablanca": "카사블랑카", "Chicago": "시카고", "Chisinau": "키시너우",
  "Colombo": "콜롬보", "Copenhagen": "코펜하겐", "Damascus": "다마스쿠스",
  "Dar es Salaam": "다르에스살람", "Darwin": "다윈", "Denver": "덴버",
  "Dhaka": "다카", "Doha": "도하", "Dubai": "두바이", "Dublin": "더블린",
  "Edmonton": "에드먼턴", "Fiji": "피지", "Gaza": "가자",
  "Guatemala": "과테말라", "Guayaquil": "과야킬", "Guam": "괌",
  "Halifax": "핼리팩스", "Havana": "아바나", "Helsinki": "헬싱키",
  "Ho Chi Minh": "호찌민", "Hobart": "호바트", "Hong Kong": "홍콩",
  "Honolulu": "호놀룰루", "Istanbul": "이스탄불",
  "Jakarta": "자카르타", "Jamaica": "자메이카", "Jerusalem": "예루살렘",
  "Johannesburg": "요하네스버그", "Kabul": "카불", "Kampala": "캄팔라",
  "Karachi": "카라치", "Katmandu": "카트만두", "Khartoum": "하르툼",
  "Kiev": "키이우", "Kinshasa": "킨샤사", "Kuala Lumpur": "쿠알라룸푸르",
  "Kuwait": "쿠웨이트", "La Paz": "라파스", "Lagos": "라고스",
  "Lima": "리마", "Lisbon": "리스본", "Ljubljana": "류블랴나",
  "London": "런던", "Los Angeles": "로스앤젤레스", "Luxembourg": "룩셈부르크",
  "Macau": "마카오", "Madrid": "마드리드", "Malta": "몰타",
  "Managua": "마나과", "Manaus": "마나우스", "Manila": "마닐라",
  "Melbourne": "멜버른", "Mexico City": "멕시코시티", "Minsk": "민스크",
  "Monaco": "모나코", "Montevideo": "몬테비데오", "Moscow": "모스크바",
  "Mumbai": "뭄바이", "Muscat": "무스카트", "Nairobi": "나이로비",
  "New York": "뉴욕", "Nicosia": "니코시아", "Oslo": "오슬로",
  "Panama": "파나마", "Paris": "파리", "Perth": "퍼스",
  "Phnom Penh": "프놈펜", "Phoenix": "피닉스", "Prague": "프라하",
  "Pyongyang": "평양", "Qatar": "카타르", "Rangoon": "양곤",
  "Reykjavik": "레이캬비크", "Riga": "리가", "Riyadh": "리야드",
  "Rome": "로마", "Santiago": "산티아고",
  "Santo Domingo": "산토도밍고", "Sao Paulo": "상파울루",
  "Sarajevo": "사라예보", "Seoul": "서울", "Shanghai": "상하이",
  "Singapore": "싱가포르", "Skopje": "스코페", "Sofia": "소피아",
  "Stockholm": "스톡홀름", "Sydney": "시드니", "Taipei": "타이베이",
  "Tallinn": "탈린", "Tashkent": "타슈켄트", "Tbilisi": "트빌리시",
  "Tegucigalpa": "테구시갈파", "Tehran": "테헤란", "Thimphu": "팀부",
  "Tirane": "티라나", "Tokyo": "도쿄", "Toronto": "토론토",
  "Tripoli": "트리폴리", "Tunis": "튀니스", "Ulaanbaatar": "울란바토르",
  "Vancouver": "밴쿠버", "Vienna": "비엔나", "Vientiane": "비엔티안",
  "Vilnius": "빌뉴스", "Vladivostok": "블라디보스토크",
  "Warsaw": "바르샤바", "Windhoek": "빈트후크", "Winnipeg": "위니펙",
  "Yekaterinburg": "예카테린부르크", "Yerevan": "예레반",
  "Zagreb": "자그레브", "Zurich": "취리히",
  "Adelaide": "애들레이드", "Almaty": "알마티",
};

function getGmtOffset(tz: string): { gmt: string; offsetMin: number } {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, timeZoneName: "shortOffset",
    }).formatToParts(now);
    const offsetPart = parts.find(p => p.type === "timeZoneName")?.value ?? "";
    const offsetMin = (() => {
      const m = offsetPart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (!m) return 0;
      const sign = m[1] === "+" ? 1 : -1;
      return sign * (parseInt(m[2]!) * 60 + parseInt(m[3] || "0"));
    })();
    return { gmt: offsetPart || "GMT+0", offsetMin };
  } catch {
    return { gmt: "GMT", offsetMin: 0 };
  }
}

function getCityDisplay(tz: string): string {
  return (tz.split("/").pop() ?? tz).replace(/_/g, " ");
}

function buildAllTimezones(predefined: ControlDefinition["options"]): TzOption[] {
  let allZones: string[];
  try {
    allZones = (Intl as unknown as { supportedValuesOf(k: string): string[] }).supportedValuesOf("timeZone");
  } catch {
    return (predefined ?? []).map(o => {
      const { gmt, offsetMin } = getGmtOffset(o.value);
      const city = getCityDisplay(o.value);
      const cm = COUNTRY_MAP[o.value];
      return { ...o, labelKo: o.labelKo ?? CITY_KO[city] ?? city, country: cm?.[0] ?? "", countryKo: cm?.[1] ?? "", gmt, offsetMin };
    });
  }

  const predefinedMap = new Map((predefined ?? []).map(o => [o.value, o]));
  const result: TzOption[] = [];

  for (const tz of allZones) {
    if (!tz.includes("/")) continue;
    const { gmt, offsetMin } = getGmtOffset(tz);
    const pre = predefinedMap.get(tz);
    const city = pre?.label ?? getCityDisplay(tz);
    const cm = COUNTRY_MAP[tz];
    result.push({
      value: tz,
      label: city,
      labelKo: pre?.labelKo ?? CITY_KO[city] ?? CITY_KO[getCityDisplay(tz)] ?? "",
      country: cm?.[0] ?? "",
      countryKo: cm?.[1] ?? "",
      gmt,
      offsetMin,
    });
  }

  result.sort((a, b) => a.offsetMin - b.offsetMin);
  return result;
}

/* ── Tag badge + search select ─────────────────── */

function TagBadgeControl({
  control, value, onChange, disabled, locale,
}: TextControlProps) {
  const isKo = locale === "ko";
  const selected = value ? value.split(",").filter(Boolean) : [];
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allTimezones = useMemo(() => buildAllTimezones(control.options), [control.options]);
  const useSearchMode = allTimezones.length > 15 || (control.options ?? []).length > 15;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const removeTag = (tag: string) => onChange(control.key, selected.filter(s => s !== tag).join(","));
  const addTag = (tag: string) => { onChange(control.key, [...selected, tag].join(",")); setSearch(""); setIsOpen(false); };

  const displayLabel = (val: string): string => {
    const tz = allTimezones.find(o => o.value === val);
    if (!tz) return getCityDisplay(val);
    if (isKo && tz.labelKo) return tz.labelKo;
    return tz.label;
  };

  const displayGmt = (val: string): string => allTimezones.find(o => o.value === val)?.gmt ?? "";

  const available = allTimezones.filter(o => !selected.includes(o.value));

  const filtered = search
    ? available.filter(o => {
        const q = search.toLowerCase();
        return (
          o.label.toLowerCase().includes(q) ||
          o.labelKo.includes(q) ||
          o.country.toLowerCase().includes(q) ||
          o.countryKo.includes(q) ||
          o.value.toLowerCase().includes(q) ||
          o.gmt.toLowerCase().includes(q)
        );
      })
    : available;

  return (
    <div ref={containerRef}>
      <label className="block text-sm font-semibold" style={{ color: "var(--text)", marginBottom: 10 }}>
        {getControlLabel(control, locale)}
        {control.isPremium && <span className="ml-1 text-xs">&#128274;</span>}
      </label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 10 }}>
        {selected.map(tag => (
          <button
            key={tag} type="button"
            onClick={() => !disabled && removeTag(tag)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: 12, padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--text)", cursor: disabled ? "not-allowed" : "pointer" }}
          >
            {displayLabel(tag)}
            <span className="font-mono" style={{ fontSize: 10, color: "var(--text-faint)", marginLeft: 4 }}>{displayGmt(tag)}</span>
            <span style={{ fontSize: 14, color: "var(--text-faint)", marginLeft: 2 }}>&times;</span>
          </button>
        ))}
      </div>

      {/* Search or flat badges */}
      {useSearchMode ? (
        <div className="relative">
          <input
            type="text" value={search}
            onChange={e => { setSearch(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            className="w-full px-3 py-2.5 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
            style={{ backgroundColor: "var(--inset)", border: "1px solid var(--border-soft)", color: "var(--text)" }}
            placeholder={isKo ? "도시 또는 나라 검색 (예: 오스트리아, Vienna, GMT+1)" : "Search city or country (e.g. Austria, Vienna, GMT+1)"}
          />
          {isOpen && filtered.length > 0 && (
            <div
              className="absolute z-50 w-full mt-1 overflow-y-auto"
              style={{ maxHeight: 240, borderRadius: 12, border: "1px solid var(--border)", backgroundColor: "var(--surface)", boxShadow: "0 8px 24px -8px var(--shadow)" }}
            >
              {filtered.slice(0, 30).map(opt => (
                <button
                  key={opt.value} type="button"
                  onClick={() => addTag(opt.value)}
                  className="w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors duration-100 cursor-pointer"
                  style={{ color: "var(--text)", borderBottom: "1px solid var(--border-soft)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--inset)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <span>
                    <span>{isKo && opt.labelKo ? opt.labelKo : opt.label}</span>
                    {isKo && opt.labelKo && <span style={{ color: "var(--text-faint)", marginLeft: 6, fontSize: 11 }}>{opt.label}</span>}
                    {opt.country && (
                      <span style={{ color: "var(--text-faint)", marginLeft: 6, fontSize: 11 }}>
                        {isKo && opt.countryKo ? opt.countryKo : opt.country}
                      </span>
                    )}
                  </span>
                  <span className="font-mono shrink-0" style={{ fontSize: 11, color: "var(--text-faint)" }}>{opt.gmt}</span>
                </button>
              ))}
              {filtered.length > 30 && (
                <div className="px-3 py-2 text-xs" style={{ color: "var(--text-faint)" }}>
                  {isKo ? `외 ${filtered.length - 30}개 — 검색어를 입력하세요` : `${filtered.length - 30} more — type to search`}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        available.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {available.map(opt => (
              <button
                key={opt.value} type="button"
                onClick={() => !disabled && addTag(opt.value)}
                disabled={disabled}
                className="inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontSize: 12, padding: "7px 12px", borderRadius: 8, border: "1px dashed var(--border-soft)", backgroundColor: "transparent", color: "var(--text-faint)", cursor: disabled ? "not-allowed" : "pointer" }}
              >
                <span style={{ fontSize: 13 }}>+</span>{" "}
                {isKo && opt.labelKo ? opt.labelKo : opt.label}
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}
