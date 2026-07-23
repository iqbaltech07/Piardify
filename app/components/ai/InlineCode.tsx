"use client";

import React from "react";

interface InlineCodeProps {
  children?: React.ReactNode;
  className?: string;
}

export const InlineCode: React.FC<InlineCodeProps> = ({ children, className = "" }) => {
  return (
    <code
      className={`px-1.5 py-0.5 mx-0.5 text-[12px] font-mono rounded-md bg-indigo-950/40 text-purple-300 border border-indigo-500/25 tracking-tight inline-block select-all ${className}`}
    >
      {children}
    </code>
  );
};
