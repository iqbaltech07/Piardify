"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableTemplate = getTableTemplate;
/**
 * Table Component Scaffold Template (Anti-Slop Compliant)
 */
function getTableTemplate(name) {
    return `import React from "react";

export interface DataRow {
  id: string;
  name: string;
  category: string;
  amount: number;
  status: "active" | "pending" | "failed";
  updatedAt: string;
}

export interface ${name}Props {
  title?: string;
  data?: DataRow[];
}

/**
 * ${name} - Utilitarian Data Table (Anti-Slop Compliant)
 * Rules: Dense information matrix, mono fonts for codes/numbers, clean dividers.
 */
export function ${name}({
  title = "Transaction Audit Log",
  data = [
    { id: "TX-9041", name: "Enterprise API Subscription", category: "Billing", amount: 14500000, status: "active", updatedAt: "2026-08-12" },
    { id: "TX-9042", name: "Upstash Redis Pool Cache", category: "Infrastructure", amount: 3200000, status: "active", updatedAt: "2026-08-11" },
    { id: "TX-9043", name: "AI SDK Token Consumption", category: "Compute", amount: 850000, status: "pending", updatedAt: "2026-08-10" },
  ],
}: ${name}Props) {
  return (
    <div className="w-full bg-[#090A0C] text-[#F3F4F6] p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[#F3F4F6]">{title}</h2>
        <span className="text-xs font-mono text-[#6B7280]">Total: {data.length} records</span>
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-[#222634]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#121318] text-[#9CA3AF] text-xs uppercase tracking-wider font-mono border-b border-[#222634]">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222634]/60 bg-[#090A0C]">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-[#121318] transition-colors duration-150">
                <td className="py-3 px-4 font-mono text-xs text-[#9CA3AF]">{row.id}</td>
                <td className="py-3 px-4 font-medium text-[#F3F4F6]">{row.name}</td>
                <td className="py-3 px-4 text-xs text-[#9CA3AF]">{row.category}</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-[#F3F4F6]">
                  Rp {(row.amount / 1000000).toFixed(2)} Jt
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={\`text-[11px] px-2 py-0.5 rounded font-mono uppercase tracking-wider \${
                    row.status === "active" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                  }\`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs font-mono text-[#6B7280]">{row.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ${name};
`;
}
