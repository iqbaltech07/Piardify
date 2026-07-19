"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { marked } from "marked";

/* ─── Types ─── */
interface TocItem {
  id: string;
  text: string;
  level: number;
}

function StepNavbar({ currentStep, projectId }: { currentStep: "struktur" | "prd" | "task", projectId: string | null }) {
  const steps = [
    { id: "struktur", label: "Struktur", href: `/struktur${projectId ? `?projectId=${projectId}` : ''}` },
    { id: "prd", label: "PRD", href: `/preview${projectId ? `?projectId=${projectId}` : ''}` },
    { id: "task", label: "Task", href: `/task${projectId ? `?projectId=${projectId}` : ''}` },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {steps.map((step, i) => {
        const isDone = steps.findIndex(s => s.id === currentStep) > i;
        const isActive = step.id === currentStep;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            {/* Step pill */}
            <Link href={isDone || isActive ? step.href : "#"} style={{ textDecoration: "none", pointerEvents: isDone || isActive ? "auto" : "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "4px 10px", borderRadius: "6px",
                background: "transparent",
                transition: "background 0.2s",
              }}>
                {/* Circle */}
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
                {/* Label */}
                <span style={{
                  fontSize: "12px", fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--fg-primary)" : isDone ? "#818cf8" : "var(--fg-muted)",
                  letterSpacing: "0.01em",
                }}>
                  {step.label}
                </span>
              </div>
            </Link>
            {/* Connector line — sits between pills, perfectly centered */}
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

function PreviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [markdown, setMarkdown] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMarkdown, setEditedMarkdown] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [appName, setAppName] = useState("PRD");
  const contentRef = useRef<HTMLDivElement>(null);

  /* ─── Generate PRD on mount ─── */
  useEffect(() => {
    if (hasStarted || !projectId) return;
    setHasStarted(true);

    const generatePRD = async () => {
      setIsGenerating(true);
      setMarkdown("");

      try {
        const res = await fetch("/api/generate/prd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });

        if (!res.ok) {
          setMarkdown("# Error generating PRD\n\nPlease check if your API keys are configured correctly in `.env`.");
          setIsGenerating(false);
          return;
        }

        const data = await res.json();

        if (data.error) {
          setMarkdown(`# Error generating PRD\n\n${data.error}`);
        } else {
          setMarkdown(data.markdown || "");
          setEditedMarkdown(data.markdown || "");
        }
      } catch (err) {
        console.error("Generate error", err);
        setMarkdown("# Network Error\n\nFailed to generate PRD.");
      } finally {
        setIsGenerating(false);
      }
    };

    generatePRD();
  }, [hasStarted, projectId]);

  /* ─── Parse Markdown → HTML with baked heading IDs ─── */
  useEffect(() => {
    if (!markdown) return;

    let idx = 0;
    const tocItems: TocItem[] = [];
    const renderer = new marked.Renderer();
    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
      if (depth === 2 || depth === 3) {
        const id = `heading-${idx}`;
        idx++;
        tocItems.push({ id, text, level: depth });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      }
      return `<h${depth}>${text}</h${depth}>\n`;
    };

    const html = marked(markdown, { renderer, gfm: true, breaks: true }) as string;
    setHtmlContent(html);
    if (!isEditing) {
      setToc(tocItems);
      if (tocItems.length > 0 && !activeTocId) {
        setActiveTocId(tocItems[0].id);
      }
    }
  }, [markdown, isEditing]);

  /* ─── Mermaid rendering ─── */
  useEffect(() => {
    if (isGenerating || !htmlContent) return;

    const renderMermaid = async () => {
      // Beri sedikit waktu agar React selesai memanipulasi DOM (dangerouslySetInnerHTML)
      await new Promise(resolve => setTimeout(resolve, 50));
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({ startOnLoad: false, theme: "dark" });
        
        const nodes = document.querySelectorAll(".language-mermaid");
        if (nodes.length === 0) return;

        // Hapus atribut data-processed agar Mermaid memproses ulang node saat pergantian halaman (client-side navigation)
        nodes.forEach((node) => node.removeAttribute("data-processed"));

        await mermaid.run({ querySelector: ".language-mermaid", suppressErrors: true });

        document.querySelectorAll(".language-mermaid").forEach((node: any) => {
          const pre = node.parentElement;
          if (pre && pre.tagName === "PRE" && pre.querySelector("svg")) {
            pre.style.background = "transparent";
            pre.style.border = "none";
            pre.style.display = "flex";
            pre.style.justifyContent = "center";
            pre.style.padding = "8px 0";
          }
        });
      } catch (e) {
        console.warn("Mermaid rendering error", e);
      }
    };

    renderMermaid();
  }, [htmlContent, isGenerating]);

  /* ─── TOC scroll spy via scroll event listener ─── */
  useEffect(() => {
    const container = contentRef.current;
    if (!container || toc.length === 0) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const containerRect = container.getBoundingClientRect();
      let active = toc[0]?.id || "";

      for (const item of toc) {
        const el = container.querySelector<HTMLElement>(`#${item.id}`);
        if (!el) continue;
        const elRect = el.getBoundingClientRect();
        const relTop = elRect.top - containerRect.top + scrollTop;
        if (relTop <= scrollTop + 100) active = item.id;
        else break;
      }
      setActiveTocId(active);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    // Trigger once so first heading is highlighted on load
    setTimeout(onScroll, 100);
    return () => container.removeEventListener("scroll", onScroll);
  }, [toc]);

  /* ─── Actions ─── */
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "PRD.md"; a.click();
    URL.revokeObjectURL(url);
  }, [markdown]);

  const handleContinueToTask = () => {
    router.push(`/task${projectId ? `?projectId=${projectId}` : ''}`);
  };

  const scrollToHeading = (id: string) => {
    const container = contentRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`#${id}`);
    if (!el) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const relativeTop = elRect.top - containerRect.top + container.scrollTop;
    container.scrollTo({ top: relativeTop - 24, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/projects/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, prdData: editedMarkdown, tasksOutdated: true }),
      });
      if (res.ok) {
        setMarkdown(editedMarkdown);
        setIsEditing(false);
      } else {
        alert("Gagal menyimpan PRD.");
      }
    } catch (e) {
      alert("Error koneksi saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
    cursor: "pointer", transition: "opacity 0.15s",
    background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--fg-secondary)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg-base)", color: "var(--fg-primary)" }}>

      {/* ── Topbar ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "52px", flexShrink: 0,
        borderBottom: "1px solid var(--border-subtle)", background: "rgba(8,11,20,0.92)",
        backdropFilter: "blur(12px)", position: "relative", zIndex: 50,
      }}>
        {/* Left: Logo */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <Image
              src="/logo.png"
              alt="Piardify"
              width={143}
              height={80}
              style={{ height: "49px", width: "auto" }}
            />
          </Link>
        </div>

        {/* Center: Step navbar */}
        <StepNavbar currentStep="prd" projectId={projectId} />

        {/* Right: Actions */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} style={{ ...btnBase, color: "#f87171", borderColor: "#f8717140", background: "rgba(248,113,113,0.1)" }}>Cancel</button>
              <button onClick={handleSave} disabled={isSaving} style={{ ...btnBase, color: "#4ade80", borderColor: "#4ade8040", background: "rgba(74,222,128,0.1)" }}>
                {isSaving ? "Saving..." : "Save PRD"}
              </button>
            </>
          ) : (
            <button onClick={() => { setEditedMarkdown(markdown); setIsEditing(true); }} style={{ ...btnBase, color: "#a78bfa", borderColor: "#a78bfa40", background: "rgba(167,139,250,0.1)" }}>
              Edit Mode
            </button>
          )}
          <button id="btn-copy" onClick={handleCopy} style={btnBase} disabled={isEditing}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
          <button id="btn-download" onClick={handleDownload}
            style={{ ...btnBase }}>
            ↓ .md
          </button>
          <button
            id="btn-continue-task"
            onClick={handleContinueToTask}
            disabled={isGenerating}
            style={{
              ...btnBase,
              background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
              color: "white", border: "none",
              opacity: isGenerating ? 0.5 : 1,
              cursor: isGenerating ? "not-allowed" : "pointer",
              padding: "6px 16px",
              boxShadow: "0 0 16px rgba(99,102,241,0.3)",
            }}
          >
            Continue to Task →
          </button>
        </div>
      </header>

      {/* ── Body: TOC + Content ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* TOC Sidebar */}
        <aside style={{
          width: "240px", flexShrink: 0,
          borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          overflowY: "auto", padding: "20px 0",
        }}>
          <div style={{ padding: "0 16px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "var(--fg-muted)", textTransform: "uppercase" }}>
            Table of Contents
          </div>
          {toc.length === 0 && isGenerating && (
            <div style={{ padding: "0 16px", fontSize: "12px", color: "var(--fg-muted)" }}>Generating...</div>
          )}
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: item.level === 2 ? "6px 16px" : "4px 24px",
                fontSize: item.level === 2 ? "12px" : "11px",
                fontWeight: item.level === 2 ? 600 : 400,
                color: activeTocId === item.id ? "var(--indigo-400)" : "var(--fg-muted)",
                background: activeTocId === item.id ? "rgba(99,102,241,0.08)" : "transparent",
                border: "none", cursor: "pointer", transition: "all 0.15s",
                borderLeft: activeTocId === item.id ? "2px solid var(--indigo-500)" : "2px solid transparent",
                lineHeight: 1.4,
              }}
            >
              {item.text}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <div
          style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto", position: "relative" }}
          className="scrollbar-hide"
          ref={contentRef}
        >
          {isEditing ? (
            <div style={{ padding: "40px", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "16px", color: "#94a3b8", fontSize: "14px" }}>
                Use Markdown to edit the PRD. Saved changes will automatically sync with your Task list.
              </div>
              <textarea
                value={editedMarkdown}
                onChange={(e) => setEditedMarkdown(e.target.value)}
                style={{
                  flex: 1,
                  width: "100%",
                  background: "var(--bg-elevated)",
                  color: "var(--fg-primary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  padding: "24px",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  resize: "none",
                  outline: "none",
                }}
              />
            </div>
          ) : (
            <div
              className="markdown-preview"
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "60px 40px",
                paddingBottom: "120px",
                color: "var(--fg-secondary)",
              }}
            >
              {isGenerating ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", gap: "20px" }}>
                  <div className="spinner" />
                  <div style={{ color: "var(--fg-muted)", fontSize: "14px" }}>Menulis Product Requirements Document...</div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <footer style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "5px 16px", flexShrink: 0,
        borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)",
      }}>
        <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>
          {markdown.length.toLocaleString()} chars · {markdown.split("\n").length} lines
        </span>
        <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>{appName} · Piardify</span>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .markdown-preview h1 { font-size: 2rem; font-weight: 800; margin: 0 0 16px; color: var(--fg-primary); border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; }
        .markdown-preview h2 { font-size: 1.3rem; font-weight: 700; margin: 36px 0 12px; color: var(--fg-primary); }
        .markdown-preview h3 { font-size: 1.05rem; font-weight: 600; margin: 24px 0 8px; color: var(--indigo-300); }
        .markdown-preview p { font-size: 14px; line-height: 1.8; color: var(--fg-secondary); margin-bottom: 12px; }
        .markdown-preview ul, .markdown-preview ol { padding-left: 20px; margin-bottom: 12px; }
        .markdown-preview li { font-size: 14px; line-height: 1.75; color: var(--fg-secondary); margin-bottom: 4px; }
        .markdown-preview code { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); border-radius: 4px; padding: 1px 6px; font-size: 12px; color: var(--indigo-300); font-family: 'Geist Mono', monospace; }
        .markdown-preview pre { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; margin: 16px 0; overflow-x: auto; }
        .markdown-preview pre code { background: none; border: none; padding: 0; font-size: 13px; color: var(--fg-secondary); }
        .markdown-preview hr { border: none; border-top: 1px solid var(--border-subtle); margin: 24px 0; }
        .markdown-preview strong { color: var(--fg-primary); font-weight: 700; }
        .markdown-preview blockquote { border-left: 3px solid var(--indigo-500); padding-left: 16px; margin: 16px 0; color: var(--fg-muted); font-style: italic; }
        .markdown-preview table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        .markdown-preview th { background: rgba(99,102,241,0.1); border: 1px solid var(--border-subtle); padding: 8px 12px; text-align: left; font-weight: 600; color: var(--fg-primary); }
        .markdown-preview td { border: 1px solid var(--border-subtle); padding: 8px 12px; color: var(--fg-secondary); }
        .markdown-preview tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
        aside::-webkit-scrollbar { width: 4px; }
        aside::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 4px; }
      `}</style>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div style={{height: "100vh", background: "var(--bg-base)"}} />}>
      <PreviewPageContent />
    </Suspense>
  );
}
