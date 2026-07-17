"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sprout, Compass, PenLine, LayoutList, Lightbulb,
  Map, Timer, Telescope, Trophy, Wrench,
  CheckCircle2, PartyPopper, Award, ArrowRight,
  Check, Loader2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Types ─── */
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimasi: string;
  tags: string[];
}

interface Phase {
  id: string;
  name: string;
  icon: string;
  description: string;
  tasks: Task[];
}

interface TaskData {
  phases: Phase[];
}

/* ─── Lucide icon map for ranks ─── */
const RANK_ICONS: Record<string, LucideIcon> = {
  Sprout, Compass, PenLine, LayoutList, Lightbulb,
  Map, Timer, Telescope, Trophy, Wrench,
};

/* ─── Priority Config ─── */
const priorityConfig = {
  high: { label: "High", color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
  medium: { label: "Medium", color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)" },
  low: { label: "Low", color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.25)" },
};

/* ─── StepNavbar ─── */
function StepNavbar({ projectId }: { projectId: string | null }) {
  const steps = [
    { id: "struktur", label: "Struktur", href: `/struktur${projectId ? `?projectId=${projectId}` : ""}` },
    { id: "prd", label: "PRD", href: `/preview${projectId ? `?projectId=${projectId}` : ""}` },
    { id: "task", label: "Task", href: `/task${projectId ? `?projectId=${projectId}` : ""}` },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {steps.map((step, i) => {
        const isDone = step.id !== "task";
        const isActive = step.id === "task";
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <Link href={isDone || isActive ? step.href : "#"} style={{ textDecoration: "none", pointerEvents: isDone || isActive ? "auto" : "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "4px 10px", borderRadius: "6px",
                background: "transparent",
                transition: "background 0.2s",
              }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 700, flexShrink: 0,
                  background: isDone || isActive ? "#6366f1" : "transparent",
                  color: isDone || isActive ? "white" : "var(--fg-muted)",
                  border: isDone || isActive ? "2px solid #6366f1" : "1.5px solid var(--border-default)",
                  boxSizing: "border-box",
                }}>
                  {isDone ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: "12px", fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--fg-primary)" : isDone ? "#818cf8" : "var(--fg-muted)",
                  letterSpacing: "0.01em",
                }}>
                  {step.label}
                </span>
              </div>
            </Link>
            {i < steps.length - 1 && (
              <div style={{
                width: "28px", height: "1.5px", flexShrink: 0,
                background: isDone
                  ? "linear-gradient(90deg, #6366f1, #818cf8)"
                  : "var(--border-subtle)",
                borderRadius: "2px",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Task Card ─── */
function TaskCard({ task, checked, onToggle }: { task: Task; checked: boolean; onToggle: () => void }) {
  const p = priorityConfig[task.priority] || priorityConfig.medium;
  return (
    <div
      style={{
        display: "flex", gap: "12px", padding: "16px",
        borderRadius: "12px", border: "1px solid var(--border-subtle)",
        background: checked ? "rgba(99,102,241,0.04)" : "var(--bg-surface)",
        transition: "all 0.2s", opacity: checked ? 0.6 : 1,
        cursor: "pointer",
      }}
      onClick={onToggle}
    >
      {/* Checkbox */}
      <div style={{
        width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0, marginTop: "1px",
        border: checked ? "none" : "1.5px solid var(--border-default)",
        background: checked ? "var(--indigo-500)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {checked && (
          <Check size={10} strokeWidth={3} color="white" />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
          <h4 style={{
            fontSize: "14px", fontWeight: 600, color: "var(--fg-primary)",
            textDecoration: checked ? "line-through" : "none",
            lineHeight: 1.4,
          }}>
            {task.title}
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <span style={{
              fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
              background: p.bg, color: p.color, border: `1px solid ${p.border}`,
            }}>
              {p.label}
            </span>
            <span style={{ fontSize: "11px", color: "var(--fg-muted)", whiteSpace: "nowrap" }}>
              {task.estimasi}
            </span>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "var(--fg-muted)", lineHeight: 1.6, marginBottom: "8px" }}>
          {task.description}
        </p>

        {task.tags && task.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {task.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px",
                background: "rgba(99,102,241,0.08)", color: "var(--indigo-400)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Celebration Modal ─── */
interface FinishResult {
  expGained: number;
  newExp: number;
  rank: { id: number; name: string; icon: string; color: string };
}

function CelebrationModal({ result, onClose }: { result: FinishResult; onClose: () => void }) {
  const RankIcon = RANK_ICONS[result.rank.icon] ?? Award;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(8,11,20,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{
        background: "var(--bg-surface)", border: "1px solid var(--border-default)",
        borderRadius: "24px", padding: "48px 40px", maxWidth: "420px", width: "100%",
        textAlign: "center", position: "relative",
        boxShadow: "0 0 80px rgba(99,102,241,0.25), 0 40px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)", pointerEvents: "none" }} />

        {/* Party icon */}
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          <PartyPopper size={56} strokeWidth={1.5} style={{ color: "#fbbf24", margin: "0 auto" }} />
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--fg-primary)", marginBottom: "8px" }}>
          Project Selesai! 🎉
        </h2>
        <p style={{ fontSize: "14px", color: "var(--fg-secondary)", marginBottom: "32px" }}>
          Semua task berhasil diselesaikan. EXP kamu telah diperbarui.
        </p>

        {/* EXP Gained */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: "12px", padding: "10px 20px", marginBottom: "24px",
        }}>
          <Award size={18} style={{ color: "#fbbf24" }} />
          <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--indigo-400)" }}>+{result.expGained} EXP</span>
        </div>

        {/* Current Rank */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: "var(--bg-elevated)", borderRadius: "14px", padding: "14px 20px",
          marginBottom: "32px", border: "1px solid var(--border-subtle)",
        }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: result.rank.color,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <RankIcon size={22} color="white" strokeWidth={2} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "11px", color: "var(--fg-muted)", fontWeight: 600, marginBottom: "2px" }}>RANK SAAT INI</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg-primary)" }}>{result.rank.name}</p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <p style={{ fontSize: "11px", color: "var(--fg-muted)", fontWeight: 600, marginBottom: "2px" }}>TOTAL EXP</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--indigo-400)" }}>{result.newExp.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: "12px",
            background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
            color: "var(--fg-secondary)", cursor: "pointer", fontSize: "14px", fontWeight: 600,
          }}>
            Tutup
          </button>
          <Link href="/profile" style={{
            flex: 1, padding: "12px", borderRadius: "12px",
            background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
            color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          }}>
            Lihat Profil <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
function TaskPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [data, setData] = useState<TaskData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [activePhase, setActivePhase] = useState<string>("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<FinishResult | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (hasStarted || !projectId) return;
    setHasStarted(true);

    const generate = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/generate/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });
        if (!res.ok) {
          setError("Gagal membuat task list.");
          return;
        }
        const json = await res.json();
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
          if (json.phases?.[0]?.id) setActivePhase(json.phases[0].id);
        }
      } catch {
        setError("Koneksi ke server gagal.");
      } finally {
        setIsLoading(false);
      }
    };
    generate();
  }, [hasStarted]);

  const toggleTask = (taskId: string) => {
    setChecked(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getProgress = () => {
    if (!data) return { done: 0, total: 0, pct: 0 };
    const allTasks = data.phases.flatMap(p => p.tasks);
    const done = allTasks.filter(t => checked[t.id]).length;
    return { done, total: allTasks.length, pct: allTasks.length ? Math.round((done / allTasks.length) * 100) : 0 };
  };

  const handleFinishProject = async () => {
    if (!projectId || !data || isFinishing) return;
    setIsFinishing(true);
    setFinishError(null);
    try {
      const res = await fetch("/api/projects/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, checkedTasks: checked }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFinishError(json.error || "Gagal menyelesaikan project.");
      } else {
        setIsFinished(true);
        setCelebration(json);
      }
    } catch {
      setFinishError("Koneksi ke server gagal.");
    } finally {
      setIsFinishing(false);
    }
  };

  const handleExport = () => {
    if (!data) return;
    let md = "";
    for (let i = 0; i < data.phases.length; i++) {
      const phase = data.phases[i];
      md += `## ${i + 1}. ${phase.name}\n\n`;
      for (const task of phase.tasks) {
        const check = checked[task.id] ? "[x]" : "[ ]";
        md += `- ${check} **${task.title}** *(${task.estimasi})* — ${task.priority}\n  ${task.description}\n\n`;
      }
    }
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "tasks.md"; a.click();
    URL.revokeObjectURL(url);
  };

  const progress = getProgress();
  const activePhaseData = data?.phases.find(p => p.id === activePhase);
  const allDone = progress.total > 0 && progress.pct === 100;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--fg-primary)" }} className="bg-grid">

      {/* Celebration Modal */}
      {celebration && <CelebrationModal result={celebration} onClose={() => setCelebration(null)} />}

      {/* ── Topbar ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "52px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(8,11,20,0.92)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="Piardify"
              width={143}
              height={80}
              style={{ height: "49px", width: "auto" }}
            />
          </Link>
        </div>

        <StepNavbar projectId={projectId} />

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
          {!isLoading && data && (
            <button
              onClick={handleExport}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                color: "var(--fg-secondary)", cursor: "pointer",
              }}
            >
              ↓ Export .md
            </button>
          )}
          <Link href="/generate"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
              background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
              color: "white", textDecoration: "none",
              boxShadow: "0 0 16px rgba(99,102,241,0.3)",
            }}
          >
            + New Project
          </Link>
        </div>
      </header>

      <div style={{ paddingTop: "52px", display: "flex", height: "100vh" }}>

        {/* ── Left Sidebar: Phase Navigator ── */}
        <aside style={{
          width: "220px", flexShrink: 0, borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)", overflowY: "auto", padding: "20px 0", paddingTop: "28px",
        }}>
          {/* Progress */}
          <div style={{ padding: "0 16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "var(--fg-muted)", fontWeight: 600 }}>PROGRESS</span>
              <span style={{ fontSize: "11px", color: "var(--indigo-400)", fontWeight: 700 }}>{progress.pct}%</span>
            </div>
            <div style={{ height: "4px", borderRadius: "4px", background: "var(--bg-elevated)" }}>
              <div style={{
                height: "100%", borderRadius: "4px",
                background: allDone
                  ? "linear-gradient(90deg, #4ade80, #22c55e)"
                  : "linear-gradient(90deg, var(--indigo-500), var(--blue-500))",
                width: `${progress.pct}%`, transition: "width 0.4s ease",
              }} />
            </div>
            <p style={{ fontSize: "11px", color: "var(--fg-muted)", marginTop: "6px" }}>
              {progress.done} / {progress.total} tasks done
            </p>
          </div>

          {/* Finish Button (sidebar) */}
          {allDone && !isFinished && (
            <div style={{ padding: "0 12px 16px" }}>
              <button
                onClick={handleFinishProject}
                disabled={isFinishing}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg, #4ade80, #22c55e)",
                  color: "#052e16", fontWeight: 700, fontSize: "12px", cursor: isFinishing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  opacity: isFinishing ? 0.7 : 1,
                }}
              >
                <CheckCircle2 size={14} />
                {isFinishing ? "Memproses..." : "Selesai & Klaim EXP"}
              </button>
              {finishError && (
                <p style={{ fontSize: "11px", color: "#f87171", marginTop: "6px", textAlign: "center" }}>{finishError}</p>
              )}
            </div>
          )}

          {isFinished && (
            <div style={{ padding: "0 12px 16px" }}>
              <div style={{
                padding: "10px 12px", borderRadius: "10px",
                background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <CheckCircle2 size={14} style={{ color: "#4ade80" }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#4ade80" }}>Project Selesai!</span>
              </div>
            </div>
          )}

          {/* Phase list */}
          <div style={{ padding: "0 8px" }}>
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ height: "40px", borderRadius: "8px", background: "var(--bg-elevated)", marginBottom: "4px", opacity: 0.5 }} />
              ))
            ) : (
              data?.phases.map((phase, index) => {
                const phaseDone = phase.tasks.filter(t => checked[t.id]).length;
                const isActive = activePhase === phase.id;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    style={{
                      width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: "8px",
                      border: "none", cursor: "pointer", transition: "all 0.15s", marginBottom: "2px",
                      background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                      borderLeft: isActive ? "2px solid var(--indigo-500)" : "2px solid transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: isActive ? "var(--indigo-400)" : "var(--fg-muted)" }}>{index + 1}.</span>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: isActive ? "var(--fg-primary)" : "var(--fg-secondary)" }}>
                          {phase.name}
                        </span>
                      </div>
                      <span style={{ fontSize: "10px", color: "var(--fg-muted)" }}>
                        {phaseDone}/{phase.tasks.length}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 36px 80px" }}>

          {/* Loading */}
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))", boxShadow: "0 0 28px rgba(99,102,241,0.5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", animation: "spin 1s linear infinite" }}>
                <Loader2 size={24} color="white" strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "8px" }}>Membuat Task List...</h3>
              <p style={{ fontSize: "14px", color: "var(--fg-secondary)" }}>AI sedang menganalisis PRD dan menyusun langkah-langkah pengerjaan</p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
              <button onClick={() => { setHasStarted(false); setError(null); }}
                style={{ padding: "10px 24px", borderRadius: "10px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--fg-secondary)", cursor: "pointer", fontSize: "14px" }}>
                Coba Lagi
              </button>
            </div>
          )}

          {/* All Done Banner */}
          {allDone && !isFinished && !isLoading && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderRadius: "14px", marginBottom: "24px",
              background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={20} style={{ color: "#4ade80", flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: "14px", color: "#4ade80" }}>Semua task selesai!</p>
                  <p style={{ fontSize: "12px", color: "var(--fg-muted)" }}>Klaim EXP kamu sekarang untuk menyelesaikan project ini.</p>
                </div>
              </div>
              <button
                onClick={handleFinishProject}
                disabled={isFinishing}
                style={{
                  padding: "10px 20px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg, #4ade80, #22c55e)",
                  color: "#052e16", fontWeight: 700, fontSize: "13px",
                  cursor: isFinishing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "8px",
                  whiteSpace: "nowrap", flexShrink: 0,
                  opacity: isFinishing ? 0.7 : 1,
                }}
              >
                <Award size={14} />
                {isFinishing ? "Memproses..." : "Finish & Klaim +100 EXP"}
              </button>
            </div>
          )}

          {/* Phase Content */}
          {activePhaseData && !isLoading && (
            <div>
              {/* Phase Header */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--indigo-500)" }}>
                    {(data?.phases.findIndex(p => p.id === activePhase) ?? 0) + 1}.
                  </span>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--fg-primary)" }}>
                    {activePhaseData.name}
                  </h2>
                  <span style={{ fontSize: "12px", color: "var(--fg-muted)", padding: "3px 10px", borderRadius: "20px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                    {activePhaseData.tasks.filter(t => checked[t.id]).length}/{activePhaseData.tasks.length} selesai
                  </span>
                </div>
                <p style={{ fontSize: "14px", color: "var(--fg-secondary)" }}>{activePhaseData.description}</p>
              </div>

              {/* Task Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activePhaseData.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    checked={!!checked[task.id]}
                    onToggle={() => toggleTask(task.id)}
                  />
                ))}
              </div>

              {/* Phase navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
                {data && data.phases.findIndex(p => p.id === activePhase) > 0 && (
                  <button
                    onClick={() => {
                      const idx = data.phases.findIndex(p => p.id === activePhase);
                      setActivePhase(data.phases[idx - 1].id);
                    }}
                    style={{ padding: "10px 20px", borderRadius: "10px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--fg-secondary)", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
                  >
                    ← Phase Sebelumnya
                  </button>
                )}
                {data && data.phases.findIndex(p => p.id === activePhase) < data.phases.length - 1 && (
                  <button
                    onClick={() => {
                      const idx = data.phases.findIndex(p => p.id === activePhase);
                      setActivePhase(data.phases[idx + 1].id);
                    }}
                    style={{ marginLeft: "auto", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))", border: "none", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
                  >
                    Phase Berikutnya →
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        aside::-webkit-scrollbar { width: 4px; }
        aside::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 4px; }
        main::-webkit-scrollbar { width: 6px; }
        main::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
      `}</style>
    </div>
  );
}

export default function TaskPage() {
  return (
    <Suspense fallback={<div style={{minHeight: "100vh", background: "var(--bg-base)"}} />}>
      <TaskPageContent />
    </Suspense>
  );
}
