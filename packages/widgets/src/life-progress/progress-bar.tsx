"use client";

export const ProgressBar = ({
  label,
  percentage,
  barColor = "white",
}: {
  label: string;
  percentage: number;
  barColor?: string;
}) => {
  const clampedPercentage = Math.max(0, Math.min(percentage, 100));
  const hasMinimumProgress = clampedPercentage > 0 && clampedPercentage < 3;
  const displayWidth = hasMinimumProgress
    ? Math.max(clampedPercentage, 3)
    : clampedPercentage;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white text-sm font-bold">{label}:</span>
        <span className="text-white text-sm font-bold">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full h-6 bg-white/20 rounded-full p-0.5">
        <div
          className={`h-full transition-all duration-1000 ease-out ${
            displayWidth >= 3 ? "rounded-full" : "rounded-l-full"
          }`}
          style={{
            backgroundColor: barColor,
            width: `${displayWidth}%`,
            minWidth: clampedPercentage > 0 ? "4%" : "0px",
          }}
        />
      </div>
    </div>
  );
};
