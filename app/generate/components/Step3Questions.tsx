import React from "react";
import { FormData } from "../types";

export const getDynamicStep3Questions = (
  form: FormData,
  setDynamicAnswer: (key: string, value: string | string[], type: "single" | "multiple") => void
) => {
  return form.dynamicQuestions.map((q) => {
    const isMultiple = q.type === "multiple";

    return {
      key: q.key,
      title: q.title,
      subtitle: q.subtitle,
      canProceed: () => {
        const ans = form.dynamicAnswers[q.key];
        if (isMultiple) return Array.isArray(ans) && ans.length > 0;
        return typeof ans === "string" && ans !== "";
      },
      render: () => {
        const currentAns = form.dynamicAnswers[q.key];

        return (
          <div style={{ display: "flex", flexDirection: isMultiple ? "row" : "column", flexWrap: "wrap", gap: isMultiple ? 8 : 8 }}>
            {q.options.map((opt) => {
              const isSelected = isMultiple
                ? Array.isArray(currentAns) && currentAns.includes(opt)
                : currentAns === opt;

              return (
                <button
                  key={opt}
                  id={`q-${q.key}-${opt.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => setDynamicAnswer(q.key, opt, q.type)}
                  style={{
                    width: isMultiple ? "auto" : "100%",
                    textAlign: "left",
                    padding: isMultiple ? "7px 14px" : "13px 16px",
                    borderRadius: "var(--radius-md)",
                    fontFamily: isMultiple ? "var(--font-mono)" : "var(--font-body)",
                    fontSize: isMultiple ? "11px" : "13px",
                    fontWeight: isMultiple ? 600 : 500,
                    letterSpacing: isMultiple ? "0.04em" : "normal",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background: isSelected ? "rgba(255,182,39,0.1)" : "var(--bg-elevated)",
                    border: `1px solid ${isSelected ? "var(--color-signal)" : "var(--border-hairline)"}`,
                    color: isSelected ? "var(--color-signal)" : "var(--fg-secondary)",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );
      },
    };
  });
};
