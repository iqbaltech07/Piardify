"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Loader2, FileText, DollarSign } from "lucide-react";
import { useGenerateForm } from "./hooks/useGenerateForm";
import ProgressBar from "./components/ProgressBar";
import Step1Idea from "./components/Step1Idea";
import Step2TechStack from "./components/Step2TechStack";
import { getDynamicStep3Questions } from "./components/Step3Questions";
import { Step } from "./types";

/* Shared button style tokens */
const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "11px 24px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-signal)",
  background: "var(--color-signal)",
  color: "var(--color-graphite)",
  fontFamily: "var(--font-mono)",
  fontWeight: 700, fontSize: "11px",
  letterSpacing: "0.1em", textTransform: "uppercase",
  cursor: "pointer",
  transition: "opacity 0.15s",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "11px 20px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-strong)",
  background: "transparent",
  color: "var(--fg-secondary)",
  fontFamily: "var(--font-mono)",
  fontWeight: 600, fontSize: "11px",
  letterSpacing: "0.08em", textTransform: "uppercase",
  cursor: "pointer",
  transition: "border-color 0.15s, color 0.15s",
};

export default function GeneratePage() {
  const router = useRouter();
  const {
    step, setStep,
    subStep, setSubStep,
    loading, setLoading,
    questionsLoading,
    form,
    setStack,
    setAppName, setAppIdea, setStackMode,
    setDesignData,
    fetchDynamicQuestions, setDynamicAnswer,
  } = useGenerateForm();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const selectedStacksCount = Object.values(form.stacks).filter((v) => v !== "").length;
  const canProceedStep1 = form.appIdea.length >= 20 && form.appName.length >= 2;
  const canProceedStep2 = form.stackMode === "ai" || selectedStacksCount === 4;

  const step3Questions = getDynamicStep3Questions(form, setDynamicAnswer);
  const currentQ = step3Questions.length > 0 ? step3Questions[subStep] : null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        if (res.status === 401) { router.push("/login"); return; }
        const data = await res.json();
        if (data.error === "LIMIT_REACHED") {
          setShowUpgradeModal(true);
          setLoading(false);
          return;
        }
        throw new Error("Failed to create project");
      }
      const data = await res.json();
      setTimeout(() => router.push(`/detail?projectId=${data.projectId}`), 2200);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-ink)" }} className="bg-grid-dense">

      {/* ── Top nav ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px",
        borderBottom: "1px solid var(--border-hairline)",
        background: "rgba(16,24,43,0.94)",
        backdropFilter: "blur(12px)",
      }}>
        <Link href="/" id="gen-back-home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image src="/piardify-logo.svg" alt="Piardify" width={800} height={200} style={{ height: "28px", width: "auto" }} />
        </Link>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600,
          color: "var(--fg-muted)", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          Step {step} / 3
        </span>
      </div>

      {/* ── Main form area ── */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 28px 80px" }}>
        <ProgressBar step={step} />

        {/* STEP 1 */}
        {step === 1 && (
          <Step1Idea
            appName={form.appName}
            appIdea={form.appIdea}
            designData={form.designData}
            setAppName={setAppName}
            setAppIdea={setAppIdea}
            setDesignData={setDesignData}
          />
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Step2TechStack
            stackMode={form.stackMode}
            stacks={form.stacks}
            setStackMode={setStackMode}
            setStack={setStack}
          />
        )}

        {/* STEP 3 */}
        {step === 3 && !loading && !questionsLoading && currentQ && (
          <div>
            {/* Sub-step progress dots */}
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {step3Questions.map((_, i) => (
                <div key={i} style={{
                  height: 2, flex: 1,
                  borderRadius: 1,
                  background: i < subStep
                    ? "var(--color-signal)"
                    : i === subStep
                      ? "var(--color-circuit)"
                      : "var(--border-hairline)",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--fg-muted)", marginBottom: 20, letterSpacing: "0.06em" }}>
              Question {subStep + 1} of {step3Questions.length}
            </div>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 10px",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-xs)",
              fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "var(--color-circuit)", marginBottom: 12,
            }}>
              Step 03 / Personalize
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem", fontWeight: 800,
              color: "var(--fg-primary)", marginBottom: 8,
              letterSpacing: "-0.02em",
            }}>
              {currentQ.title}
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-mist)", marginBottom: 24, lineHeight: 1.6 }}>
              {currentQ.subtitle}
            </p>
            {currentQ.render()}
          </div>
        )}

        {/* Loading */}
        {(loading || questionsLoading) && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-signal)",
              background: "rgba(255,182,39,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
              animation: "spin 0.8s linear infinite",
            }}>
              <Loader2 size={24} style={{ color: "var(--color-signal)" }} strokeWidth={2} />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--fg-primary)", marginBottom: 8 }}>
              {questionsLoading ? "Analyzing your idea…" : "Generating your PRD…"}
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-mist)" }}>
              {questionsLoading ? "AI is preparing tailored questions" : "AI is crafting your personalized document"}
            </p>
          </div>
        )}

        {/* Nav buttons */}
        {!loading && !questionsLoading && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
            <button
              id="btn-back"
              onClick={() => {
                if (step === 1) return;
                if (step === 3 && subStep > 0) { setSubStep((s: number) => s - 1); return; }
                setStep((s: number) => (s - 1) as Step);
                if (step === 3) setSubStep(0);
              }}
              style={{
                ...btnGhost,
                visibility: step === 1 ? "hidden" : "visible",
              }}
            >
              ← Back
            </button>

            {step < 3 && (
              <button
                id="btn-next"
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                onClick={async () => {
                  if (step === 2) await fetchDynamicQuestions();
                  setStep((s: number) => (s + 1) as Step);
                }}
                style={{
                  ...btnPrimary,
                  opacity: (step === 1 ? !canProceedStep1 : !canProceedStep2) ? 0.35 : 1,
                  cursor: (step === 1 ? !canProceedStep1 : !canProceedStep2) ? "not-allowed" : "pointer",
                }}
              >
                Continue →
              </button>
            )}

            {step === 3 && subStep < step3Questions.length - 1 && (
              <button
                id="btn-next-q"
                disabled={!currentQ?.canProceed()}
                onClick={() => setSubStep((s: number) => s + 1)}
                style={{
                  ...btnPrimary,
                  opacity: !currentQ?.canProceed() ? 0.35 : 1,
                  cursor: !currentQ?.canProceed() ? "not-allowed" : "pointer",
                }}
              >
                Next Question →
              </button>
            )}

            {step === 3 && subStep === step3Questions.length - 1 && (
              <button
                id="btn-generate"
                disabled={!currentQ?.canProceed()}
                onClick={handleGenerate}
                style={{
                  ...btnPrimary,
                  opacity: !currentQ?.canProceed() ? 0.35 : 1,
                  cursor: !currentQ?.canProceed() ? "not-allowed" : "pointer",
                  gap: 8,
                }}
              >
                <FileText size={13} strokeWidth={2.5} />
                Generate PRD
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Upgrade Modal ── */}
      {showUpgradeModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(8,11,20,0.85)",
          backdropFilter: "blur(4px)",
          padding: 16,
        }}>
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-lg)",
            maxWidth: 400, width: "100%",
            overflow: "hidden",
          }}>
            <div aria-hidden="true" style={{ height: 2, background: "var(--color-signal)" }} />
            <div style={{ padding: "28px 28px 24px" }}>
              <div style={{
                width: 40, height: 40,
                border: "1px solid var(--border-hairline)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-elevated)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--color-signal)", marginBottom: 16,
              }}>
                <DollarSign size={18} />
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--color-signal)", marginBottom: 8,
              }}>
                Quota Limit Reached
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "var(--fg-primary)", marginBottom: 8 }}>
                Monthly Limit Reached
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-mist)", marginBottom: 24, lineHeight: 1.65 }}>
                Free plan: 1 generate/month. Pro plan: 3 generates/month. Upgrade to continue building.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  style={{ ...btnGhost, flex: 1, justifyContent: "center" }}
                >
                  Maybe later
                </button>
                <button style={{ ...btnPrimary, flex: 1, justifyContent: "center" }}>
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: var(--fg-muted); font-family: var(--font-body); }
        input:focus, textarea:focus {
          border-color: var(--color-signal) !important;
          outline: none;
        }
        select:focus { outline: none; }
        select option { background: var(--bg-elevated); color: var(--fg-primary); }
      `}</style>
    </div>
  );
}
