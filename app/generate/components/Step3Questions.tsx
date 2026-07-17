import React from "react";
import { FormData } from "../types";
import { PLATFORMS, FEATURE_OPTIONS, MONETIZATION_OPTIONS, SCALE_OPTIONS, INTEGRATION_OPTIONS, DESIGN_OPTIONS } from "../constants";

export const getStep3Questions = (
  form: FormData,
  setForm: React.Dispatch<React.SetStateAction<FormData>>,
  toggleFeature: (feat: string) => void,
  toggleIntegration: (int: string) => void
) => [
  {
    key: "targetUser", title: "Who is your target user?",
    subtitle: "Describe your ideal user — their role, pain points, or demographics.",
    canProceed: () => form.targetUser !== "",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {["Students / Academics", "Software Developers", "Product Managers", "Startup Founders", "Small Business Owners", "General Consumers"].map((opt) => (
          <button key={opt} id={`target-${opt.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => setForm((f) => ({ ...f, targetUser: opt }))}
            style={{
              width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "12px",
              fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              background: form.targetUser === opt ? "rgba(99,102,241,0.15)" : "var(--bg-elevated)",
              border: `1px solid ${form.targetUser === opt ? "var(--indigo-500)" : "var(--border-subtle)"}`,
              color: form.targetUser === opt ? "var(--indigo-300)" : "var(--fg-secondary)",
            }}>{opt}</button>
        ))}
      </div>
    ),
  },
  {
    key: "platform", title: "What platform is your product?",
    subtitle: "Choose where your users will interact with your product.",
    canProceed: () => form.platform !== "",
    render: () => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {PLATFORMS.map((p) => (
          <button key={p} id={`platform-${p.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => setForm((f) => ({ ...f, platform: p }))}
            style={{
              textAlign: "left", padding: "14px 16px", borderRadius: "12px",
              fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              background: form.platform === p ? "rgba(99,102,241,0.15)" : "var(--bg-elevated)",
              border: `1px solid ${form.platform === p ? "var(--indigo-500)" : "var(--border-subtle)"}`,
              color: form.platform === p ? "var(--indigo-300)" : "var(--fg-secondary)",
            }}>{p}</button>
        ))}
      </div>
    ),
  },
  {
    key: "coreFeatures", title: "What are the core features?",
    subtitle: "Select all features that are essential to your product. Choose at least 2.",
    canProceed: () => form.coreFeatures.length >= 2,
    render: () => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {FEATURE_OPTIONS.map((feat) => (
          <button key={feat} id={`feature-${feat.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => toggleFeature(feat)}
            style={{
              padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
              cursor: "pointer", transition: "all 0.15s",
              background: form.coreFeatures.includes(feat) ? "rgba(99,102,241,0.2)" : "var(--bg-elevated)",
              border: `1px solid ${form.coreFeatures.includes(feat) ? "var(--indigo-500)" : "var(--border-subtle)"}`,
              color: form.coreFeatures.includes(feat) ? "var(--indigo-300)" : "var(--fg-secondary)",
            }}>{feat}</button>
        ))}
      </div>
    ),
  },
  {
    key: "monetization", title: "What's your monetization model?",
    subtitle: "How will your product generate revenue (or not)?",
    canProceed: () => form.monetization !== "",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {MONETIZATION_OPTIONS.map((opt) => (
          <button key={opt} id={`monetization-${opt.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => setForm((f) => ({ ...f, monetization: opt }))}
            style={{
              width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "12px",
              fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              background: form.monetization === opt ? "rgba(99,102,241,0.15)" : "var(--bg-elevated)",
              border: `1px solid ${form.monetization === opt ? "var(--indigo-500)" : "var(--border-subtle)"}`,
              color: form.monetization === opt ? "var(--indigo-300)" : "var(--fg-secondary)",
            }}>{opt}</button>
        ))}
      </div>
    ),
  },
  {
    key: "appScale", title: "What's the expected scale?",
    subtitle: "This helps us scope the architecture and infrastructure recommendations.",
    canProceed: () => form.appScale !== "",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {SCALE_OPTIONS.map((opt) => (
          <button key={opt} id={`scale-${opt.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => setForm((f) => ({ ...f, appScale: opt }))}
            style={{
              width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "12px",
              fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              background: form.appScale === opt ? "rgba(99,102,241,0.15)" : "var(--bg-elevated)",
              border: `1px solid ${form.appScale === opt ? "var(--indigo-500)" : "var(--border-subtle)"}`,
              color: form.appScale === opt ? "var(--indigo-300)" : "var(--fg-secondary)",
            }}>{opt}</button>
        ))}
      </div>
    ),
  },
  {
    key: "integrations", title: "Third-party integrations?",
    subtitle: "Select any external services or APIs your product will use.",
    canProceed: () => form.integrations.length >= 1,
    render: () => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {INTEGRATION_OPTIONS.map((int) => (
          <button key={int} id={`integration-${int.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => toggleIntegration(int)}
            style={{
              padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
              cursor: "pointer", transition: "all 0.15s",
              background: form.integrations.includes(int) ? "rgba(99,102,241,0.2)" : "var(--bg-elevated)",
              border: `1px solid ${form.integrations.includes(int) ? "var(--indigo-500)" : "var(--border-subtle)"}`,
              color: form.integrations.includes(int) ? "var(--indigo-300)" : "var(--fg-secondary)",
            }}>{int}</button>
        ))}
      </div>
    ),
  },
  {
    key: "designPreference", title: "What's your design preference?",
    subtitle: "Choose the visual style that resonates with your product's personality.",
    canProceed: () => form.designPreference !== "",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {DESIGN_OPTIONS.map((opt) => (
          <button key={opt.id} id={`design-${opt.id}`}
            onClick={() => setForm((f) => ({ ...f, designPreference: opt.id }))}
            style={{
              width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "12px",
              cursor: "pointer", transition: "all 0.15s",
              background: form.designPreference === opt.id ? "rgba(99,102,241,0.15)" : "var(--bg-elevated)",
              border: `1px solid ${form.designPreference === opt.id ? "var(--indigo-500)" : "var(--border-subtle)"}`,
            }}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px", color: form.designPreference === opt.id ? "var(--indigo-300)" : "var(--fg-primary)" }}>
              {opt.label}
            </div>
            <div style={{ fontSize: "12px", color: "var(--fg-muted)" }}>{opt.desc}</div>
          </button>
        ))}
      </div>
    ),
  },
];
