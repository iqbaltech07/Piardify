"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeroTemplate = getHeroTemplate;
/**
 * Hero Component Scaffold Template (Anti-Slop Compliant)
 */
function getHeroTemplate(name) {
    return `import React from "react";

export interface ${name}Props {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onPrimaryClick?: () => void;
}

/**
 * ${name} - Editorial Hero Section (Anti-Slop Compliant)
 * Rules: Max 2 lines title, transparent hero badge, no pulsing dots, 80px navbar friendly.
 */
export function ${name}({
  title = "Build System Blueprints with AI Precision",
  subtitle = "Generate structured PRDs, system architecture schemas, and sync Kanban tasks seamlessly.",
  primaryCtaText = "Get Started Free",
  secondaryCtaText = "View Documentation",
  onPrimaryClick,
}: ${name}Props) {
  return (
    <section className="w-full min-h-[85dvh] bg-[#090A0C] text-[#F3F4F6] flex flex-col justify-center items-center px-6 py-20 text-center font-sans space-y-8">
      {/* Transparent Hero Anchor Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-wider uppercase text-[#9CA3AF] bg-transparent border border-[#222634] rounded-full">
        <span>Piardify Engine v2.0</span>
      </div>

      {/* Hero Headline — Solid Typography (No Gradient Text Slop) */}
      <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F3F4F6] leading-[1.1]">
        {title}
      </h1>

      {/* Subtitle — Max 20 Words */}
      <p className="max-w-2xl text-base md:text-lg text-[#9CA3AF] leading-relaxed">
        {subtitle}
      </p>

      {/* CTA Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <button
          onClick={onPrimaryClick}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium text-sm rounded-md transition-all duration-150 active:scale-[0.98]"
        >
          {primaryCtaText}
        </button>
        <button className="w-full sm:w-auto px-8 py-3.5 bg-[#121318] hover:bg-[#181A22] text-[#F3F4F6] border border-[#222634] font-medium text-sm rounded-md transition-all duration-150">
          {secondaryCtaText}
        </button>
      </div>
    </section>
  );
}

export default ${name};
`;
}
