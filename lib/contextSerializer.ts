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
  parts.push(renderSystemDirectives(data.directives));

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

function renderSystemDirectives(directives: ContextInput["directives"]): string {
  const { antiHallucinationRules, codeQuality, tasteSkill } = directives;

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
  <anti_hallucination_rules severity="${escapeXml(antiHallucinationRules.severity)}">
${rulesBlock}
  </anti_hallucination_rules>

${hierarchyBlock}

${selfCheckBlock}

${tsBlock}

${tasteBlock}
</system_directives>`;
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
