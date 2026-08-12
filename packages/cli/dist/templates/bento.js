"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBentoTemplate = getBentoTemplate;
/**
 * Bento Grid Component Scaffold Template (Anti-Slop Compliant)
 */
function getBentoTemplate(name) {
    return `import React from "react";

export interface ${name}Props {
  title?: string;
}

/**
 * ${name} - Asymmetric Feature Grid (Anti-Slop Compliant)
 * Rules: No nested card-in-card > 2 levels, spatial whitespace separation.
 */
export function ${name}({ title = "Architectural Pillars" }: ${name}Props) {
  return (
    <section className="w-full bg-[#090A0C] text-[#F3F4F6] p-6 md:p-12 space-y-8 font-sans">
      <div className="space-y-2 max-w-prose">
        <h2 className="text-3xl font-bold tracking-tight text-[#F3F4F6]">{title}</h2>
        <p className="text-sm text-[#9CA3AF]">Designed for high-performance AI agent workflows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large Feature Card (2 cols) */}
        <div className="md:col-span-2 bg-[#121318] p-8 rounded-md space-y-4 border border-[#222634]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6366F1]">Pillar 01</span>
          <h3 className="text-2xl font-bold tracking-tight text-[#F3F4F6]">3-Layer Context Architecture</h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            Eliminates context truncation and cognitive overload by keeping static blueprints pinned at 15–25 KB while streaming dynamic schemas via MCP protocol.
          </p>
        </div>

        {/* Small Feature Card (1 col) */}
        <div className="bg-[#121318] p-8 rounded-md space-y-4 border border-[#222634]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#10B981]">Pillar 02</span>
          <h3 className="text-xl font-bold tracking-tight text-[#F3F4F6]">AST Linter Engine</h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            Static AST code analyzer that rejects gradient headline slop and over-nested cards.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ${name};
`;
}
