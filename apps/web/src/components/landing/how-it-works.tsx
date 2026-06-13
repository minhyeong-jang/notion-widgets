import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

interface HowItWorksProps {
  dict: Dictionary;
  locale: Locale;
}

export function HowItWorks({ dict, locale }: HowItWorksProps) {
  return (
    <section id="how" style={{ padding: "90px 0" }}>
      <div className="mx-auto px-8" style={{ maxWidth: "var(--maxw)" }}>
        {/* Section header */}
        <div style={{ marginBottom: 36 }}>
          <div
            className="text-accent font-bold uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            How it works
          </div>
          <h2
            className="text-text"
            style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: 8,
            }}
          >
            이렇게 사용하세요
          </h2>
          <p className="text-text-dim" style={{ fontSize: 15 }}>
            3단계만 따라하면 Notion에 위젯이 완성됩니다.
          </p>
        </div>

        {/* Steps grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 overflow-hidden"
          style={{
            gap: 1,
            backgroundColor: "var(--border-soft)",
            border: "1px solid var(--border-soft)",
            borderRadius: 16,
          }}
        >
          <div className="bg-bg" style={{ padding: "34px 30px 38px" }}>
            <div
              className="text-accent font-bold font-mono"
              style={{
                fontSize: 13,
                letterSpacing: "0.1em",
                paddingBottom: 18,
                marginBottom: 18,
                borderBottom: "1px solid var(--border-soft)",
              }}
            >
              01
            </div>
            <h3
              className="text-text"
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.015em",
                marginBottom: 10,
              }}
            >
              위젯을 선택하세요
            </h3>
            <p
              className="text-text-dim"
              style={{ fontSize: 14, lineHeight: 1.62 }}
            >
              갤러리에서 마음에 드는 위젯을 골라보세요. 시계, 진행률, D-Day 등
              다양한 위젯이 준비되어 있습니다.
            </p>
          </div>

          <div className="bg-bg" style={{ padding: "34px 30px 38px" }}>
            <div
              className="text-accent font-bold font-mono"
              style={{
                fontSize: 13,
                letterSpacing: "0.1em",
                paddingBottom: 18,
                marginBottom: 18,
                borderBottom: "1px solid var(--border-soft)",
              }}
            >
              02
            </div>
            <h3
              className="text-text"
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.015em",
                marginBottom: 10,
              }}
            >
              원하는 대로 꾸미세요
            </h3>
            <p
              className="text-text-dim"
              style={{ fontSize: 14, lineHeight: 1.62 }}
            >
              색상 · 크기 · 표시 옵션을 자유롭게 설정하세요. 모든 설정은 URL에
              저장되어 가입이 필요 없습니다.
            </p>
          </div>

          <div className="bg-bg" style={{ padding: "34px 30px 38px" }}>
            <div
              className="text-accent font-bold font-mono"
              style={{
                fontSize: 13,
                letterSpacing: "0.1em",
                paddingBottom: 18,
                marginBottom: 18,
                borderBottom: "1px solid var(--border-soft)",
              }}
            >
              03
            </div>
            <h3
              className="text-text"
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.015em",
                marginBottom: 10,
              }}
            >
              붙여넣으면 끝
            </h3>
            <p
              className="text-text-dim"
              style={{ fontSize: 14, lineHeight: 1.62 }}
            >
              생성된 URL을 복사해 Notion에서{" "}
              <span
                className="font-mono text-accent-bright"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  padding: "1px 6px",
                  borderRadius: 5,
                  fontSize: 12.5,
                }}
              >
                /embed
              </span>{" "}
              명령어로 붙여넣기만 하면 완성입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
