"use client";

import React from "react";

interface TableBlockProps {
  children?: React.ReactNode;
}

export const TableBlock: React.FC<TableBlockProps> = ({ children }) => {
  return (
    <div className="my-5 w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-lg">
      <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <thead className="bg-indigo-950/40 text-slate-200 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800 sticky top-0 backdrop-blur-md">
    {children}
  </thead>
);

export const TableBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
    {children}
  </tbody>
);

export const TableRow: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <tr className="hover:bg-indigo-950/20 transition-colors duration-150 even:bg-slate-900/30">
    {children}
  </tr>
);

export const TableCell: React.FC<{ children?: React.ReactNode; isHeader?: boolean }> = ({
  children,
  isHeader = false,
}) => {
  if (isHeader) {
    return <th className="px-4 py-3 font-semibold text-indigo-300 whitespace-nowrap">{children}</th>;
  }
  return <td className="px-4 py-2.5 leading-relaxed">{children}</td>;
};
