"use client";

import { useEffect, useState } from "react";
import { Sparkles, Copy, Check, Terminal, ExternalLink, X, ShieldCheck, Cpu } from "lucide-react";

interface McpConnectModalProps {
  projectId: string;
  appName?: string;
  onClose: () => void;
}

export default function McpConnectModal({ projectId, appName, onClose }: McpConnectModalProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchApiKey() {
      try {
        setIsLoadingKey(true);
        const res = await fetch("/api/user/api-key");
        if (res.ok) {
          const data = await res.json();
          setApiKey(data.apiKey || "");
        }
      } catch (err) {
        console.warn("Failed to fetch API key:", err);
      } finally {
        setIsLoadingKey(false);
      }
    }
    fetchApiKey();
  }, []);

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://piardify.vercel.app";

  const aiPrompt = `Tolong hubungkan proyek lokal ini ke Piardify MCP Server dan ambil blueprint tugas saya dengan instruksi berikut:

- MCP Server URL: ${currentOrigin}/api/mcp
- Project ID: ${projectId}
- API Key: ${apiKey || "MEMUAT_API_KEY..."}

Langkah-langkah yang perlu Anda lakukan secara otomatis:
1. Hubungkan / tambahkan konfigurasi MCP Server "piardify" pada lingkungan IDE ini:
   - Command / SSE Endpoint: ${currentOrigin}/api/mcp?apiKey=${apiKey}
   - Headers: Authorization: Bearer ${apiKey}
2. Panggil tool MCP \`get_project_blueprint\` untuk membaca dokumen PRD, Mindmap Structure, dan Task List dari Piardify.
3. Setelah memahami spesifikasi & arsitektur proyek, beritahu saya ringkasan tugas pertama yang siap dikerjakan dan ubah status tugas tersebut menjadi "in_progress" di Piardify.`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(aiPrompt);
      } else {
        // Fallback for non-HTTPS / restricted contexts
        const textArea = document.createElement("textarea");
        textArea.value = aiPrompt;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.warn("Clipboard copy fallback failed:", e);
      // Extra fallback attempt
      try {
        const textArea = document.createElement("textarea");
        textArea.value = aiPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } catch (err) { }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        background: "rgba(8,11,20,0.88)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius-lg)",
          maxWidth: 580,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top rule */}
        <div aria-hidden="true" style={{ height: 2, background: "var(--color-signal)" }} />

        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--border-hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-md)",
                background: "rgba(255,182,39,0.1)",
                border: "1px solid rgba(255,182,39,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cpu size={18} style={{ color: "var(--color-signal)" }} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "var(--fg-primary)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Integrasikan AI Coding Agent
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-mist)",
                  margin: "3px 0 0",
                  letterSpacing: "0.04em",
                }}
              >
                Otomatisasi Task & Blueprint Anti-Halusinasi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: 6,
              background: "transparent",
              border: "none",
              color: "var(--fg-muted)",
              cursor: "pointer",
              borderRadius: "var(--radius-xs)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "calc(80vh - 120px)" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--fg-primary)",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            Cukup salin prompt di bawah ini dan tempelkan (*paste*) ke AI Coding Agent Anda di IDE (seperti <strong>Antigravity, Cursor, Kiro, Codex, Claude Code</strong>). AI Agent akan melakukan setup koneksi MCP secara mandiri.
          </p>

          {/* Prompt Code Block */}
          <div
            style={{
              position: "relative",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Terminal size={12} style={{ color: "var(--color-circuit)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--color-circuit)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Prompt Setup AI Agent
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--fg-muted)",
                }}
              >
                1-Click Copy
              </span>
            </div>

            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--fg-secondary)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                maxHeight: 180,
                overflowY: "auto",
              }}
            >
              {isLoadingKey ? "Memuat API Key milik Anda..." : aiPrompt}
            </pre>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: "var(--radius-xs)",
                border: "1px solid rgba(79,209,197,0.3)",
                background: "rgba(79,209,197,0.06)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: "var(--color-circuit)",
              }}
            >
              <ShieldCheck size={12} /> 100% Anti-Halusinasi Context
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: "var(--radius-xs)",
                border: "1px solid var(--border-hairline)",
                background: "var(--bg-elevated)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: "var(--color-mist)",
              }}
            >
              Auto Sync Kanban Task
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-signal)",
                background: "var(--color-signal)",
                color: "var(--color-graphite)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "opacity 0.15s",
              }}
            >
              {isCopied ? <Check size={15} /> : <Copy size={15} />}
              {isCopied ? "Prompt Berhasil Disalin!" : "Salin Prompt ke AI Agent"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
