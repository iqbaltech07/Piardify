/**
 * Form Component Scaffold Template (Anti-Slop Compliant)
 */
export function getFormTemplate(name: string): string {
  return `import React, { useState } from "react";

export interface ${name}Props {
  title?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

/**
 * ${name} - Accessible Input Form (Anti-Slop Compliant)
 * Rules: Explicit labels, subtle 6px radius inputs, zero floating pills.
 */
export function ${name}({
  title = "Project Configuration",
  onSubmit,
}: ${name}Props) {
  const [formData, setFormData] = useState({ appName: "", environment: "production" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[#121318] border border-[#222634] p-6 md:p-8 rounded-md space-y-6 font-sans">
      <h2 className="text-2xl font-bold tracking-tight text-[#F3F4F6]">{title}</h2>

      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Application Name
        </label>
        <input
          type="text"
          value={formData.appName}
          onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
          placeholder="e.g. Piardify Engine"
          className="w-full px-4 py-2.5 bg-[#090A0C] border border-[#222634] rounded-md text-sm text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:border-[#6366F1] transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Target Environment
        </label>
        <select
          value={formData.environment}
          onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
          className="w-full px-4 py-2.5 bg-[#090A0C] border border-[#222634] rounded-md text-sm text-[#F3F4F6] focus:outline-none focus:border-[#6366F1] transition-colors"
        >
          <option value="production">Production Edge</option>
          <option value="staging">Staging Sandbox</option>
          <option value="development">Local Development</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium text-sm rounded-md transition-all duration-150"
      >
        Save Configuration
      </button>
    </form>
  );
}

export default ${name};
`;
}
