"use client";

export function MinimalCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-baseline gap-0.5 font-mono">
        {value.split("").map((digit, i) => (
          <div
            key={i}
            className="w-12 h-16 sm:w-16 sm:h-20 rounded-xl bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center shadow-inner"
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
