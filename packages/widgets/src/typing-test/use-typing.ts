"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TypingStatus = "idle" | "running" | "done";

/**
 * Core typing-test state over a fixed `target` string.
 *
 * Value-driven: the consumer feeds the current text (from a native input) via
 * `setValue`, which keeps space/IME/mobile handling reliable. The test starts
 * on the first character and finishes once the typed length reaches the target.
 * Time counts up; WPM/accuracy are derived. A live ticker refreshes elapsed
 * time (and live WPM) while running.
 */
export function useTyping(target: string) {
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<TypingStatus>("idle");
  const [startAt, setStartAt] = useState<number | null>(null);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [, forceTick] = useState(0);

  const statusRef = useRef(status);
  statusRef.current = status;
  const targetRef = useRef(target);
  targetRef.current = target;

  // Reset whenever the target changes (new word stream / passage).
  useEffect(() => {
    setTyped("");
    setStatus("idle");
    setStartAt(null);
    setEndAt(null);
  }, [target]);

  // Live ticker while running so elapsed time and live WPM update.
  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => forceTick((t) => t + 1), 200);
    return () => window.clearInterval(id);
  }, [status]);

  const setValue = useCallback((raw: string) => {
    if (statusRef.current === "done") return;
    const t = targetRef.current;
    const next = raw.slice(0, t.length);
    if (statusRef.current === "idle" && next.length > 0) {
      setStatus("running");
      setStartAt(Date.now());
    }
    if (next.length >= t.length && t.length > 0) {
      setStatus("done");
      setEndAt(Date.now());
    }
    setTyped(next);
  }, []);

  const reset = useCallback(() => {
    setTyped("");
    setStatus("idle");
    setStartAt(null);
    setEndAt(null);
  }, []);

  // ─── Derived stats ───
  const elapsedMs = startAt == null ? 0 : (endAt ?? Date.now()) - startAt;
  const elapsedSec = elapsedMs / 1000;

  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++;
  }
  const minutes = Math.max(elapsedSec / 60, 1 / 60);
  const wpm = status === "idle" ? 0 : Math.round(correct / 5 / minutes);
  const accuracy = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100);

  return { typed, status, setValue, reset, wpm, accuracy, elapsedSec, correct };
}
