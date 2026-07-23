"use client";

import React from "react";
import { CheckSquare, Square } from "lucide-react";

interface ListBlockProps {
  ordered?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const ListBlock: React.FC<ListBlockProps> = ({
  ordered = false,
  children,
  className = "",
}) => {
  if (ordered) {
    return (
      <ol className={`my-3 pl-5 list-decimal space-y-1.5 text-xs sm:text-sm text-slate-300 ${className}`}>
        {children}
      </ol>
    );
  }
  return (
    <ul className={`my-3 pl-5 list-disc space-y-1.5 text-xs sm:text-sm text-slate-300 ${className}`}>
      {children}
    </ul>
  );
};

export const ListItemBlock: React.FC<{ children?: React.ReactNode; checked?: boolean | null }> = ({
  children,
  checked = null,
}) => {
  if (checked !== null) {
    return (
      <li className="flex items-start gap-2 list-none -ml-4 my-1 text-xs sm:text-sm text-slate-300">
        {checked ? (
          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        )}
        <span className={checked ? "line-through text-slate-400" : ""}>{children}</span>
      </li>
    );
  }

  return <li className="leading-relaxed">{children}</li>;
};
