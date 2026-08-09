"use client";

import { useEffect, useState } from "react";
import { Key, Copy, Check, RefreshCw, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";

export default function ApiKeySection() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKey();
  }, []);

  async function fetchApiKey() {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/user/api-key");
      if (res.ok) {
        const data = await res.json();
        setApiKey(data.apiKey || "");
      } else {
        setErrorMsg("Gagal memuat API Key.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal saat mengambil API Key.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegenerate() {
    try {
      setIsRegenerating(true);
      setErrorMsg(null);
      const res = await fetch("/api/user/api-key", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setApiKey(data.apiKey || "");
        setConfirmRegenerate(false);
        setShowKey(true); // Automatically reveal new key
      } else {
        setErrorMsg("Gagal memperbarui API Key.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat regenerasi API Key.");
    } finally {
      setIsRegenerating(false);
    }
  }

  const handleCopy = async () => {
    if (!apiKey) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(apiKey);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = apiKey;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.warn("Copy failed:", e);
    }
  };

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 10)}${"•".repeat(16)}${apiKey.slice(-4)}`
    : "••••••••••••••••••••••••••••••••";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-lg)",
        padding: "24px 28px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header Title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                background: "rgba(255,182,39,0.1)",
                border: "1px solid rgba(255,182,39,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Key size={16} style={{ color: "var(--color-signal)" }} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--fg-primary)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                API Key Integrasi AI Agent (npx piardify)
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--fg-muted)",
                  margin: "2px 0 0",
                  letterSpacing: "0.03em",
                }}
              >
                Gunakan API key ini untuk login via CLI: <code>npx piardify login --token &lt;KEY&gt;</code>
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: "var(--radius-xs)",
              border: "1px solid rgba(79,209,197,0.3)",
              background: "rgba(79,209,197,0.06)",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: "var(--color-circuit)",
            }}
          >
            <ShieldCheck size={12} /> Secure Key
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(255, 99, 99, 0.1)",
              border: "1px solid rgba(255, 99, 99, 0.3)",
              color: "#ff6b6b",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              marginBottom: 16,
            }}
          >
            <AlertCircle size={14} />
            {errorMsg}
          </div>
        )}

        {/* API Key Box */}
        <div
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-md)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                color: "var(--fg-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Secret API Key
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: apiKey ? "var(--fg-primary)" : "var(--fg-muted)",
                letterSpacing: showKey ? "0.05em" : "0.15em",
                userSelect: showKey ? "all" : "none",
                wordBreak: "break-all",
              }}
            >
              {isLoading ? "Memuat API Key..." : showKey ? apiKey : maskedKey}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Toggle show/hide */}
            <button
              onClick={() => setShowKey(!showKey)}
              disabled={isLoading || !apiKey}
              title={showKey ? "Sembunyikan API Key" : "Tampilkan API Key"}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-hairline)",
                background: "var(--bg-surface)",
                color: "var(--fg-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              {showKey ? "Hide" : "Show"}
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              disabled={isLoading || !apiKey}
              title="Salin API Key"
              style={{
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
                border: isCopied ? "1px solid var(--color-circuit)" : "1px solid var(--border-hairline)",
                background: isCopied ? "rgba(79,209,197,0.1)" : "var(--bg-surface)",
                color: isCopied ? "var(--color-circuit)" : "var(--fg-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Regenerate Action Section */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-muted)",
              margin: 0,
              maxWidth: 480,
              lineHeight: 1.5,
            }}
          >
            ⚠️ Regenerasi API Key akan membatalkan API Key sebelumnya. Token pada CLI `npx piardify login` perlu diperbarui dengan API key baru.
          </p>

          {!confirmRegenerate ? (
            <button
              onClick={() => setConfirmRegenerate(true)}
              disabled={isLoading || isRegenerating}
              style={{
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-hairline)",
                background: "transparent",
                color: "var(--color-mist)",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <RefreshCw size={13} />
              Regenerate Key
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#ff6b6b", fontWeight: 600 }}>
                Yakin buat ulang?
              </span>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #ff6b6b",
                  background: "rgba(255, 107, 107, 0.15)",
                  color: "#ff6b6b",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: isRegenerating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <RefreshCw size={12} className={isRegenerating ? "animate-spin" : ""} />
                {isRegenerating ? "Memproses..." : "Ya, Regenerate"}
              </button>
              <button
                onClick={() => setConfirmRegenerate(false)}
                disabled={isRegenerating}
                style={{
                  padding: "6px 10px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-hairline)",
                  background: "var(--bg-elevated)",
                  color: "var(--fg-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
