"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderOpen, ChevronRight, CheckCircle2, Calendar, Award } from "lucide-react";

type Project = {
  id: string;
  appName: string;
  appIdea: string;
  status: string;
  createdAt: Date;
};

export default function ProfileProjects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("all");

  const finishedProjects = projects.filter((p) => p.status === "FINISHED");
  const inProgressProjects = projects.filter((p) => p.status !== "FINISHED");

  const displayedProjects = filter === "all"
    ? projects
    : filter === "finished" ? finishedProjects : inProgressProjects;

  return (
    <>
      {/* ══════════════════════════════════════════════════
          PROJECTS SECTION
      ══════════════════════════════════════════════════ */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "20px",
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>
          My Projects
        </h2>
        <Link href="/generate" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "10px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: 700,
          background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
          color: "white", textDecoration: "none",
          boxShadow: "0 0 20px rgba(99,102,241,0.25)",
        }}>
          + New Project
        </Link>
      </div>

      {/* Filter Tabs */}
      {projects.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {[
            { label: `All (${projects.length})`, id: "all" },
            { label: `Finished (${finishedProjects.length})`, id: "finished" },
            { label: `In Progress (${inProgressProjects.length})`, id: "in_progress" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: "6px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
                background: filter === tab.id ? "rgba(99,102,241,0.15)" : "var(--bg-surface)",
                border: filter === tab.id ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border-subtle)",
                color: filter === tab.id ? "var(--fg-primary)" : "var(--fg-muted)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {displayedProjects.length === 0 ? (
        <div style={{
          background: "var(--bg-surface)", border: "1px dashed var(--border-subtle)",
          borderRadius: "20px", padding: "64px", textAlign: "center",
        }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "var(--bg-elevated)", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 16px",
          }}>
            <FolderOpen size={28} color="var(--fg-muted)" />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>No Projects Yet</h3>
          <p style={{ color: "var(--fg-muted)", fontSize: "14px", maxWidth: "360px", margin: "0 auto 24px" }}>
            Start planning your first app and earn your first Points!
          </p>
          <Link href="/generate" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
            background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
            color: "white", textDecoration: "none",
          }}>
            Generate PRD Now <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {displayedProjects.map((project) => {
            const isFinished = project.status === "FINISHED";
            const ideaPreview = project.appIdea.length > 100
              ? project.appIdea.substring(0, 100) + "..."
              : project.appIdea;

            return (
              <Link
                key={project.id}
                href={`/struktur?projectId=${project.id}`}
                className="group"
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    background: "var(--bg-surface)",
                    borderRadius: "18px",
                    padding: "24px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className={`transition-all duration-200 border group-hover:-translate-y-[2px] group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] ${isFinished
                      ? "border-[#4ade80]/20 group-hover:border-[#4ade80]/50"
                      : "border-[#6366f1]/20 group-hover:border-[#6366f1]/40"
                    }`}
                >
                  {/* Finished overlay glow */}
                  {isFinished && (
                    <div style={{
                      position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
                      background: "linear-gradient(135deg, rgba(74,222,128,0.03), transparent 60%)",
                      pointerEvents: "none",
                    }} />
                  )}

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "11px",
                      background: isFinished ? "rgba(74,222,128,0.12)" : "rgba(99,102,241,0.1)",
                      border: isFinished ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(99,102,241,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isFinished
                        ? <CheckCircle2 size={20} color="#4ade80" />
                        : <FolderOpen size={20} color="var(--indigo-400)" />
                      }
                    </div>

                    {/* Status badge */}
                    <span style={{
                      padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                      background: isFinished ? "rgba(74,222,128,0.1)" : "rgba(99,102,241,0.1)",
                      color: isFinished ? "#4ade80" : "var(--indigo-400)",
                      border: isFinished ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(99,102,241,0.25)",
                    }}>
                      {isFinished ? "✓ Finished" : "In Progress"}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "6px" }}>
                    {project.appName}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--fg-muted)", lineHeight: 1.5, marginBottom: "16px" }}>
                    {ideaPreview}
                  </p>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderTop: "1px solid var(--border-subtle)", paddingTop: "14px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={12} color="var(--fg-muted)" />
                      <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>
                        {new Date(project.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    {isFinished && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Award size={12} color="#fbbf24" />
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#fbbf24" }}>+100 Points</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
