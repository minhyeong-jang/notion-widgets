"use client";

import { useState, useEffect } from "react";

export const FlipCard = ({ value, label }: { value: string; label: string }) => {
  const [topValue, setTopValue] = useState(value);
  const [bottomValue, setBottomValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== topValue) {
      setIsFlipping(true);
      setTimeout(() => {
        setTopValue(value);
      }, 200);
      setTimeout(() => {
        setBottomValue(value);
      }, 300);
      setTimeout(() => {
        setIsFlipping(false);
      }, 400);
    }
  }, [value, topValue]);

  return (
    <div className="bg-[#7fb686] rounded-3xl p-4 w-full h-64 flex flex-col shadow-2xl relative">
      <div className="text-white text-md font-bold opacity-100 text-left">
        {label}
      </div>

      <div
        className="relative flex-1 flex items-center justify-center"
        style={{ perspective: "400px" }}
      >
        <div className="relative w-full h-32">
          {/* Static top panel */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-[#7fb686] overflow-hidden z-10">
            <div className="flex items-start justify-center h-full pt-8">
              <span className="text-white text-7xl font-bold">{topValue}</span>
            </div>
          </div>

          {/* Static bottom panel */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#7fb686] overflow-hidden z-10">
            <div className="flex items-start justify-center h-full pt-2">
              <span
                className="text-white text-7xl font-bold"
                style={{ marginTop: "-2.5rem" }}
              >
                {bottomValue}
              </span>
            </div>
          </div>

          {/* Flip animation overlays */}
          {isFlipping && (
            <>
              <div
                className="flip-top absolute inset-x-0 top-0 h-1/2 bg-[#7fb686] overflow-hidden z-20"
                style={{
                  animation: "flipTopDown 0.5s ease-in-out forwards",
                  transformOrigin: "bottom",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="flex items-start justify-center h-full pt-8">
                  <span className="text-white text-7xl font-bold">
                    {topValue}
                  </span>
                </div>
              </div>

              <div
                className="flip-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#7fb686] overflow-hidden z-15"
                style={{
                  animation: "flipBottomUp 0.4s ease-in-out forwards",
                  transformOrigin: "top",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-start justify-center h-full pt-2">
                  <span
                    className="text-white text-7xl font-bold"
                    style={{ marginTop: "-2.5rem" }}
                  >
                    {value}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Center divider */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-zinc-700 opacity-40 z-30" />
        </div>
      </div>
    </div>
  );
};
