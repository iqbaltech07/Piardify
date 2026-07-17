import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import ProfileProjects from "./ProfileProjects";
import {
  getRank,
  getNextRank,
  getRankProgress,
  getExpToNextRank,
  RANKS,
} from "@/lib/gamification";
import {
  Sprout, Compass, PenLine, LayoutList, Lightbulb,
  Map, Timer, Telescope, Trophy, Wrench,
  Award, Calendar, FolderOpen, CheckCircle2,
  TrendingUp, Lock, ChevronRight,
} from "lucide-react";

/* ─── Rank icon map ─── */
const RANK_ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  Sprout, Compass, PenLine, LayoutList, Lightbulb,
  Map, Timer, Telescope, Trophy, Wrench,
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) redirect("/login");

  const userDb = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true, exp: true, createdAt: true },
  });

  const tier = userDb?.tier || "FREE";
  const exp = userDb?.exp ?? 0;
  const joinDate = userDb?.createdAt ?? new Date();

  const rank = getRank(exp);
  const nextRank = getNextRank(exp);
  const rankProgress = getRankProgress(exp);
  const expToNext = getExpToNextRank(exp);

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const finishedProjects = projects.filter((p) => p.status === "FINISHED");
  const inProgressProjects = projects.filter((p) => p.status !== "FINISHED");

  const prdLimit = tier === "PRO" ? 3 : 1;
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const projectsThisMonth = projects.filter(p => new Date(p.createdAt) >= firstDayOfMonth).length;

  const RankIconComponent = RANK_ICON_MAP[rank.icon] ?? Star;

  const joinDateFormatted = new Date(joinDate).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--fg-primary)" }}>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "160px 24px 80px" }}>

        {/* ══════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════ */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "24px", padding: "40px", marginBottom: "24px",
        }}>
          {/* Decorative glow orbs */}
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: "32px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || ""}
                  style={{ width: "96px", height: "96px", borderRadius: "50%", border: "3px solid rgba(99,102,241,0.4)", boxShadow: "0 0 40px rgba(99,102,241,0.3)" }}
                />
              ) : (
                <div style={{
                  width: "96px", height: "96px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "36px", fontWeight: 800, color: "white",
                  border: "3px solid rgba(99,102,241,0.4)", boxShadow: "0 0 40px rgba(99,102,241,0.3)",
                }}>
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
              {/* Rank badge on avatar */}
              <div style={{
                position: "absolute", bottom: "-4px", right: "-4px",
                width: "32px", height: "32px", borderRadius: "50%",
                background: rank.color, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(0,0,0,0.4)", border: "2px solid var(--bg-surface)",
              }}>
                <RankIconComponent size={14} color="white" strokeWidth={2.5} />
              </div>
            </div>

            {/* User Info */}
            <div style={{ flex: 1, minWidth: "240px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--fg-primary)", margin: 0 }}>
                  {session.user.name}
                </h1>
                <span style={{
                  padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  background: tier === "PRO"
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                  color: "white",
                }}>
                  {tier}
                </span>
              </div>
              <p style={{ color: "var(--fg-muted)", fontSize: "14px", marginBottom: "16px" }}>
                {session.user.email}
              </p>

              {/* Join date */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--fg-muted)", fontSize: "13px" }}>
                <Calendar size={14} />
                <span>Bergabung sejak {joinDateFormatted}</span>
              </div>
            </div>

            {/* Rank Card */}
            <div style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
              borderRadius: "18px", padding: "20px 24px", minWidth: "260px",
            }}>
              {/* Current Rank */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: rank.color, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}>
                  <RankIconComponent size={24} color="white" strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--fg-muted)", letterSpacing: "0.08em", marginBottom: "2px" }}>RANK SAAT INI</p>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--fg-primary)", margin: 0 }}>{rank.name}</p>
                </div>
              </div>

              {/* EXP */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "var(--fg-muted)", fontWeight: 600 }}>
                  {exp.toLocaleString("id-ID")} EXP
                </span>
                <span style={{ fontSize: "12px", color: "var(--fg-secondary)" }}>
                  {nextRank ? `${nextRank.minExp.toLocaleString("id-ID")} EXP` : "MAX"}
                </span>
              </div>

              {/* EXP Progress Bar */}
              <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{
                  height: "100%", borderRadius: "999px",
                  background: rank.color,
                  width: `${rankProgress}%`,
                  transition: "width 0.6s ease",
                  boxShadow: `0 0 12px rgba(99,102,241,0.5)`,
                }} />
              </div>

              {nextRank ? (
                <p style={{ fontSize: "11px", color: "var(--fg-muted)" }}>
                  <span style={{ color: "var(--indigo-400)", fontWeight: 700 }}>{expToNext} EXP</span> lagi untuk {nextRank.name}
                </p>
              ) : (
                <p style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 700 }}>🏆 Rank Tertinggi Tercapai!</p>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            STATS ROW
        ══════════════════════════════════════════════════ */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px",
        }}>
          {[
            { label: "Total Projects", value: projects.length, icon: FolderOpen, color: "#818cf8" },
            { label: "Selesai", value: finishedProjects.length, icon: CheckCircle2, color: "#4ade80" },
            { label: "Total EXP", value: `${exp.toLocaleString("id-ID")}`, icon: Award, color: "#fbbf24" },
            { label: "Limit Bulanan", value: `${projectsThisMonth}/${prdLimit}`, icon: TrendingUp, color: "#f472b6" },
          ].map((stat) => {
            const IconComp = stat.icon;
            return (
              <div key={stat.label} style={{
                background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                borderRadius: "16px", padding: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <IconComp size={18} color={stat.color} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-muted)" }}>{stat.label}</span>
                </div>
                <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--fg-primary)", margin: 0 }}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════
            RANK JOURNEY
        ══════════════════════════════════════════════════ */}
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "20px", padding: "28px", marginBottom: "32px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "24px" }}>
            Rank Journey
          </h2>
          <div style={{ display: "flex", gap: "0", overflowX: "auto", paddingBottom: "4px" }}>
            {RANKS.map((r, i) => {
              const unlocked = exp >= r.minExp;
              const isCurrent = r.id === rank.id;
              const RIcon = RANK_ICON_MAP[r.icon] ?? Star;
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "8px", width: "80px",
                  }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "14px",
                      background: unlocked ? r.color : "var(--bg-elevated)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: isCurrent ? "3px solid white" : "2px solid transparent",
                      boxShadow: isCurrent ? `0 0 20px rgba(99,102,241,0.5)` : "none",
                      opacity: unlocked ? 1 : 0.4,
                      transition: "all 0.2s",
                      position: "relative",
                    }}>
                      {unlocked
                        ? <RIcon size={22} color="white" strokeWidth={2} />
                        : <Lock size={18} color="var(--fg-muted)" strokeWidth={2} />
                      }
                      {isCurrent && (
                        <div style={{
                          position: "absolute", top: "-6px", left: "50%", transform: "translateX(-50%)",
                          background: "var(--indigo-500)", borderRadius: "999px",
                          padding: "1px 6px", fontSize: "8px", fontWeight: 800, color: "white",
                          whiteSpace: "nowrap",
                        }}>YOU</div>
                      )}
                    </div>
                    <p style={{
                      fontSize: "9px", fontWeight: 600, textAlign: "center",
                      color: unlocked ? "var(--fg-secondary)" : "var(--fg-muted)",
                      lineHeight: 1.3,
                    }}>{r.name}</p>
                    <p style={{ fontSize: "8px", color: "var(--fg-muted)" }}>
                      {r.minExp === 0 ? "Start" : `${r.minExp >= 1000 ? `${r.minExp / 1000}k` : r.minExp}`}
                    </p>
                  </div>
                  {i < RANKS.length - 1 && (
                    <div style={{
                      width: "24px", height: "2px", flexShrink: 0,
                      background: exp >= RANKS[i + 1].minExp
                        ? "var(--indigo-500)"
                        : "var(--border-subtle)",
                      marginBottom: "28px",
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            PROJECTS SECTION
        ══════════════════════════════════════════════════ */}
        <ProfileProjects projects={projects} />
      </main>
    </div>
  );
}
