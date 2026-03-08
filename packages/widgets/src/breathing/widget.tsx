"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { WidgetShell } from "../widget-shell";
import type { BreathingParams } from "./schema";

interface Phase {
  label: string;
  duration: number; // seconds
  action: "inhale" | "hold" | "exhale";
}

function getTechnique(technique: string): Phase[] {
  switch (technique) {
    case "box":
      return [
        { label: "Inhale", duration: 4, action: "inhale" },
        { label: "Hold", duration: 4, action: "hold" },
        { label: "Exhale", duration: 4, action: "exhale" },
        { label: "Hold", duration: 4, action: "hold" },
      ];
    case "equal":
      return [
        { label: "Inhale", duration: 4, action: "inhale" },
        { label: "Exhale", duration: 4, action: "exhale" },
      ];
    case "4-7-8":
    default:
      return [
        { label: "Inhale", duration: 4, action: "inhale" },
        { label: "Hold", duration: 7, action: "hold" },
        { label: "Exhale", duration: 8, action: "exhale" },
      ];
  }
}

function useBreathingAnimation(technique: string) {
  const phases = getTechnique(technique);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(phases[0].duration);
  const [scale, setScale] = useState(0.6);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const phaseIndexRef = useRef(0);
  const phasesRef = useRef(phases);

  // Reset when technique changes
  useEffect(() => {
    const newPhases = getTechnique(technique);
    phasesRef.current = newPhases;
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setCountdown(newPhases[0].duration);
    setScale(0.6);
    startTimeRef.current = performance.now();
  }, [technique]);

  const animate = useCallback((timestamp: number) => {
    const currentPhases = phasesRef.current;
    const pi = phaseIndexRef.current;
    const phase = currentPhases[pi];
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const remaining = Math.max(0, phase.duration - elapsed);

    setCountdown(Math.ceil(remaining));

    // Calculate scale based on phase action and progress
    const progress = elapsed / phase.duration;
    const clampedProgress = Math.min(1, progress);

    if (phase.action === "inhale") {
      setScale(0.6 + clampedProgress * 0.4); // 0.6 -> 1.0
    } else if (phase.action === "exhale") {
      setScale(1.0 - clampedProgress * 0.4); // 1.0 -> 0.6
    }
    // hold: scale stays where it is

    if (elapsed >= phase.duration) {
      // Move to next phase
      const nextIndex = (pi + 1) % currentPhases.length;
      phaseIndexRef.current = nextIndex;
      setPhaseIndex(nextIndex);
      setCountdown(currentPhases[nextIndex].duration);
      startTimeRef.current = timestamp;

      // Set initial scale for next phase
      if (currentPhases[nextIndex].action === "inhale") {
        setScale(0.6);
      } else if (currentPhases[nextIndex].action === "exhale") {
        setScale(1.0);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return {
    phase: phases[phaseIndex],
    countdown,
    scale,
    phases,
    phaseIndex,
  };
}

function CircleStyle({
  phase,
  countdown,
  scale,
  accent,
  text,
}: {
  phase: Phase;
  countdown: number;
  scale: number;
  accent: string;
  text: string;
}) {
  const size = 200;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {/* Outer glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            fill="none"
            stroke={accent}
            strokeWidth="1"
            opacity="0.15"
          />
          {/* Main circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 16}
            fill={accent + "12"}
            stroke={accent}
            strokeWidth="2"
            opacity="0.6"
          />
          {/* Inner circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 40}
            fill={accent + "08"}
            stroke={accent}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-lg font-medium"
            style={{
              color: accent,
              textShadow: "var(--w-text-shadow)",
            }}
          >
            {phase.label}
          </div>
          <div className="text-4xl font-bold mt-1" style={{ color: text }}>
            {countdown}
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalStyle({
  phase,
  countdown,
  scale,
  phases,
  phaseIndex,
  accent,
  text,
}: {
  phase: Phase;
  countdown: number;
  scale: number;
  phases: Phase[];
  phaseIndex: number;
  accent: string;
  text: string;
}) {
  const progress = 1 - (countdown / phase.duration);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs px-6">
      <div
        className="text-2xl font-bold"
        style={{
          color: accent,
          textShadow: "var(--w-text-shadow)",
        }}
      >
        {phase.label}
      </div>
      <div className="text-5xl font-bold" style={{ color: text }}>
        {countdown}
      </div>
      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: accent + "20" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: accent,
          }}
        />
      </div>
      {/* Phase indicators */}
      <div className="flex gap-2">
        {phases.map((p, i) => (
          <div
            key={i}
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: i === phaseIndex ? accent + "30" : "transparent",
              color: i === phaseIndex ? accent : text,
              opacity: i === phaseIndex ? 1 : 0.4,
            }}
          >
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function NeonStyle({
  phase,
  countdown,
  scale,
  accent,
}: {
  phase: Phase;
  countdown: number;
  scale: number;
  accent: string;
}) {
  // Generate waveform points based on scale (which maps to breathing amplitude)
  const width = 320;
  const height = 120;
  const midY = height / 2;
  // amplitude: scale goes 0.6-1.0, map to 8-45 px
  const amplitude = 8 + (scale - 0.6) * (45 / 0.4);
  const frequency = 3; // number of full waves visible
  const points: string[] = [];

  for (let x = 0; x <= width; x += 2) {
    const y = midY - amplitude * Math.sin((x / width) * frequency * 2 * Math.PI);
    points.push(`${x},${y.toFixed(1)}`);
  }

  const polylinePoints = points.join(" ");

  return (
    <div
      className="flex flex-col items-center gap-4"
      style={{ fontFamily: "var(--font-mono, 'Courier New', monospace)" }}
    >
      {/* Oscilloscope display */}
      <div
        style={{
          border: `1px solid ${accent}30`,
          padding: "12px",
          position: "relative",
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: "block" }}
        >
          {/* Grid lines */}
          <line
            x1="0" y1={midY} x2={width} y2={midY}
            stroke={accent}
            strokeWidth="0.5"
            opacity="0.15"
          />
          <line
            x1={width / 2} y1="0" x2={width / 2} y2={height}
            stroke={accent}
            strokeWidth="0.5"
            opacity="0.15"
          />
          {/* Horizontal grid */}
          <line
            x1="0" y1={midY - 30} x2={width} y2={midY - 30}
            stroke={accent}
            strokeWidth="0.3"
            opacity="0.08"
            strokeDasharray="4 4"
          />
          <line
            x1="0" y1={midY + 30} x2={width} y2={midY + 30}
            stroke={accent}
            strokeWidth="0.3"
            opacity="0.08"
            strokeDasharray="4 4"
          />
          {/* Waveform */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke={accent}
            strokeWidth="2"
            style={{
              filter: `drop-shadow(0 0 4px ${accent}) drop-shadow(0 0 8px ${accent}80)`,
            }}
          />
        </svg>
      </div>

      {/* Phase and timer display */}
      <div className="flex items-center gap-6">
        <div style={{ color: accent }}>
          <span style={{ opacity: 0.5 }}>PHASE: </span>
          <span style={{ fontWeight: 700 }}>
            {phase.label.toUpperCase()}
          </span>
        </div>
        <div style={{ color: accent }}>
          <span style={{ opacity: 0.5 }}>T: </span>
          <span
            className="text-2xl font-bold"
            style={{
              textShadow: `0 0 8px ${accent}80`,
              letterSpacing: "0.1em",
            }}
          >
            {String(countdown).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BreathingWidget({ params }: { params: BreathingParams }) {
  const accentColor = "#" + params.color;
  const { phase, countdown, scale, phases, phaseIndex } = useBreathingAnimation(params.technique);

  if (params.style === "neon") {
    return (
      <WidgetShell params={params}>
        <NeonStyle
          phase={phase}
          countdown={countdown}
          scale={scale}
          accent={accentColor}
        />
      </WidgetShell>
    );
  }

  return (
    <WidgetShell params={params}>
      {params.variant === "circle" ? (
        <CircleStyle
          phase={phase}
          countdown={countdown}
          scale={scale}
          accent={accentColor}
          text={accentColor}
        />
      ) : (
        <MinimalStyle
          phase={phase}
          countdown={countdown}
          scale={scale}
          phases={phases}
          phaseIndex={phaseIndex}
          accent={accentColor}
          text={accentColor}
        />
      )}
    </WidgetShell>
  );
}
