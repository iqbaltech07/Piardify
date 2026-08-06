"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Upload, Sparkles, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import StepNavbar from "../components/StepNavbar";
import ProjectHeaderBrand from "../components/ProjectHeaderBrand";
import McpConnectModal from "../components/McpConnectModal";

interface ProjectDetailData {
  id: string;
  appName: string;
  appIdea: string;
  formInputs?: string;
  designData?: string;
  createdAt: string;
}

interface ColorToken {
  token: string;
  hex: string;
  role: string;
}

export const DEFAULT_COLOR_TOKENS: ColorToken[] = [
  { token: "primary", hex: "#5645d4", role: "Primary / brand" },
  { token: "primary-pressed", hex: "#4534b3", role: "Primary / brand" },
  { token: "primary-deep", hex: "#3a2a99", role: "Primary / brand" },
  { token: "on-primary", hex: "#ffffff", role: "Text on primary" },
  { token: "brand-navy", hex: "#0a1530", role: "Primary / brand" },
  { token: "brand-navy-deep", hex: "#070f24", role: "Primary / brand" },
  { token: "brand-navy-mid", hex: "#1a2a52", role: "Primary / brand" },
  { token: "link-blue", hex: "#0075de", role: "Link" },
  { token: "link-blue-pressed", hex: "#005bab", role: "Link" },
  { token: "brand-orange", hex: "#dd5b00", role: "Primary / brand" },
  { token: "brand-orange-deep", hex: "#793400", role: "Primary / brand" },
  { token: "brand-pink", hex: "#ff64c8", role: "Primary / brand" },
];

export const DEFAULT_ACCORDION_SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    content: "Overview dari arsitektur UI/UX dan prinsip desain utama produk ini.",
  },
  {
    id: "colors",
    title: "Colors",
    content: "Sistem pewarnaan menggunakan curated HSL/HEX palette dengan kontras tinggi untuk mode gelap dan terang.",
  },
  {
    id: "typography",
    title: "Typography",
    content: "Typography menggunakan Inter/Outfit untuk heading dan JetBrains Mono untuk tag/token teknis.",
  },
  {
    id: "layout",
    title: "Layout",
    content: "Grid sistem 12-kolom dengan padding 24px/32px dan max-width container 1280px.",
  },
  {
    id: "elevation",
    title: "Elevation & Depth",
    content: "Menggunakan subtle drop shadows (0 12px 28px rgba(0,0,0,0.45)) dan 1px border hairline stroke.",
  },
  {
    id: "shapes",
    title: "Shapes",
    content: "Gunakan {rounded.md} (8px) untuk tombol dan {rounded.lg} (12px) untuk semua rumpun kartu.",
  },
  {
    id: "components",
    title: "Components",
    content: "Semua komponen UI bersifat modular, reusable, dan bebas dari ad-hoc styling tanpa preset.",
  },
  {
    id: "dos_and_donts",
    title: "Do's and Don'ts",
    content: `
### Do
• Use {colors.primary} (purple) as the dominant CTA across all surfaces — it's the brand's recognizable signal.
• Pair deep navy hero bands ({colors.brand-navy}) with the purple button + decorative sticky-note dots.
• Use pastel feature card tints (peach, rose, mint, lavender, sky, yellow) generously.
• Use {colors.card-tint-yellow-bold} for high-emphasis "Ask the assistant"-style banner cards.
• Apply {rounded.md} (8px) to buttons consistently — Notion uses rectangles, not pills.
• Apply {rounded.lg} (12px) to all card families.
• Maintain Notion-Sans across every UI surface.

### Don't
• Do not hardcode static arbitrary pixel offsets when calculating dynamic container bounds.
• Do not use raw default browser red/blue/green colors.
    `,
  },
];

// Universal dynamic parser for markdown sections (#, ##, ###)
function parseMarkdownSections(mdText: string) {
  if (!mdText || !mdText.trim()) return [];

  const lines = mdText.split("\n");
  const sections: { id: string; title: string; content: string }[] = [];
  let currentTitle = "";
  let currentContentLines: string[] = [];

  lines.forEach((line) => {
    // Detect top-level markdown heading: # or ##
    const headingMatch = line.match(/^#{1,2}\s+(.+)$/);
    if (headingMatch) {
      if (currentTitle && currentContentLines.join("").trim()) {
        sections.push({
          id: currentTitle.toLowerCase().replace(/[^\w]+/g, "-"),
          title: currentTitle,
          content: currentContentLines.join("\n").trim(),
        });
      }
      currentTitle = headingMatch[1].trim();
      currentContentLines = [];
    } else if (currentTitle) {
      currentContentLines.push(line);
    }
  });

  // Post-process: Merge separate "Do" and "Don't" sections into a unified "Do's and Don'ts" accordion panel
  const mergedSections: { id: string; title: string; content: string }[] = [];
  let dosAndDontsSection: { id: string; title: string; content: string } | null = null;

  sections.forEach((sec) => {
    const cleanTitle = sec.title.toLowerCase().trim();
    const isDo = cleanTitle === "do" || cleanTitle === "dos" || cleanTitle === "do's";
    const isDont = cleanTitle === "don't" || cleanTitle === "dont" || cleanTitle === "donts" || cleanTitle === "don'ts";
    const isMergedAlready = cleanTitle.includes("do") && cleanTitle.includes("don");

    if (isDo || isDont) {
      if (!dosAndDontsSection) {
        dosAndDontsSection = {
          id: "dos_and_donts",
          title: "Do's and Don'ts",
          content: "",
        };
        mergedSections.push(dosAndDontsSection);
      }

      const headingPrefix = isDo ? "### Do\n" : "### Don't\n";
      dosAndDontsSection.content = (dosAndDontsSection.content ? dosAndDontsSection.content + "\n\n" : "") + headingPrefix + sec.content;
    } else if (isMergedAlready) {
      sec.id = "dos_and_donts";
      sec.title = "Do's and Don'ts";
      mergedSections.push(sec);
    } else {
      mergedSections.push(sec);
    }
  });

  return mergedSections.length > 0 ? mergedSections : [];
}

// Parser for Color Tokens table and YAML key-value pairs
function parseColorTokens(mdText: string): ColorToken[] {
  if (!mdText || !mdText.trim()) return [];

  const tokens: ColorToken[] = [];
  const seen = new Set<string>();

  const lines = mdText.split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("|")) {
      const cells = trimmed
        .split("|")
        .map((c) => c.trim().replace(/^`|`$/g, ""))
        .filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));

      if (cells.length >= 3) {
        const rawToken = cells[0].trim();
        const hexMatch = cells[1].match(/#(?:[0-9a-fA-F]{3,4}){1,2}\b/);
        const role = cells[2].trim();

        if (
          rawToken &&
          hexMatch &&
          !rawToken.toLowerCase().includes("token") &&
          !rawToken.toLowerCase().includes("name") &&
          !seen.has(rawToken)
        ) {
          const hex = hexMatch[0];
          tokens.push({ token: rawToken, hex, role });
          seen.add(rawToken);
        }
      }
    }
  });

  // Key-value format: token: "#hex" or token: #hex
  const kvRegex = /^\s*([\w-]+):\s*["']?(#[0-9a-fA-F]{3,8})["']?/gm;
  let match;
  while ((match = kvRegex.exec(mdText)) !== null) {
    const token = match[1].trim();
    const hex = match[2].trim();
    if (token && hex && !seen.has(token)) {
      tokens.push({ token, hex, role: "Color Token" });
      seen.add(token);
    }
  }

  return tokens;
}

// Format bold (**text**), italic (*text*), backtick code (`code`), and live visual color swatches
function formatMarkdownText(text: string, colorMap: Record<string, string>) {
  if (!text) return "";
  let html = text;

  // Convert **bold** -> <strong>bold</strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: var(--fg-primary); font-weight: 600;">$1</strong>');

  // Convert *italic* -> <em>italic</em>
  html = html.replace(/\*([^*]+)\*/g, '<em style="color: var(--color-mist);">$1</em>');

  // Convert backtick code (`code`) or `{token}` into live color swatches or styled code pills
  html = html.replace(/(`([^`]+)`|\{([^}]+)\})/g, (fullMatch, _g1, codeInside, braceInside) => {
    const rawContent = (codeInside || braceInside || "").trim();

    // Check if rawContent is an explicit Hex Color Code e.g. #f8fafc or #4f46e5
    const hexMatch = rawContent.match(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/);
    if (hexMatch) {
      const hex = hexMatch[0];
      return `<span style="display: inline-flex; align-items: center; gap: 6px; padding: 2px 7px; border-radius: 4px; background: var(--bg-surface); border: 1px solid var(--border-hairline); vertical-align: middle; margin: 0 2px;">
        <span style="width: 12px; height: 12px; border-radius: 3px; background: ${hex}; border: 1px solid rgba(0,0,0,0.15); box-shadow: 0 1px 3px rgba(0,0,0,0.12); display: inline-block;"></span>
        <code style="font-family: var(--font-mono); font-size: 11px; color: var(--fg-primary); font-weight: 700;">${hex}</code>
      </span>`;
    }

    // Check if rawContent matches a known Color Token e.g. bg-base or accent-primary
    const cleanToken = rawContent.replace(/^colors\./, "").trim();
    const tokenHex = colorMap[cleanToken] || colorMap[rawContent];
    if (tokenHex && tokenHex.startsWith("#")) {
      return `<span style="display: inline-flex; align-items: center; gap: 6px; padding: 2px 7px; border-radius: 4px; background: var(--bg-surface); border: 1px solid var(--border-hairline); vertical-align: middle; margin: 0 2px;">
        <span style="width: 12px; height: 12px; border-radius: 3px; background: ${tokenHex}; border: 1px solid rgba(0,0,0,0.15); box-shadow: 0 1px 3px rgba(0,0,0,0.12); display: inline-block;"></span>
        <code style="font-family: var(--font-mono); font-size: 11px; color: #4f46e5; font-weight: 700;">${rawContent}</code>
      </span>`;
    }

    // Default code pill
    return `<code style="background: rgba(99,102,241,0.08); color: #4f46e5; border: 1px solid rgba(99,102,241,0.2); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; font-weight: 600;">${rawContent}</code>`;
  });

  return html;
}


// Block-based Hybrid Renderer for Accordion Content (Cards, Tables, & Badges)
function renderStructuredAccordionContent(content: string, colorMap: Record<string, string>) {
  if (!content || !content.trim()) return null;

  const rawLines = content.split("\n");
  const blocks: Array<
    | { type: "subheader"; text: string; isDo?: boolean; isDont?: boolean }
    | { type: "list"; items: { title: string; token: string; desc: string; subItems?: { title: string; desc: string }[] }[] }
    | { type: "properties"; items: { key: string; val: string }[] }
    | { type: "table"; headers: string[]; rows: string[][] }
    | { type: "paragraph"; text: string }
  > = [];

  let currentListItems: { title: string; token: string; desc: string; subItems?: { title: string; desc: string }[] }[] = [];
  let currentKvItems: { key: string; val: string }[] = [];
  let currentTableRows: string[][] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      blocks.push({ type: "list", items: [...currentListItems] });
      currentListItems = [];
    }
  };

  const flushKv = () => {
    if (currentKvItems.length > 0) {
      blocks.push({ type: "properties", items: [...currentKvItems] });
      currentKvItems = [];
    }
  };

  const flushTable = () => {
    if (currentTableRows.length > 0) {
      const headers = currentTableRows[0];
      const rows = currentTableRows.slice(1);
      blocks.push({ type: "table", headers, rows });
      currentTableRows = [];
    }
  };

  const flushAll = () => {
    flushList();
    flushKv();
    flushTable();
  };

  rawLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushAll();
      return;
    }

    const indent = line.search(/\S/);

    // 1. Check Subheader line e.g. ### Do or ### Don't or ### Section
    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      flushAll();
      const text = trimmed.replace(/^#{2,3}\s+/, "").trim();
      const isDo = text.toLowerCase() === "do";
      const isDont = text.toLowerCase() === "don't" || text.toLowerCase() === "dont";
      blocks.push({ type: "subheader", text, isDo, isDont });
      return;
    }

    // 2. Check explicit markdown table row e.g. | col1 | col2 |
    if (trimmed.startsWith("|")) {
      flushList();
      flushKv();
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));
      if (cells.length > 0 && !cells.every((c) => /^:?-+:?$/.test(c))) {
        currentTableRows.push(cells);
      }
      return;
    }

    // 3. Check Bullet List Item: - or * or •
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      flushKv();
      flushTable();
      const itemText = bulletMatch[1].trim();

      let title = "";
      let desc = itemText;
      let token = "";

      const boldMatch = itemText.match(/^\*\*([^*]+)\*\*\s*(.*)$/);
      if (boldMatch) {
        title = boldMatch[1].trim();
        desc = boldMatch[2].trim();
      } else {
        const splitParts = itemText.split(/[:—–]\s*(.+)/);
        if (splitParts.length >= 2) {
          title = splitParts[0].trim();
          desc = splitParts[1] ? splitParts[1].trim() : "";
        } else {
          title = itemText;
          desc = "";
        }
      }

      const tokenMatch = (title + " " + desc).match(/\{([^}]+)\}/);
      if (tokenMatch) {
        token = tokenMatch[0];
      }

      desc = desc.replace(/^[:—–]\s*/, "");

      if (indent >= 2 && currentListItems.length > 0) {
        const parent = currentListItems[currentListItems.length - 1];
        if (!parent.subItems) parent.subItems = [];
        parent.subItems.push({ title, desc });
      } else {
        currentListItems.push({ title, token, desc, subItems: [] });
      }
      return;
    }

    // 4. Check Key-Value line e.g. fontFamily: Notion Sans or fontSize: 80px
    const kvMatch = trimmed.match(/^([\w-]+):\s*(.+)$/);
    if (kvMatch && !trimmed.startsWith("http")) {
      flushList();
      flushTable();
      currentKvItems.push({
        key: kvMatch[1].trim(),
        val: kvMatch[2].trim(),
      });
      return;
    }

    // 5. Regular paragraph text
    flushAll();
    blocks.push({ type: "paragraph", text: trimmed });
  });

  flushAll();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
      {blocks.map((block, bIdx) => {
        if (block.type === "subheader") {
          if (block.isDo || block.isDont) {
            return (
              <div
                key={bIdx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: block.isDo
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(239,68,68,0.1)",
                  border: `1px solid ${block.isDo ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  color: block.isDo ? "#4ade80" : "#f87171",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 8,
                  alignSelf: "flex-start",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: block.isDo ? "#22c55e" : "#ef4444",
                  }}
                />
                {block.text}
              </div>
            );
          }

          return (
            <div
              key={bIdx}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--fg-primary)",
                marginTop: 10,
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 3, height: 12, borderRadius: 2, background: "var(--color-signal)" }} />
              {block.text}
            </div>
          );
        }

        if (block.type === "list") {
          return (
            <div key={bIdx} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {block.items.map((item, rIdx) => (
                <div
                  key={rIdx}
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-hairline)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-signal)", flexShrink: 0 }} />
                    <span
                      style={{ fontWeight: 700, fontSize: 13, color: "var(--fg-primary)" }}
                      dangerouslySetInnerHTML={{ __html: formatMarkdownText(item.title, colorMap) }}
                    />
                    {item.token && (
                      <span dangerouslySetInnerHTML={{ __html: formatMarkdownText(item.token, colorMap) }} />
                    )}
                  </div>
                  {item.desc && (
                    <div
                      style={{ paddingLeft: 14, fontSize: 12.5, color: "var(--color-mist)", lineHeight: 1.55 }}
                      dangerouslySetInnerHTML={{ __html: formatMarkdownText(item.desc, colorMap) }}
                    />
                  )}
                  {item.subItems && item.subItems.length > 0 && (
                    <div style={{ marginLeft: 14, marginTop: 6, paddingLeft: 10, borderLeft: "2px solid var(--border-hairline)", display: "flex", flexDirection: "column", gap: 6 }}>
                      {item.subItems.map((sub, sIdx) => (
                        <div key={sIdx} style={{ fontSize: 12, color: "var(--fg-secondary)", lineHeight: 1.5, display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--fg-muted)", flexShrink: 0 }} />
                          <span dangerouslySetInnerHTML={{ __html: formatMarkdownText(sub.title + (sub.desc ? `: ${sub.desc}` : ""), colorMap) }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        }


        if (block.type === "properties") {
          return (
            <div key={bIdx} style={{ border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-hairline)", background: "rgba(255,255,255,0.03)" }}>
                    <th style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", width: "40%" }}>PROPERTY</th>
                    <th style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase" }}>VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {block.items.map((kv, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: rIdx < block.items.length - 1 ? "1px solid var(--border-hairline)" : "none" }}>
                      <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--fg-secondary)" }}>
                        {kv.key}
                      </td>
                      <td
                        style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-signal)" }}
                        dangerouslySetInnerHTML={{ __html: formatMarkdownText(kv.val, colorMap) }}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "table") {
          return (
            <div key={bIdx} style={{ border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-hairline)", background: "rgba(255,255,255,0.03)" }}>
                    {block.headers.map((cell, cIdx) => (
                      <th key={cIdx} style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase" }}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: rIdx < block.rows.length - 1 ? "1px solid var(--border-hairline)" : "none" }}>
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          style={{ padding: "10px 14px", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--fg-primary)" }}
                          dangerouslySetInnerHTML={{ __html: formatMarkdownText(cell, colorMap) }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <div
            key={bIdx}
            dangerouslySetInnerHTML={{ __html: formatMarkdownText(block.text, colorMap) }}
            style={{ color: "var(--color-mist)", lineHeight: 1.6 }}
          />
        );
      })}
    </div>
  );
}

function ProjectDetailContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ dos_and_donts: true, overview: true });
  const [showMcpModal, setShowMcpModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const [isDragging, setIsDragging] = useState(false);

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
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "6px 12px", borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
    cursor: "pointer", border: "1px solid var(--border-hairline)",
    background: "var(--bg-elevated)", color: "var(--fg-secondary)",
    transition: "all 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-ink)", color: "var(--fg-primary)" }}>
      {showMcpModal && projectId && (
        <McpConnectModal projectId={projectId} appName={project?.appName} onClose={() => setShowMcpModal(false)} />
      )}

      {/* ── Topbar ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 52, borderBottom: "1px solid var(--border-hairline)", background: "rgba(16,24,43,0.96)", backdropFilter: "blur(12px)" }}>
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
              /* ── Drag & Drop Dropzone Card when design.md is missing ── */
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                style={{
                  background: isDragging ? "rgba(255,182,39,0.06)" : "var(--bg-surface)",
                  border: `2px dashed ${isDragging ? "var(--color-signal)" : "var(--border-hairline)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "56px 32px",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  marginTop: 24,
                  boxShadow: isDragging ? "0 0 24px rgba(255,182,39,0.15)" : "none",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "rgba(255,182,39,0.08)",
                    border: "1px solid rgba(255,182,39,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Upload size={26} style={{ color: "var(--color-signal)" }} />
                </div>

                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--fg-primary)", marginBottom: 8 }}>
                  Belum Ada File design.md yang Diunggah
                </h3>

                <p style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-mist)", maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.6 }}>
                  Unggah file <code style={{ color: "var(--color-signal)", fontFamily: "var(--font-mono)" }}>design.md</code> milik project ini agar AI Agent (Antigravity/Cursor/Windsurf) dapat membaca token warna, typography, layout, dan aturan komponen UI secara otomatis via MCP Server.
                </p>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 24px",
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
                      boxShadow: "0 4px 14px rgba(255,182,39,0.2)",
                    }}
                  >
                    <Upload size={14} /> {isUploading ? "Uploading..." : "Pilih File design.md (.md, .txt)"}
                    <input type="file" accept=".md,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
                  </label>

                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)" }}>
                    atau tarik & lepas file ke dalam area kotak di atas
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* ── Project Header Card ── */}
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "28px 32px", marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--border-hairline)", background: "rgba(255,182,39,0.08)", color: "var(--color-signal)", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                        <Sparkles size={11} /> Project Overview & Design Specs
                      </div>
                      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "var(--fg-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                        {project?.appName}
                      </h1>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-mist)", lineHeight: 1.6, maxWidth: 720 }}>
                        {project?.appIdea}
                      </p>
                    </div>

                    <label style={{ ...btn, background: isUploading ? "var(--bg-elevated)" : "rgba(79,209,197,0.1)", borderColor: "rgba(79,209,197,0.35)", color: "var(--color-circuit)", cursor: "pointer" }}>
                      <Upload size={12} /> {isUploading ? "Uploading..." : "Re-upload design.md"}
                      <input type="file" accept=".md,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
                    </label>
                  </div>

                  {/* Tech Stacks list */}
                  {formInputs?.stacks && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, paddingTop: 16, borderTop: "1px dashed var(--border-hairline)" }}>
                      {Object.entries(formInputs.stacks).map(([key, val]) => (
                        val ? (
                          <span key={key} style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--border-hairline)", background: "var(--bg-elevated)", color: "var(--fg-secondary)" }}>
                            <span style={{ color: "var(--fg-muted)", textTransform: "uppercase" }}>{key}:</span> {val as string}
                          </span>
                        ) : null
                      ))}
                    </div>
                  )}
                </div>
                {/* ── Section 1: Visual COLOR TOKENS Table ── */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
                      COLOR TOKENS
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-circuit)" }}>
                      {colorTokens.length} Tokens Defined
                    </span>
                  </div>

                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-hairline)", background: "rgba(255,255,255,0.02)" }}>
                          <th style={{ padding: "12px 18px", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--fg-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>TOKEN</th>
                          <th style={{ padding: "12px 18px", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--fg-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>HEX</th>
                          <th style={{ padding: "12px 18px", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--fg-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>ROLE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {colorTokens.map((ct, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < colorTokens.length - 1 ? "1px solid var(--border-hairline)" : "none" }}>
                            {/* Token name */}
                            <td style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                              <span
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 4,
                                  background: ct.hex,
                                  border: "1px solid rgba(255,255,255,0.15)",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                                  flexShrink: 0,
                                }}
                              />
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--fg-primary)" }}>
                                {ct.token}
                              </span>
                            </td>
                            {/* HEX code */}
                            <td style={{ padding: "12px 18px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-signal)" }}>
                              {ct.hex}
                            </td>
                            {/* Role */}
                            <td style={{ padding: "12px 18px", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-mist)" }}>
                              {ct.role}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Section 2: Full Accordions for design.md ── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
                      DESIGN SPECIFICATIONS & GUIDELINES
                    </span>
                    {projectId && (
                      <a href={`/api/projects/raw-design?projectId=${projectId}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-circuit)", textDecoration: "none" }}>
                        View Raw .md <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {sections.map((sec) => {
                      const isOpen = !!openAccordions[sec.id];
                      return (
                        <div
                          key={sec.id}
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-hairline)",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                            transition: "border-color 0.15s",
                          }}
                        >
                          {/* Accordion Header */}
                          <button
                            onClick={() => toggleAccordion(sec.id)}
                            style={{
                              width: "100%",
                              padding: "16px 20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>
                              {sec.title}
                            </h3>
                            {isOpen ? (
                              <ChevronDown size={18} style={{ color: "var(--color-signal)" }} />
                            ) : (
                              <ChevronRight size={18} style={{ color: "var(--fg-muted)" }} />
                            )}
                          </button>

                          {/* Accordion Content Body */}
                          {isOpen && (
                            <div
                              style={{
                                padding: "0 20px 20px",
                                borderTop: "1px solid var(--border-hairline)",
                                fontFamily: "var(--font-body)",
                                fontSize: 13,
                                color: "var(--color-mist)",
                                lineHeight: 1.65,
                                whiteSpace: "pre-line",
                              }}
                            >
                              {(() => {
                                const colorMap: Record<string, string> = {};
                                colorTokens.forEach((ct) => {
                                  colorMap[ct.token] = ct.hex;
                                  colorMap[`colors.${ct.token}`] = ct.hex;
                                });

                                return renderStructuredAccordionContent(sec.content, colorMap);
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
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
