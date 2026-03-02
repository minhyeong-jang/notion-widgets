"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/i18n/get-dictionary";

interface HeroProps {
  dict: Dictionary;
}

export function Hero({ dict }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.classList.add("hero-visible");
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px] animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-sky-500/8 blur-[100px] animate-[drift_18s_ease-in-out_infinite_2s]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="hero-content max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm mb-8 text-sm text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {dict.hero.badge}
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-50 leading-[1.1] mb-6">
          <span className="block">{dict.hero.headingLine1}</span>
          <span className="block mt-2">
            {dict.hero.headingLine2}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                {dict.hero.headingHighlight}
              </span>
              <span className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-sky-400/20 to-violet-400/20 blur-xl -z-10 rounded-lg" />
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {dict.hero.subtitle}
          <br className="hidden sm:block" />
          {dict.hero.subtitleLine2}
        </p>

        {/* CTA */}
        <a
          href="#gallery"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-zinc-50 text-zinc-900 font-semibold text-lg transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]"
        >
          {dict.hero.cta}
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        {/* Floating widget previews */}
        <div className="relative mt-20 mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Clock preview card */}
            <div className="widget-preview-card w-48 sm:w-56 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md p-5 shadow-2xl shadow-black/20 animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-baseline gap-2 justify-center font-mono text-3xl sm:text-4xl font-bold text-zinc-100">
                <span>12</span>
                <span className="text-emerald-400 animate-pulse">:</span>
                <span>34</span>
              </div>
              <p className="text-xs text-zinc-500 mt-3 text-center">Flip Clock</p>
            </div>

            {/* Progress preview card */}
            <div className="widget-preview-card w-48 sm:w-56 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md p-5 shadow-2xl shadow-black/20 animate-[float_6s_ease-in-out_infinite_1s]">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>2026</span>
                    <span>16%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[16%] transition-all duration-1000" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>March</span>
                    <span>3%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 w-[3%] transition-all duration-1000" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-3 text-center">Life Progress</p>
            </div>
          </div>

          {/* Glow effect under cards */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-violet-500/10 blur-3xl rounded-full" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 text-sm">
        <span>{dict.hero.scroll}</span>
        <div className="w-5 h-8 rounded-full border-2 border-zinc-700 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-zinc-500 animate-[scrollBounce_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
