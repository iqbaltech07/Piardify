/**
 * Modal Component Scaffold Template (Anti-Slop Compliant)
 */
export function getModalTemplate(name: string): string {
  return `import React from "react";

export interface ${name}Props {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

/**
 * ${name} - Elevated Dialog Modal (Anti-Slop Compliant)
 * Rules: Surface level 2 (#181A22), subtle backdrop blur, zero neon glow.
 */
export function ${name}({
  isOpen,
  title = "Confirm System Action",
  onClose,
  onConfirm,
}: ${name}Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#181A22] border border-[#222634] p-6 rounded-md shadow-2xl space-y-6 font-sans">
        <div className="flex items-center justify-between border-b border-[#222634] pb-4">
          <h3 className="text-lg font-bold tracking-tight text-[#F3F4F6]">{title}</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#F3F4F6] text-sm">✕</button>
        </div>

        <p className="text-sm text-[#9CA3AF] leading-relaxed">
          Are you sure you want to proceed with this operation? This will synchronize all active Kanban tasks to the production database.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-[#121318] hover:bg-[#090A0C] text-[#9CA3AF] text-sm rounded-md border border-[#222634]">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium rounded-md">
            Confirm Sync
          </button>
        </div>
      </div>
    </div>
  );
}

export default ${name};
`;
}
