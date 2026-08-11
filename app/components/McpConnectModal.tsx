"use client";

import { useEffect, useState } from "react";
import { Sparkles, Copy, Check, Terminal, X, ShieldCheck, Cpu, MessageSquareText } from "lucide-react";

interface McpConnectModalProps {
  projectId: string;
  appName?: string;
  onClose: () => void;
}

export default function McpConnectModal({ projectId, appName, onClose }: McpConnectModalProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [isCopiedCommand, setIsCopiedCommand] = useState(false);
  const [isCopiedPrompt, setIsCopiedPrompt] = useState(false);

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

  const keyToUse = apiKey || "<YOUR_API_KEY>";

  const cliCommands = `npx piardify login --token ${keyToUse}
npx piardify init --project ${projectId}`;

  const aiPrompt = `Bertindaklah sebagai AI Senior Fullstack Engineer untuk proyek Piardify ini.

Tolong jalankan alur kerja otomatisasi berikut:

1. SETUP CLI & INSTALL SKILL (Terminal):
   Jalankan 2 perintah berikut di terminal:
   npx piardify login --token ${keyToUse}
   npx piardify init --project ${projectId}

2. BACA SYSTEM DIRECTIVES & WORKFLOW SKILL:
   Setelah init selesai, baca file instruksi .agents/skills/piardify/SKILL.md dan .piardify/context.md yang otomatis terpasang di workspace.
   Verifikasi freshness konteks (AH-017): jika <project_context>.updatedAt lebih baru dari generatedAt di komentar header context.md, refresh dulu dengan: .piardify/sync context > .piardify/context.md, lalu baca ulang.

3. EKSEKUSI TASK & AUTOMATIC KANBAN SYNC:
   - Cek task aktif dengan: .piardify/sync current
   - Sebelum mulai mengedit kode, tandai status task sebagai IN_PROGRESS dengan: .piardify/sync start <task-id>
   - Implementasikan solusi sesuai PRD dan aturan Anti-Hallucination.
   - WAJIB jalankan verifikasi lokal di terminal: npm run lint && npm run build
   - Jika verifikasi lulus: tandai DONE dengan: .piardify/sync complete <task-id>
   - Jika verifikasi gagal: tandai FAILED dengan: .piardify/sync fail <task-id> "alasan error"`;

  const copyToClipboard = async (text: string, setCopiedState: (val: boolean) => void) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2500);
    } catch (e) {
      console.warn("Clipboard copy failed:", e);
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
          maxWidth: 620,
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
                Integrasikan AI Agent via NPX CLI & Agent Skill
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
                Zero-Friction Distribution & Automatic Skill Provisioning
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
            Jalankan <strong>2 perintah terminal</strong> di bawah ini atau tempelkan prompt setup langsung ke AI Coding Agent Anda (seperti <strong>Antigravity, Cursor, Claude Code</strong>). Perintah <code>npx piardify init</code> akan meng-install <strong>Piardify Agent Skill</strong> dan native 10ms sync helper secara otomatis.
          </p>

          {/* Terminal Code Block */}
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
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
                  1. Perintah Setup Terminal (Pengembang)
                </span>
              </div>
            </div>

            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--color-signal)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                padding: "4px 0",
              }}
            >
              {isLoadingKey ? "# Memuat API Key milik Anda...\nnpx piardify login\nnpx piardify init" : cliCommands}
            </pre>
          </div>

          {/* Prompt Agent Block */}
          <div
            style={{
              position: "relative",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MessageSquareText size={12} style={{ color: "var(--color-signal)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--color-signal)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  2. Prompt Setup AI Agent (Salin & Paste ke Chat Agent)
                </span>
              </div>
            </div>

            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--fg-secondary)",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                maxHeight: 140,
                overflowY: "auto",
              }}
            >
              {isLoadingKey ? "Memuat prompt setup..." : aiPrompt}
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
              <ShieldCheck size={12} /> Auto Agent Skill Installation
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
              10ms Native Realtime Kanban Sync
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => copyToClipboard(cliCommands, setIsCopiedCommand)}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-circuit)",
                background: "rgba(79,209,197,0.1)",
                color: "var(--color-circuit)",
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
              {isCopiedCommand ? <Check size={15} /> : <Terminal size={15} />}
              {isCopiedCommand ? "Command Disalin!" : "Salin Perintah CLI"}
            </button>

            <button
              onClick={() => copyToClipboard(aiPrompt, setIsCopiedPrompt)}
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
              {isCopiedPrompt ? <Check size={15} /> : <Copy size={15} />}
              {isCopiedPrompt ? "Prompt Agent Disalin!" : "Salin Prompt AI Agent"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
