export interface RoadmapSample {
  title: string;
  steps: string[];
}

const SAMPLES: Record<string, RoadmapSample> = {
  en: { title: "Roadmap", steps: ["Plan", "Design", "Build", "Launch"] },
  ko: { title: "로드맵", steps: ["기획", "디자인", "개발", "출시"] },
  ja: { title: "ロードマップ", steps: ["計画", "設計", "開発", "公開"] },
  zh: { title: "路线图", steps: ["规划", "设计", "开发", "发布"] },
  de: { title: "Roadmap", steps: ["Planen", "Design", "Bauen", "Launch"] },
  fr: { title: "Feuille de route", steps: ["Plan", "Design", "Build", "Lancement"] },
  es: { title: "Hoja de ruta", steps: ["Plan", "Diseño", "Desarrollo", "Lanzamiento"] },
};

export function getSample(locale: string): RoadmapSample {
  const lang = (locale || "en").slice(0, 2);
  return SAMPLES[lang] ?? SAMPLES.en;
}

/** Labels for the step counter (e.g. "Step 2 / 4"), localized. */
export function getStepWord(locale: string): string {
  const lang = (locale || "en").slice(0, 2);
  switch (lang) {
    case "ko":
      return "단계";
    case "ja":
      return "ステップ";
    case "zh":
      return "步骤";
    case "de":
      return "Schritt";
    case "fr":
      return "Étape";
    case "es":
      return "Paso";
    default:
      return "Step";
  }
}

/** "Done" / completed label used on the bar variant when all stages finish. */
export function getDoneWord(locale: string): string {
  const lang = (locale || "en").slice(0, 2);
  switch (lang) {
    case "ko":
      return "완료";
    case "ja":
      return "完了";
    case "zh":
      return "完成";
    case "de":
      return "Fertig";
    case "fr":
      return "Terminé";
    case "es":
      return "Completado";
    default:
      return "Done";
  }
}

/** Parse the pipe-delimited `steps` param, falling back to a localized sample. */
export function parseSteps(raw: string, fallback: string[]): string[] {
  const parsed = raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : fallback;
}
