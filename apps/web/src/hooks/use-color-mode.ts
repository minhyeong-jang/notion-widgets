"use client";

import { useState, useEffect } from "react";

export function useColorMode(): "dark" | "light" {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setMode(mq.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return mode;
}
