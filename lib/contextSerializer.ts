import type { ColorToken, DesignSection } from "./designParser";

// ============================================================================
// Hybrid Context Serializer (XML + Markdown + JSON)
// ============================================================================
// Converts the full project context object into a hybrid format optimized
// for AI Agent attention mechanisms. Directives go first (highest priority),
// followed by personalization inputs, project metadata, structure, PRD
// (unescaped Markdown), design data, and tasks.
//
// Token-efficiency rules applied here:
//   - Raw Markdown / JSON payloads are wrapped in XML CDATA so content that
//     contains `<`, `>`, `&` (mermaid arrows, JSX, code) can NEVER break the
//     XML parsing (previously unescaped).
//   - Data-only JSON (structure, tasks, color tokens, directives) is emitted
//     COMPACT (no indentation) to avoid ~20% token inflation.
//   - <design_sections> is dropped from the context: it is derived from the
//     same raw markdown, so tokens + raw markdown fully cover it.
// ============================================================================

interface ProjectMeta {
  id: string;
  appName: string;
  appIdea: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface AntiHallucinationRule {
  id: string;
  rule: string;
  validation: string;
  failure_consequence: string;
}

interface DesignHierarchy {
  rule: string;
  level1_ground_truth: string;
  level2_engineering_quality: string;
  conflictResolution: string;
}

interface AntiHallucinationRules {
  severity: string;
  rules: AntiHallucinationRule[];
  designHierarchy: DesignHierarchy;
  selfCheckPrompt: string;
}

interface CodeQuality {
  severity: string;
  typeScript: {
    FORBIDDEN: string[];
    REQUIRED: string[];
    example: string;
  };
  architecture: {
    rules: string[];
  };
  componentStructure: {
    order: string[];
  };
}

interface TasteSkillData {
  name: string;
  version: string;
  activeSkillKey: string;
  activeSkillContent: string;
  routerInfo: {
    selectedReason: string;
    availableSkills: string[];
    fetchOtherSkillInstruction: string;
  };
  tasteSkillDirectives: Record<string, unknown>;
  codeSkeletons: Record<string, string>;
  examples: Record<string, Record<string, string>>;
}

interface DesignData {
  colorTokens: ColorToken[];
  sections: DesignSection[];
  rawMarkdown: string;
}

interface ContextInput {
  project: ProjectMeta;
  formInputs?: Record<string, unknown> | null;
  structure: Record<string, unknown> | null;
  prd: string;
  design: DesignData;
  tasks: unknown;
  taskStatuses: Record<string, string>;
  directives: {
    antiHallucinationRules: AntiHallucinationRules;
    codeQuality: CodeQuality;
    tasteSkill: TasteSkillData;
  };
}

/**
 * Serialize the full project context into Hybrid format (XML + Markdown + JSON).
 *
 * Layout priority (top → bottom = highest → lowest attention weight):
 *   1. Snapshot comment       — generatedAt vs project updatedAt (freshness gate AH-017)
 *   2. <system_directives>    — Anti-hallucination rules, code quality, taste skill
 *   3. <project_context>      — Project metadata (JSON)
 *   4. <personalization_inputs> — 7-step answers + tech stack (formInputs)
 *   5. <structure>            — Feature mindmap / architecture nodes (compact JSON)
 *   6. <prd_document>         — Full PRD as readable Markdown (CDATA)
 *   7. <design_data>          — Color tokens (compact JSON) + raw design markdown (CDATA)
 *   8. <task_list>            — Phases & task statuses (compact JSON)
 */
export function serializeContextToHybrid(data: ContextInput): string {
  const parts: string[] = [];

  // ── 0. SNAPSHOT FRESHNESS MARKER (highest visibility, minimal tokens) ──
  parts.push(renderSnapshotComment());

  // ── 1. SYSTEM DIRECTIVES ──────────────────────────────────────────────
  parts.push(renderSystemDirectives(data.directives, data.design));

  // ── 2. PROJECT CONTEXT ────────────────────────────────────────────────
  parts.push(renderProjectContext(data.project));

  // ── 3. PERSONALIZATION INPUTS (formInputs) ────────────────────────────
  if (data.formInputs) {
    parts.push(renderPersonalizationInputs(data.formInputs));
  }

  // ── 4. STRUCTURE ──────────────────────────────────────────────────────
  if (data.structure) {
    parts.push(renderStructure(data.structure));
  }

  // ── 5. PRD DOCUMENT ───────────────────────────────────────────────────
  if (data.prd) {
    parts.push(renderPrd(data.prd));
  }

  // ── 6. DESIGN DATA ────────────────────────────────────────────────────
  parts.push(renderDesignData(data.design));

  // ── 7. TASK LIST ──────────────────────────────────────────────────────
  parts.push(renderTaskList(data.tasks, data.taskStatuses));

  return parts.join("\n\n");
}

// ============================================================================
// XML safety helpers
// ============================================================================

/** Escape `&`, `<`, `>` for short XML text content (attributes + prose). */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Wrap arbitrary content (Markdown, JSON, code) in a CDATA section so angle
 * brackets inside the content can never terminate the XML element early.
 * Handles the only illegal sequence `]]>` by splitting it.
 */
function cdata(value: string): string {
  const safe = String(value).replace(/\]\]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[\n${safe}\n]]>`;
}

/** Compact JSON (no indentation) for token-heavy data blocks. */
function compactJson(value: unknown): string {
  return JSON.stringify(value);
}

// ============================================================================
// Render helpers
// ============================================================================

function renderSnapshotComment(): string {
  const generatedAt = new Date().toISOString();
  return `<!-- Piardify Context Snapshot
     generatedAt   : ${generatedAt}
     NOTE          : Jika <project_context>.updatedAt lebih baru dari generatedAt, konteks ini BASI.
                     Jalankan 'npx piardify init' atau '.piardify/sync context > .piardify/context.md' untuk refresh (AH-017). -->`;
}

function renderSystemDirectives(directives: ContextInput["directives"], design?: DesignData): string {
  const { antiHallucinationRules, codeQuality, tasteSkill } = directives;

  // Critical Design Locks & Layout Governance (Top-of-File Pinning - Solusi 1 & 4)
  const criticalLocksBlock = renderCriticalDesignLocks(design);
  const layoutGovernanceBlock = renderLayoutGovernance();
  const currencyDirectivesBlock = renderCurrencyDirectives();

  // Anti-Hallucination Rules
  const rulesBlock = antiHallucinationRules.rules
    .map(
      (r) => `  <rule id="${escapeXml(r.id)}">
    ${escapeXml(r.rule)}
    - Validation: ${escapeXml(r.validation)}
    - Failure: ${escapeXml(r.failure_consequence)}
  </rule>`
    )
    .join("\n");

  // Design Hierarchy
  const dh = antiHallucinationRules.designHierarchy;
  const hierarchyBlock = `  <design_hierarchy>
    Rule: ${escapeXml(dh.rule)}
    Level 1 (Ground Truth): ${escapeXml(dh.level1_ground_truth)}
    Level 2 (Engineering Quality): ${escapeXml(dh.level2_engineering_quality)}
    Conflict Resolution: ${escapeXml(dh.conflictResolution)}
  </design_hierarchy>`;

  const selfCheckBlock = `  <self_check_prompt>${escapeXml(antiHallucinationRules.selfCheckPrompt)}</self_check_prompt>`;

  // Code Quality
  const tsBlock = `  <code_quality severity="${escapeXml(codeQuality.severity)}">
    <typescript>
      <forbidden>
${codeQuality.typeScript.FORBIDDEN.map((f) => `        - ${escapeXml(f)}`).join("\n")}
      </forbidden>
      <required>
${codeQuality.typeScript.REQUIRED.map((r) => `        - ${escapeXml(r)}`).join("\n")}
      </required>
    </typescript>
    <architecture>
${codeQuality.architecture.rules.map((r) => `      - ${escapeXml(r)}`).join("\n")}
    </architecture>
    <component_structure>
${codeQuality.componentStructure.order.map((o) => `      ${escapeXml(o)}`).join("\n")}
    </component_structure>
    <example>
${cdata(codeQuality.typeScript.example)}
    </example>
  </code_quality>`;

  // Taste Skill — active skill content as raw Markdown (CDATA-wrapped)
  const ts = tasteSkill;
  const tasteBlock = `  <taste_skill name="${escapeXml(ts.name)}" version="${escapeXml(ts.version)}" active_key="${escapeXml(ts.activeSkillKey)}">
    <router_info>
      Selected Reason: ${escapeXml(ts.routerInfo.selectedReason)}
      Available Skills: ${escapeXml(ts.routerInfo.availableSkills.join(", "))}
      Fetch Other: ${escapeXml(ts.routerInfo.fetchOtherSkillInstruction)}
    </router_info>
    <active_skill_content>
${cdata(ts.activeSkillContent)}
    </active_skill_content>
    <taste_directives>
${cdata(compactJson(ts.tasteSkillDirectives))}
    </taste_directives>
    <code_skeletons>
${renderCodeSkeletons(ts.codeSkeletons)}
    </code_skeletons>
    <examples>
${renderExamples(ts.examples)}
    </examples>
  </taste_skill>`;

  return `<system_directives>
${criticalLocksBlock}

${layoutGovernanceBlock}

${currencyDirectivesBlock}

  <anti_hallucination_rules severity="${escapeXml(antiHallucinationRules.severity)}">
${rulesBlock}
  </anti_hallucination_rules>

${hierarchyBlock}

${selfCheckBlock}

${tsBlock}

${tasteBlock}
</system_directives>`;
}

function renderCriticalDesignLocks(design?: DesignData): string {
  const primaryColor = design?.colorTokens?.find(t => t.role.toLowerCase().includes("accent") || t.role.toLowerCase().includes("primary"))?.hex || "#6366F1";

  return `  <critical_design_locks>
    <core_identity>Distinctive — Premium — Usable (Intentional, Human-Designed, Visually Memorable)</core_identity>
    <color_palette>
      - HEX_MAIN_BG: "#090A0C" (Obsidian Dark - FORBIDDEN: Pure Black #000000 or Navy #0F172A)
      - HEX_SURFACE_LEVEL1: "#121318"
      - HEX_SURFACE_LEVEL2: "#181A22"
      - HEX_SURFACE_HOVER: "#222634"
      - HEX_ACCENT_PRIMARY: "${primaryColor}"
      - COLOR_RESTRICTION: "Max 1 dominant accent, max 2 functional status colors. NO neon glows or purple-on-dark slop."
    </color_palette>
    <typography_rules>
      - HEADLINE_TRACKING: "Tight tracking (tracking-tight / -0.02em to -0.04em) on headlines >= 32px"
      - LABEL_TRACKING: "Relaxed tracking (tracking-wider / +0.05em) on small labels <= 12px"
      - LINE_MEASURE: "Limit paragraph width to 45-75 characters (max-w-prose)"
      - PAIRING: "Max 2 font families (1 display + 1 neutral sans/mono). Max 3 font weights per component."
    </typography_rules>
    <shape_radius_strategy>
      - RADIUS_HIERARCHY: "Sharp (0-4px) for data/financials/tables; Subtle (4-8px) for forms/cards; Pill (9999px) ONLY for status tags"
      - FORBIDDEN: "Do NOT apply rounded-2xl to everything indiscriminately (Anti Everything-Rounded Slop)"
    </shape_radius_strategy>
    <iconography_discipline>
      - PLACEMENT: "Self-standing inline icons or inside action buttons"
      - FORBIDDEN: "Icon Container Syndrome (p-3 rounded-xl bg-purple-500/10 boxes above headings)"
    </iconography_discipline>
    <motion_subsystem>
      - DURATION: "150ms - 250ms with spring physics or cubic-bezier(0.16, 1, 0.3, 1)"
      - FORBIDDEN: "Slow 800ms fade-in-up scroll delays, typewriter loops, or glitch cursor slop"
    </motion_subsystem>
  </critical_design_locks>`;
}

function renderLayoutGovernance(): string {
  return `  <layout_governance>
    <principles>
      - FUNCTION_DRIVEN_LAYOUT: Layout disesuaikan dengan skenario penggunaan (Focus Mode, Data Split, Canvas). Dilarang menjadikan dashboard grid 3-kolom sebagai default.
      - WHITESPACE_OVER_BORDERS: Gunakan padding/margin dan perbedaan kontras surface, BUKAN border warna-warni atau outline solid tebal.
      - TYPOGRAPHIC_HIERARCHY: Bedakan informasi dengan font-weight, kerning (letter-spacing), dan font-size contrast.
      - FLUID_RESPONSIVENESS: Komponen internal wajib adaptif tanpa fixed pixel width (misal w-[342px]) dan gunakan min-h-[100dvh] atau min-h-screen (bukan h-screen).
      - BRAND_REMOVAL_TEST: UI harus tetap terlihat unik dan human-designed bahkan ketika logo dan nama brand dilepas.
    </principles>
    <forbidden_ui_slop>
      - FORBIDDEN_PATTERNS: [
          "Card-inside-card nested > 2 levels",
          "Icon-stuffed bento box without clear semantic priority",
          "Icon Container Syndrome (wrapping every icon in p-3 rounded-xl colored box)",
          "Headline biscuit/pill badge with pulsing dots",
          "Gradient text fill on headline keywords (text-transparent bg-gradient-to-r)",
          "Colored border accents or glowing colored outlines",
          "Purple/Violet accents on dark theme backgrounds",
          "Indiscriminate rounded-2xl on all containers",
          "Pure Black #000000 or Navy #0F172A background slop"
        ]
    </forbidden_ui_slop>
    <anti_slop_20point_audit>
      1. Layout bebas dari susunan klise 'Hero -> 3 Bento Cards -> Pricing'?
      2. Memiliki alur hierarki visual yang intentional?
      3. Bebas dari cardification berlebihan (nested cards > 2 level)?
      4. Radius sudut bervariasi proporsional (bukan rounded-2xl seragam)?
      5. Badge/pill hanya untuk status riil, bukan dekorasi kosong?
      6. Bebas dari Icon Container Syndrome (kotak ikon kecil generik)?
      7. Jumlah warna aksen dibatasi (<= 1 dominan, <= 2 fungsional)?
      8. Warna ungu/biru dihindari jika tidak sesuai brand context?
      9. Bebas dari neon glow dan shadow raksasa pencemar teks?
      10. Gradasi warna dibatasi hanya untuk lighting simulation?
      11. Glassmorphism terbatas max 1 layer fungsional (sticky header)?
      12. Border dan divider memiliki alasan struktural nyata?
      13. Tipografi memiliki kontras skala & tracking optik presisi?
      14. Panjang baris paragraf 45-75 karakter?
      15. Library ikon seragam dan konsisten?
      16. Animasi mempunyai fungsi tactile real-time (150-250ms)?
      17. Interaksi mikro terasa taktil dan responsif?
      18. Layout mobile dirancang ulang secara ergonomis (thumb-zone)?
      19. Desain memiliki kepribadian sesuai domain produk?
      20. Lolos Subtractive Polish (bebas elemen visual sampah)?
    </anti_slop_20point_audit>
  </layout_governance>`;
}

function renderCurrencyDirectives(): string {
  return `  <currency_directives>
    <formatting_rules>
      - IDR >= 1.000.000.000 -> "Rp X,XX M" (Miliar)
      - IDR >= 1.000.000 -> "Rp X,XX Jt" (Juta) (misal: Rp 13,95 Jt)
      - IDR >= 100.000 -> "Rp XXX Rb" (Ribu)
      - PURPOSE: Prevents layout overflow & numeric truncation in UI data cards and tables.
    </formatting_rules>
  </currency_directives>`;
}

function renderProjectContext(project: ProjectMeta): string {
  return `<project_context>
${cdata(JSON.stringify(project, null, 2))}
</project_context>`;
}

function renderPersonalizationInputs(formInputs: Record<string, unknown>): string {
  return `<personalization_inputs>
${cdata(compactJson(formInputs))}
</personalization_inputs>`;
}

function renderStructure(structure: Record<string, unknown>): string {
  return `<structure>
${cdata(compactJson(structure))}
</structure>`;
}

function renderPrd(prd: string): string {
  // The PRD is already a Markdown string — emit it raw (CDATA protects any
  // `<` like mermaid arrows from breaking XML parsing).
  return `<prd_document>
${cdata(prd)}
</prd_document>`;
}

function renderDesignData(design: DesignData): string {
  // Color tokens (compact, fast-lookup index) + raw design markdown (CDATA).
  // design_sections is intentionally omitted: it is derived from the same
  // raw markdown, so shipping it again is pure token waste.
  return `<design_data>
  <color_tokens>
${cdata(compactJson(design.colorTokens))}
  </color_tokens>

  <raw_design_markdown>
${cdata(design.rawMarkdown)}
  </raw_design_markdown>
</design_data>`;
}

function renderTaskList(tasks: unknown, taskStatuses: Record<string, string>): string {
  return `<task_list>
${cdata(compactJson({ phases: tasks, taskStatuses }))}
</task_list>`;
}

function renderCodeSkeletons(skeletons: Record<string, string>): string {
  return Object.entries(skeletons)
    .map(
      ([name, code]) => `      <skeleton name="${escapeXml(name)}">
${cdata(code)}
      </skeleton>`
    )
    .join("\n");
}

function renderExamples(examples: Record<string, Record<string, string>>): string {
  return Object.entries(examples)
    .map(([category, items]) => {
      const itemsStr = Object.entries(items)
        .map(
          ([name, code]) => `        <example name="${escapeXml(name)}">
${cdata(code)}
        </example>`
        )
        .join("\n");
      return `      <category name="${escapeXml(category)}">
${itemsStr}
      </category>`;
    })
    .join("\n");
}
