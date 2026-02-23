"use client";

import { useState, useEffect } from "react";
import { FlipCard } from "./flip-clock";

export function FlipClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const isAM = time.getHours() < 12;
  const dayOfWeek = time
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  return (
    <div className="bg-zinc-900 min-h-screen flex items-center justify-center w-full">
      <div className="flex w-full">
        <div className="w-1/2 pr-2">
          <FlipCard value={hours} label={isAM ? "AM" : "PM"} />
        </div>
        <div className="w-1/2 pl-2">
          <FlipCard value={minutes} label={dayOfWeek} />
        </div>
      </div>
    </div>
  );
}
