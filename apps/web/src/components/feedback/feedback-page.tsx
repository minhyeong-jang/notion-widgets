"use client";

import { useState, useMemo } from "react";
import { getAllWidgets } from "@nw/widget-core";
import "@nw/widgets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getWidgetName } from "@/i18n/widget-locale";
import { Footer } from "@/components/shared/footer";

type FeedbackType = "new" | "improve";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function FeedbackPage({ locale }: Props) {
  const allWidgets = useMemo(() => getAllWidgets(), []);
  const isKo = locale === "ko";

  const [type, setType] = useState<FeedbackType>("new");
  const [targetWidget, setTargetWidget] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    title: false,
    detail: false,
    email: false,
  });

  const charCount = detail.length;
  const maxChars = 600;

  function validEmail(v: string) {
    return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const okTitle = title.trim().length > 0;
    const okDetail = detail.trim().length > 0;
    const okEmail = validEmail(email.trim());

    setErrors({
      title: !okTitle,
      detail: !okDetail,
      email: !okEmail,
    });

    if (!okTitle || !okDetail || !okEmail) return;

    const payload = {
      type,
      targetWidget: type === "improve" ? targetWidget : null,
      title: title.trim(),
      detail: detail.trim(),
      email: email.trim() || null,
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    console.log("[feedback] payload →", payload);

    // Simulate network delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 650);
  }

  function handleReset() {
    setTitle("");
    setDetail("");
    setEmail("");
    setTargetWidget("");
    setType("new");
    setErrors({ title: false, detail: false, email: false });
    setSubmitted(false);
  }

  /* ── Shared styles ── */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: "var(--font-sans)",
    fontSize: 14.5,
    padding: "12px 14px",
    borderRadius: 11,
    border: "1px solid var(--border)",
    background: "var(--inset)",
    color: "var(--text)",
    outline: "none",
    transition: "border-color .15s",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236f6b60' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: 4,
  };

  const hintStyle: React.CSSProperties = {
    fontSize: 12.5,
    color: "var(--text-dim)",
    marginBottom: 11,
  };

  const errStyle = (show: boolean): React.CSSProperties => ({
    fontSize: 12.5,
    color: "#f08a8a",
    marginTop: 8,
    display: show ? "block" : "none",
  });

  return (
    <main style={{ paddingTop: 60 }}>
      <section style={{ padding: "56px 0 90px" }}>
        <div
          className="mx-auto"
          style={{ maxWidth: "var(--maxw, 1080px)", padding: "0 32px" }}
        >
          <div
            className="grid items-start"
            style={{
              gridTemplateColumns: "0.85fr 1.15fr",
              gap: 56,
            }}
          >
            {/* ── Left: Intro ── */}
            <div
              className="fb-intro"
              style={{
                // collapse to single column on small screens via CSS below
              }}
            >
              <div
                className="font-mono uppercase tracking-wider"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--accent)",
                  marginBottom: 14,
                }}
              >
                Feedback
              </div>
              <h1
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  lineHeight: 1.08,
                }}
              >
                {isKo ? (
                  <>
                    필요한 위젯을
                    <br />
                    알려주세요
                  </>
                ) : (
                  <>
                    Tell us what
                    <br />
                    you need
                  </>
                )}
              </h1>
              <p
                style={{
                  marginTop: 18,
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--text-dim)",
                  maxWidth: "38ch",
                }}
              >
                {isKo
                  ? "원하는 위젯이 없거나, 기존 위젯에 개선점이 있다면 편하게 남겨주세요. 다음 업데이트에 반영합니다."
                  : "If you can't find the widget you want, or have ideas to improve existing ones, let us know. We'll include it in the next update."}
              </p>
            </div>

            {/* ── Right: Form Card ── */}
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 18,
                background: "var(--surface)",
                padding: "28px 28px 30px",
              }}
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Type segment */}
                  <div style={{ marginBottom: 22 }}>
                    <label style={labelStyle}>
                      {isKo ? "어떤 제보인가요?" : "Feedback type"}
                    </label>
                    <div
                      className="flex"
                      style={{
                        gap: 4,
                        background: "var(--inset)",
                        border: "1px solid var(--border-soft)",
                        borderRadius: 11,
                        padding: 4,
                      }}
                    >
                      {(
                        [
                          {
                            value: "new" as FeedbackType,
                            emoji: "＋",
                            ko: "새 위젯 제안",
                            en: "New widget",
                          },
                          {
                            value: "improve" as FeedbackType,
                            emoji: "✎",
                            ko: "기존 위젯 개선",
                            en: "Improve existing",
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setType(opt.value)}
                          className="flex items-center justify-center"
                          style={{
                            flex: 1,
                            fontFamily: "var(--font-sans)",
                            fontSize: 13.5,
                            fontWeight: 600,
                            padding: "11px 8px",
                            border: "none",
                            borderRadius: 8,
                            background:
                              type === opt.value
                                ? "var(--accent)"
                                : "transparent",
                            color:
                              type === opt.value
                                ? "var(--btn-text)"
                                : "var(--text-faint)",
                            cursor: "pointer",
                            gap: 7,
                            transition: "background .15s, color .15s",
                          }}
                        >
                          <span style={{ fontSize: 15 }}>{opt.emoji}</span>
                          {isKo ? opt.ko : opt.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target widget (only when "improve") */}
                  {type === "improve" && (
                    <div style={{ marginBottom: 22 }}>
                      <label style={labelStyle}>
                        {isKo ? "어떤 위젯인가요?" : "Which widget?"}
                      </label>
                      <select
                        value={targetWidget}
                        onChange={(e) => setTargetWidget(e.target.value)}
                        style={selectStyle}
                      >
                        <option value="">
                          {isKo ? "위젯 선택" : "Select a widget"}
                        </option>
                        {allWidgets.map((w) => (
                          <option key={w.meta.id} value={w.meta.id}>
                            {getWidgetName(w, locale)} ({w.meta.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Title */}
                  <div style={{ marginBottom: 22 }}>
                    <label style={labelStyle}>
                      {isKo ? "한 줄 요약" : "Summary"}
                    </label>
                    <div style={hintStyle}>
                      {isKo
                        ? "어떤 위젯/개선인지 짧게 적어주세요."
                        : "Briefly describe the widget or improvement."}
                    </div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={80}
                      placeholder={
                        isKo
                          ? "예: 주식 시세를 보여주는 위젯"
                          : "e.g. A widget that shows stock prices"
                      }
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--accent)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                    <div style={errStyle(errors.title)}>
                      {isKo
                        ? "한 줄 요약을 입력해 주세요."
                        : "Please enter a summary."}
                    </div>
                  </div>

                  {/* Detail */}
                  <div style={{ marginBottom: 22 }}>
                    <label style={labelStyle}>
                      {isKo ? "자세한 설명" : "Details"}
                    </label>
                    <div style={hintStyle}>
                      {isKo
                        ? "어떤 기능이 필요한지, 어디에 쓰고 싶은지 자유롭게 적어주세요."
                        : "Describe what features you need and where you'd use it."}
                    </div>
                    <textarea
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      maxLength={maxChars}
                      placeholder={
                        isKo
                          ? "예: 관심 종목 3~4개의 현재가와 등락률을 한눈에 보고 싶어요. 노션 대시보드 상단에 두려고 합니다."
                          : "e.g. I want to see current prices and changes for 3-4 stocks at a glance. Planning to put it at the top of my Notion dashboard."
                      }
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: 130,
                        lineHeight: 1.55,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--accent)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                    <div
                      className="font-mono"
                      style={{
                        textAlign: "right",
                        fontSize: 11,
                        color:
                          charCount > maxChars * 0.9
                            ? "var(--accent)"
                            : "var(--text-faint)",
                        marginTop: 7,
                      }}
                    >
                      {charCount} / {maxChars}
                    </div>
                    <div style={errStyle(errors.detail)}>
                      {isKo
                        ? "자세한 설명을 입력해 주세요."
                        : "Please enter details."}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>
                      {isKo ? "이메일" : "Email"}{" "}
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 10.5,
                          color: "var(--text-faint)",
                          fontWeight: 400,
                        }}
                      >
                        {isKo
                          ? "선택 · 반영 시 알림 받기"
                          : "Optional · Get notified"}
                      </span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        isKo
                          ? "you@example.com (남기지 않아도 됩니다)"
                          : "you@example.com (optional)"
                      }
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--accent)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                    <div style={errStyle(errors.email)}>
                      {isKo
                        ? "이메일 형식이 올바르지 않아요."
                        : "Please enter a valid email."}
                    </div>
                  </div>

                  {/* Submit */}
                  <div
                    className="flex items-center"
                    style={{ marginTop: 26, gap: 16 }}
                  >
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center"
                      style={{
                        gap: 9,
                        fontSize: 15,
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 12,
                        padding: "14px 26px",
                        cursor: submitting ? "not-allowed" : "pointer",
                        backgroundColor: "var(--accent)",
                        color: "var(--btn-text)",
                        opacity: submitting ? 0.45 : 1,
                      }}
                    >
                      {submitting
                        ? isKo
                          ? "보내는 중..."
                          : "Sending..."
                        : isKo
                          ? "제보 보내기"
                          : "Send feedback"}
                      {!submitting && (
                        <span className="font-mono">→</span>
                      )}
                    </button>
                    <span
                      style={{
                        fontSize: 12.5,
                        color: "var(--text-faint)",
                      }}
                    >
                      {isKo
                        ? "제보 내용 외 어떤 정보도 수집하지 않습니다."
                        : "No data is collected beyond your feedback."}
                    </span>
                  </div>
                </form>
              ) : (
                /* ── Success state ── */
                <div
                  className="flex flex-col items-center text-center"
                  style={{ padding: "46px 28px 40px" }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      background: "var(--accent-tint)",
                      color: "var(--accent)",
                      fontSize: 28,
                      marginBottom: 20,
                    }}
                  >
                    ✓
                  </div>
                  <h2
                    style={{
                      fontSize: 23,
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "var(--text)",
                    }}
                  >
                    {isKo ? "제보가 접수되었어요" : "Feedback received"}
                  </h2>
                  <p
                    style={{
                      marginTop: 11,
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: "var(--text-dim)",
                      maxWidth: "34ch",
                    }}
                  >
                    {isKo
                      ? "소중한 의견 고맙습니다. 검토 후 다음 업데이트에 반영할게요."
                      : "Thank you for your input. We'll review it and include it in the next update."}
                  </p>
                  <button
                    onClick={handleReset}
                    style={{
                      marginTop: 26,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--accent)",
                      background: "none",
                      border: "1px solid var(--accent-deep)",
                      borderRadius: 10,
                      padding: "10px 20px",
                      cursor: "pointer",
                    }}
                  >
                    {isKo ? "다른 제보 남기기" : "Submit another"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Responsive: 2-col → 1-col at ≤860px */}
      <style>{`
        @media (max-width: 860px) {
          .grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .fb-intro h1 { font-size: 32px !important; }
        }
        @media (max-width: 560px) {
          .flex[style*="margin-top: 26px"] { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </main>
  );
}
