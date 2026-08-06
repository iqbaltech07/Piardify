"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import StepNavbar from "../components/StepNavbar";
import ProjectHeaderBrand from "../components/ProjectHeaderBrand";
import McpConnectModal from "../components/McpConnectModal";
import { ProjectDetailData } from "./types";
import { parseMarkdownSections, parseColorTokens } from "./utils/parser";
import ProjectHeaderCard from "./components/ProjectHeaderCard";
import ColorTokensTable from "./components/ColorTokensTable";
import DesignAccordions from "./components/DesignAccordions";
import DesignDropzone from "./components/DesignDropzone";

export { DEFAULT_COLOR_TOKENS, DEFAULT_ACCORDION_SECTIONS } from "./utils/parser";
export type { ProjectDetailData, ColorToken } from "./types";

function ProjectDetailContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ dos_and_donts: true, overview: true });
  const [showMcpModal, setShowMcpModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/projects/detail?projectId=${projectId}`);
        if (!res.ok) throw new Error("Failed to load project details");
        const json = await res.json();
        setProject(json.project || null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to connect to server");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const processUploadedFile = async (file: File) => {
    if (!file || !projectId) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("file", file);

      const res = await fetch("/api/projects/upload-design", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();

      setProject((prev) =>
        prev
          ? {
              ...prev,
              designData: json.designData,
            }
          : prev
      );
    } catch (err: unknown) {
      alert("Failed to upload design.md: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processUploadedFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processUploadedFile(file);
  };

  const formInputs = project?.formInputs ? (() => { try { return JSON.parse(project.formInputs); } catch { return {}; } })() : {};
  const rawDesignData = (() => {
    const raw = project?.designData || "";
    if (raw.startsWith("{") && raw.includes("rawMarkdown")) {
      try { return JSON.parse(raw).rawMarkdown || raw; } catch { return raw; }
    }
    return raw;
  })();

  const sections = parseMarkdownSections(rawDesignData);
  const colorTokens = parseColorTokens(rawDesignData);
  const hasDesignData = !!(rawDesignData && rawDesignData.trim());

  const btn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid var(--border-hairline)",
    background: "var(--bg-elevated)",
    color: "var(--fg-secondary)",
    transition: "all 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-ink)", color: "var(--fg-primary)" }}>
      {showMcpModal && projectId && (
        <McpConnectModal projectId={projectId} appName={project?.appName} onClose={() => setShowMcpModal(false)} />
      )}

      {/* ── Topbar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: 52,
          borderBottom: "1px solid var(--border-hairline)",
          background: "rgba(16,24,43,0.96)",
          backdropFilter: "blur(12px)",
        }}
      >
        <ProjectHeaderBrand projectId={projectId} />
        <StepNavbar currentStep="design" projectId={projectId} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <Link
            href={`/task?projectId=${projectId}`}
            style={{
              ...btn,
              background: "var(--color-signal)",
              color: "var(--color-graphite)",
              borderColor: "var(--color-signal)",
              textDecoration: "none",
            }}
          >
            Lanjut ke Task →
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{ paddingTop: 76, paddingBottom: 80, maxWidth: 960, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        {isLoading ? (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-signal)" }}>Loading Project Details...</p>
          </div>
        ) : error ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "#f87171" }}>
            <p>{error}</p>
          </div>
        ) : (
          <div>
            {!hasDesignData ? (
              <DesignDropzone
                isDragging={isDragging}
                isUploading={isUploading}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onFileUpload={handleFileUpload}
              />
            ) : (
              <>
                <ProjectHeaderCard
                  project={project}
                  formInputs={formInputs}
                  isUploading={isUploading}
                  onFileUpload={handleFileUpload}
                />
                <ColorTokensTable colorTokens={colorTokens} />
                <DesignAccordions
                  projectId={projectId}
                  sections={sections}
                  colorTokens={colorTokens}
                  openAccordions={openAccordions}
                  onToggleAccordion={toggleAccordion}
                />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "var(--color-signal)" }}>Loading Detail Page...</div>}>
      <ProjectDetailContent />
    </Suspense>
  );
}
