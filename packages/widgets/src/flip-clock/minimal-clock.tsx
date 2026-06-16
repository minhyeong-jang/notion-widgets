"use client";

export function MinimalCard({
  value,
  label,
  color,
  mode,
}: {
  value: string;
  label: string;
  color: string;
  mode: string;
}) {
  const isDark = mode === "dark";
  const cardBg = isDark ? "rgba(24,24,27,0.8)" : "rgba(0,0,0,0.05)";
  const cardBorder = isDark ? "rgba(63,63,70,0.5)" : "rgba(0,0,0,0.1)";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-baseline gap-0.5 font-mono">
        {value.split("").map((digit, i) => (
          <div
            key={i}
            className="w-12 h-16 sm:w-16 sm:h-20 rounded-xl flex items-center justify-center shadow-inner"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <span
              className="text-3xl sm:text-4xl font-bold"
              style={{ color }}
            >
              {digit}
            </span>
          </div>
        ))}
      </div>
      <span className="text-[10px] min-h-[1rem]" style={{ color, opacity: 0.7 }}>
        {label || "\u00A0"}
      </span>
    </div>
  );
}
