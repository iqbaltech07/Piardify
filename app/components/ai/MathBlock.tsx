"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathBlockProps {
  math: string;
  block?: boolean;
}

export const MathBlock: React.FC<MathBlockProps> = ({ math, block = false }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (err) {
      console.warn("KaTeX render error:", err);
      return null;
    }
  }, [math, block]);

  if (!html) {
    return (
      <code className="text-xs font-mono text-pink-400 bg-pink-950/30 px-1 py-0.5 rounded">
        {block ? `$$ ${math} $$` : `$${math}$`}
      </code>
    );
  }

  if (block) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="my-4 py-3 px-4 rounded-xl bg-[#121318]/60 border border-slate-800 text-center overflow-x-auto text-slate-100 shadow-inner"
      />
    );
  }

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className="inline-block px-1 text-slate-100"
    />
  );
};
