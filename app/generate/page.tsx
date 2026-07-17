"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Loader2, DollarSign } from "lucide-react";
import { useGenerateForm } from "./hooks/useGenerateForm";
import ProgressBar from "./components/ProgressBar";
import Step1Idea from "./components/Step1Idea";
import Step2TechStack from "./components/Step2TechStack";
import { getStep3Questions } from "./components/Step3Questions";
import { Step } from "./types";

export default function GeneratePage() {
  const router = useRouter();
  const {
    step, setStep,
    subStep, setSubStep,
    loading, setLoading,
    form, setForm,
    setStack, toggleFeature, toggleIntegration,
    setAppName, setAppIdea, setStackMode
  } = useGenerateForm();

  const selectedStacksCount = Object.values(form.stacks).filter(v => v !== "").length;
  const canProceedStep1 = form.appIdea.length >= 20 && form.appName.length >= 2;
  const canProceedStep2 = form.stackMode === "ai" || selectedStacksCount === 4;

  const step3Questions = getStep3Questions(form, setForm, toggleFeature, toggleIntegration);
  const currentQ = step3Questions[subStep];
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {

        const res = await fetch("/api/projects/create", { 
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(form)
        });
        
        if (!res.ok) {
           if (res.status === 401) {
               router.push("/login");
               return;
           }
           const data = await res.json();
           if (data.error === "LIMIT_REACHED") {
               setShowUpgradeModal(true);
               setLoading(false);
               return;
           }
           throw new Error("Failed to create project");
        }

        const data = await res.json();
        
        setTimeout(() => router.push(`/struktur?projectId=${data.projectId}`), 2200);
    } catch (e) {
        setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }} className="bg-grid">
      {/* Top nav */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(8,11,20,0.9)", backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/" id="gen-back-home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/logo.png"
            alt="Piardify"
            width={143}
            height={80}
            style={{ height: "51px", width: "auto" }}
          />
        </Link>
        <span style={{ fontSize: "12px", color: "var(--fg-muted)" }}>Step {step} of 3</span>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "100px 32px 80px" }}>
        <ProgressBar step={step} />

        {/* STEP 1 */}
        {step === 1 && (
          <Step1Idea
            appName={form.appName}
            appIdea={form.appIdea}
            setAppName={setAppName}
            setAppIdea={setAppIdea}
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
        {step === 3 && !loading && (
          <div>
            {/* Sub-step dots */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
              {step3Questions.map((_, i) => (
                <div key={i} style={{
                  height: "3px", flex: 1, borderRadius: "2px", transition: "all 0.3s",
                  background: i < subStep ? "var(--indigo-500)" : i === subStep ? "linear-gradient(90deg, var(--indigo-500), var(--blue-400))" : "var(--bg-elevated)",
                  border: i > subStep ? "1px solid var(--border-subtle)" : "none",
                }} />
              ))}
            </div>
            <div style={{ fontSize: "12px", color: "var(--fg-muted)", marginBottom: "24px" }}>
              Question {subStep + 1} of {step3Questions.length}
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "8px" }}>{currentQ.title}</h2>
            <p style={{ fontSize: "14px", color: "var(--fg-secondary)", marginBottom: "28px" }}>{currentQ.subtitle}</p>
            {currentQ.render()}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))", boxShadow: "0 0 32px rgba(99,102,241,0.5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", animation: "spin 1s linear infinite" }}>
              <Loader2 size={28} color="white" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "8px" }}>Generating your PRD...</h3>
            <p style={{ fontSize: "14px", color: "var(--fg-secondary)" }}>AI is crafting your personalized document</p>
          </div>
        )}

        {/* Nav buttons */}
        {!loading && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
            <button
              id="btn-back"
              onClick={() => {
                if (step === 1) return;
                if (step === 3 && subStep > 0) { setSubStep((s: number) => s - 1); return; }
                setStep((s: number) => (s - 1) as Step);
                if (step === 3) setSubStep(0);
              }}
              style={{
                padding: "12px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 600,
                cursor: "pointer", transition: "opacity 0.15s",
                background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--fg-secondary)",
                visibility: step === 1 ? "hidden" : "visible",
              }}
            >← Back</button>

            {step < 3 && (
              <button id="btn-next"
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                onClick={() => setStep((s: number) => (s + 1) as Step)}
                style={{
                  padding: "12px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s", color: "white",
                  background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                  border: "none", opacity: (step === 1 ? !canProceedStep1 : !canProceedStep2) ? 0.4 : 1,
                }}
              >Continue →</button>
            )}
            {step === 3 && subStep < step3Questions.length - 1 && (
              <button id="btn-next-q"
                disabled={!currentQ.canProceed()}
                onClick={() => setSubStep((s: number) => s + 1)}
                style={{
                  padding: "12px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", color: "white",
                  background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                  border: "none", opacity: !currentQ.canProceed() ? 0.4 : 1,
                }}
              >Next Question →</button>
            )}
            {step === 3 && subStep === step3Questions.length - 1 && (
              <button id="btn-generate"
                disabled={!currentQ.canProceed()}
                onClick={handleGenerate}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "12px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", color: "white",
                  background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                  boxShadow: "0 0 24px rgba(99,102,241,0.4)", border: "none",
                  opacity: !currentQ.canProceed() ? 0.4 : 1,
                }}
              >Generate PRD</button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: var(--fg-muted); }
        input:focus, textarea:focus { border-color: var(--indigo-500) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      `}</style>
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
             <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-xl mb-4">
                <DollarSign size={24} strokeWidth={2} />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">Batas Kuota Tercapai</h2>
             <p className="text-slate-400 text-sm mb-6">
                Anda telah mencapai limit bulanan. Plan Free mendapatkan 1x kuota generate per bulan, sedangkan plan Pro mendapatkan 3x generate per bulan.
             </p>
             <div className="flex gap-3">
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Maybe later
                </button>
                <button 
                  className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-indigo-500/20"
                >
                  Upgrade Now
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
