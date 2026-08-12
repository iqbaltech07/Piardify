"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardTemplate = getCardTemplate;
/**
 * Card Component Scaffold Template (Anti-Slop Compliant)
 */
function getCardTemplate(name) {
    return `import React from "react";

export interface ${name}Props {
  title?: string;
  subtitle?: string;
  metrics?: Array<{
    label: string;
    amount: number;
    change: string;
  }>;
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return \`Rp \${(amount / 1000000000).toFixed(2).replace(/\\.00$/, "")} M\`;
  }
  if (amount >= 1000000) {
    return \`Rp \${(amount / 1000000).toFixed(2).replace(/\\.00$/, "")} Jt\`;
  }
  if (amount >= 100000) {
    return \`Rp \${Math.round(amount / 1000)} Rb\`;
  }
  return \`Rp \${amount.toLocaleString("id-ID")}\`;
}

export function ${name}({
  title = "${name}",
  subtitle = "Streamlined, human-designed interface with zero slop",
  metrics = [
    { label: "Total Revenue", amount: 1450000000, change: "+12.4%" },
    { label: "Active Subscriptions", amount: 28500000, change: "+5.1%" },
    { label: "Pending Transfers", amount: 450000, change: "-2.0%" },
  ],
}: ${name}Props) {
  return (
    <div className="w-full bg-[#090A0C] text-[#F3F4F6] p-6 md:p-12 space-y-8 font-sans">
      <header className="space-y-2 max-w-prose">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F3F4F6]">
          {title}
        </h1>
        <p className="text-sm md:text-base text-[#9CA3AF] leading-relaxed">
          {subtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#121318] hover:bg-[#181A22] transition-colors duration-200 p-6 rounded-md space-y-3 border border-[#222634]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-medium text-[#6B7280]">
                {item.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-mono">
                {item.change}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-[#F3F4F6]">
              {formatCompactCurrency(item.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ${name};
`;
}
