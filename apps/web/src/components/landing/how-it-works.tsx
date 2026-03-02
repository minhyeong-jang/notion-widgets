"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutGrid, Paintbrush, ClipboardCopy } from "lucide-react";
import type { Dictionary } from "@/i18n/get-dictionary";

interface HowItWorksProps {
  dict: Dictionary;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="relative rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm p-8 h-full">
        {/* Step number */}
        <div className="text-5xl font-bold text-zinc-800/60 font-mono mb-6 select-none">
          {step.number}
        </div>

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800/50 text-emerald-400 mb-5">
          {step.icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-zinc-100 mb-3">
          {step.title}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function HowItWorks({ dict }: HowItWorksProps) {
  const steps: Step[] = [
    {
      number: "01",
      title: dict.howItWorks.step1Title,
      description: dict.howItWorks.step1Desc,
      icon: <LayoutGrid className="w-7 h-7" />,
    },
    {
      number: "02",
      title: dict.howItWorks.step2Title,
      description: dict.howItWorks.step2Desc,
      icon: <Paintbrush className="w-7 h-7" />,
    },
    {
      number: "03",
      title: dict.howItWorks.step3Title,
      description: dict.howItWorks.step3Desc,
      icon: <ClipboardCopy className="w-7 h-7" />,
    },
  ];

  return (
    <section className="relative px-6 py-32">
      {/* Divider gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-50 tracking-tight mb-4">
            {dict.howItWorks.title}
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            {dict.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
