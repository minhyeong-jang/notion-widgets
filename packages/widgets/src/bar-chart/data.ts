export interface DataPoint {
  label: string;
  value: number;
}

interface Sample {
  title: string;
  data: string;
}

const SAMPLES: Record<string, Sample> = {
  en: { title: "This Week", data: "Mon~4,Tue~7,Wed~5,Thu~8,Fri~6,Sat~3,Sun~5" },
  ko: { title: "이번 주", data: "월~4,화~7,수~5,목~8,금~6,토~3,일~5" },
  ja: { title: "今週", data: "月~4,火~7,水~5,木~8,金~6,土~3,日~5" },
  zh: { title: "本周", data: "一~4,二~7,三~5,四~8,五~6,六~3,日~5" },
  de: { title: "Diese Woche", data: "Mo~4,Di~7,Mi~5,Do~8,Fr~6,Sa~3,So~5" },
  fr: { title: "Cette semaine", data: "Lun~4,Mar~7,Mer~5,Jeu~8,Ven~6,Sam~3,Dim~5" },
  es: { title: "Esta semana", data: "Lun~4,Mar~7,Mié~5,Jue~8,Vie~6,Sáb~3,Dom~5" },
};

export function getSample(locale: string): Sample {
  const lang = locale.slice(0, 2);
  return SAMPLES[lang] ?? SAMPLES.en;
}

/** Parse `label~value,label~value` into data points (max 12). */
export function parseData(raw: string, fallback: string): DataPoint[] {
  const src = raw.trim() ? raw : fallback;
  return src
    .split(",")
    .map((chunk) => {
      const [label, value] = chunk.split("~");
      return {
        label: (label ?? "").trim(),
        value: Number((value ?? "").trim()) || 0,
      };
    })
    .filter((d) => d.label.length > 0 || d.value !== 0)
    .slice(0, 12);
}
