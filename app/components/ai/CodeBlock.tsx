"use client";

import React, { useState, useEffect } from "react";
import { CopyButton } from "./CopyButton";
import { Code2 } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  code: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = "text",
  code,
  showLineNumbers = true,
}) => {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const cleanCode = code.trimEnd();
  const lang = language.toLowerCase().replace("language-", "") || "code";

  useEffect(() => {
    let isMounted = true;
    async function highlight() {
      try {
        const { codeToHtml } = await import("shiki");
        const html = await codeToHtml(cleanCode, {
          lang: lang === "code" || lang === "text" ? "txt" : lang,
          theme: "github-dark-dimmed",
        });
        if (isMounted) setHighlightedHtml(html);
      } catch (err) {
        // Fallback to unhighlighted if Shiki fails or language not supported
        if (isMounted) setHighlightedHtml(null);
      }
    }
    highlight();
    return () => {
      isMounted = false;
    };
  }, [cleanCode, lang]);

  const lines = cleanCode.split("\n");

  return (
    <div className="group relative my-4 rounded-xl border border-slate-800 bg-[#0d1117] overflow-hidden shadow-xl transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121318]/90 border-b border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            {lang}
          </span>
        </div>
        <CopyButton content={cleanCode} label="Copy" />
      </div>

      {/* Code body */}
      <div className="relative overflow-x-auto text-[13px] font-mono leading-6 p-4">
        {highlightedHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            className="shiki-container [&>pre]:bg-transparent! [&>pre]:p-0! [&>pre]:m-0! overflow-x-auto"
          />
        ) : (
          <div className="flex">
            {showLineNumbers && (
              <div className="select-none pr-4 text-right text-slate-600 border-r border-slate-800/60 font-mono text-xs leading-6 min-w-10">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
            )}
            <pre className={`pl-4 text-slate-200 overflow-x-auto ${!showLineNumbers ? "pl-0" : ""}`}>
              <code>{cleanCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
