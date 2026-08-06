import React, { useState } from "react";
import { FormData, DynamicQuestion } from "../types";
import { Plus, X, Edit3 } from "lucide-react";

function QuestionItemRenderer({
  q,
  form,
  setDynamicAnswer,
}: {
  q: DynamicQuestion;
  form: FormData;
  setDynamicAnswer: (key: string, value: string | string[], type: "single" | "multiple") => void;
}) {
  const isMultiple = q.type === "multiple";
  const currentAns = form.dynamicAnswers[q.key];

  const [customText, setCustomText] = useState("");

  // Single choice logic
  const isPresetSelected = typeof currentAns === "string" && q.options.includes(currentAns);
  const isCustomSingleSelected = typeof currentAns === "string" && currentAns !== "" && !isPresetSelected;

  // Multiple choice logic
  const selectedArr = Array.isArray(currentAns) ? currentAns : [];
  const customMultipleAnswers = selectedArr.filter((item) => !q.options.includes(item));

  const handleAddMultipleCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    if (!selectedArr.includes(trimmed)) {
      setDynamicAnswer(q.key, trimmed, "multiple");
    }
    setCustomText("");
  };

  const handleRemoveMultipleTag = (tag: string) => {
    setDynamicAnswer(q.key, tag, "multiple");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Preset options */}
      <div style={{ display: "flex", flexDirection: isMultiple ? "row" : "column", flexWrap: "wrap", gap: 8 }}>
        {q.options.map((opt) => {
          const isSelected = isMultiple
            ? selectedArr.includes(opt)
            : currentAns === opt;

          return (
            <button
              key={opt}
              id={`q-${q.key}-${opt.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => {
                setDynamicAnswer(q.key, opt, q.type);
              }}
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

        {/* Selected Custom Tags for Multiple choice */}
        {isMultiple && customMultipleAnswers.map((customTag) => (
          <div
            key={customTag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 600,
              background: "rgba(79,209,197,0.12)",
              border: "1px solid rgba(79,209,197,0.35)",
              color: "var(--color-circuit)",
            }}
          >
            <span>{customTag}</span>
            <button
              type="button"
              onClick={() => handleRemoveMultipleTag(customTag)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-circuit)",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Manual Input Section */}
      <div
        style={{
          borderTop: "1px dashed var(--border-hairline)",
          paddingTop: 14,
          marginTop: 4,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 700,
            color: "var(--fg-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          <Edit3 size={11} style={{ color: "var(--color-signal)" }} />
          Input Manual / Kustom
        </label>

        {!isMultiple ? (
          /* Single choice custom input */
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Atau ketik jawaban kustom kamu sendiri di sini..."
              value={isCustomSingleSelected ? (currentAns as string) : customText}
              onChange={(e) => {
                const val = e.target.value;
                setCustomText(val);
                if (val.trim()) {
                  setDynamicAnswer(q.key, val, "single");
                } else {
                  setDynamicAnswer(q.key, "", "single");
                }
              }}
              style={{
                flex: 1,
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${
                  isCustomSingleSelected ? "var(--color-signal)" : "var(--border-hairline)"
                }`,
                background: isCustomSingleSelected
                  ? "rgba(255,182,39,0.08)"
                  : "var(--bg-surface)",
                color: "var(--fg-primary)",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        ) : (
          /* Multiple choice custom input */
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Tulis opsi kustom lalu tekan Enter / Tambah..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddMultipleCustom();
                }
              }}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-hairline)",
                background: "var(--bg-surface)",
                color: "var(--fg-primary)",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={handleAddMultipleCustom}
              disabled={!customText.trim()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-circuit)",
                background: customText.trim() ? "rgba(79,209,197,0.12)" : "var(--bg-elevated)",
                color: customText.trim() ? "var(--color-circuit)" : "var(--fg-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: customText.trim() ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
                opacity: customText.trim() ? 1 : 0.6,
              }}
            >
              <Plus size={13} /> Tambah
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
        return typeof ans === "string" && ans.trim() !== "";
      },
      render: () => (
        <QuestionItemRenderer
          key={q.key}
          q={q}
          form={form}
          setDynamicAnswer={setDynamicAnswer}
        />
      ),
    };
  });
};
