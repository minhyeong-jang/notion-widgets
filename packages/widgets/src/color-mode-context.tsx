"use client";

import { createContext, useContext } from "react";

export const ColorModeContext = createContext<"dark" | "light">("dark");

export function useWidgetColorMode(): "dark" | "light" {
  return useContext(ColorModeContext);
}
