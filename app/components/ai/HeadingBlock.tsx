"use client";

import React from "react";
import { Link2 } from "lucide-react";

interface HeadingBlockProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({ level, children }) => {
  const textContent = React.Children.toArray(children).join("");
  const id = textContent
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const styles = {
    1: "text-xl sm:text-2xl font-bold text-slate-100 border-b border-indigo-500/20 pb-2 mt-6 mb-4 tracking-tight",
    2: "text-lg sm:text-xl font-bold text-slate-100 mt-5 mb-3 tracking-tight",
    3: "text-base sm:text-lg font-semibold text-indigo-300 mt-4 mb-2",
    4: "text-sm sm:text-base font-semibold text-purple-300 mt-3 mb-2",
    5: "text-xs sm:text-sm font-semibold text-slate-300 mt-2 mb-1",
    6: "text-xs font-semibold text-slate-400 mt-2 mb-1 uppercase tracking-wider",
  }[level];

  const content = (
    <>
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 hover:text-indigo-200"
          aria-label="Link to heading"
        >
          <Link2 className="w-3.5 h-3.5" />
        </a>
      )}
    </>
  );

  const className = `group flex items-center gap-2 ${styles}`;

  switch (level) {
    case 1:
      return <h1 id={id} className={className}>{content}</h1>;
    case 2:
      return <h2 id={id} className={className}>{content}</h2>;
    case 3:
      return <h3 id={id} className={className}>{content}</h3>;
    case 4:
      return <h4 id={id} className={className}>{content}</h4>;
    case 5:
      return <h5 id={id} className={className}>{content}</h5>;
    case 6:
      return <h6 id={id} className={className}>{content}</h6>;
    default:
      return <h2 id={id} className={className}>{content}</h2>;
  }
};
