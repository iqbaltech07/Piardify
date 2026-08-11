import type { ColorToken, DesignSection } from "./designParser";

// ============================================================================
// Hybrid Context Serializer (XML + Markdown + JSON)
// ============================================================================
// Converts the full project context object into a hybrid format optimized
// for AI Agent attention mechanisms. Directives go first (highest priority),
// followed by project metadata, structure, PRD (unescaped Markdown), design
// data, and tasks. This reduces ~26% token waste compared to pure JSON.
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
 *   1. <system_directives>  — Anti-hallucination rules, code quality, taste skill
 *   2. <project_context>    — Project metadata (JSON)
 *   3. <structure>          — Feature mindmap / architecture nodes (JSON)
 *   4. <prd_document>       — Full PRD as readable Markdown
 *   5. <design_data>        — Color tokens (JSON) + raw design markdown
 *   6. <task_list>          — Phases & task statuses (JSON)
 */
export function serializeContextToHybrid(data: ContextInput): string {
  const parts: string[] = [];

  // ── 1. SYSTEM DIRECTIVES (highest priority) ──────────────────────────
  parts.push(renderSystemDirectives(data.directives));

  // ── 2. PROJECT CONTEXT ───────────────────────────────────────────────
  parts.push(renderProjectContext(data.project));

  // ── 3. STRUCTURE ─────────────────────────────────────────────────────
  if (data.structure) {
    parts.push(renderStructure(data.structure));
  }

  // ── 4. PRD DOCUMENT ──────────────────────────────────────────────────
  if (data.prd) {
    parts.push(renderPrd(data.prd));
  }

  // ── 5. DESIGN DATA ──────────────────────────────────────────────────
  parts.push(renderDesignData(data.design));

  // ── 6. TASK LIST ─────────────────────────────────────────────────────
  parts.push(renderTaskList(data.tasks, data.taskStatuses));

  return parts.join("\n\n");
}

// ============================================================================
// Render helpers
// ============================================================================

function renderSystemDirectives(directives: ContextInput["directives"]): string {
  const { antiHallucinationRules, codeQuality, tasteSkill } = directives;

  // Anti-Hallucination Rules
  const rulesBlock = antiHallucinationRules.rules
    .map(
      (r) =>
        `  <rule id="${r.id}">
    ${r.rule}
    - Validation: ${r.validation}
    - Failure: ${r.failure_consequence}
  </rule>`
    )
    .join("\n");

  // Design Hierarchy
  const dh = antiHallucinationRules.designHierarchy;
  const hierarchyBlock = `  <design_hierarchy>
    Rule: ${dh.rule}
    Level 1 (Ground Truth): ${dh.level1_ground_truth}
    Level 2 (Engineering Quality): ${dh.level2_engineering_quality}
    Conflict Resolution: ${dh.conflictResolution}
  </design_hierarchy>`;

  const selfCheckBlock = `  <self_check_prompt>${antiHallucinationRules.selfCheckPrompt}</self_check_prompt>`;

  // Code Quality
  const tsBlock = `  <code_quality severity="${codeQuality.severity}">
    <typescript>
      <forbidden>
${codeQuality.typeScript.FORBIDDEN.map((f) => `        - ${f}`).join("\n")}
      </forbidden>
      <required>
${codeQuality.typeScript.REQUIRED.map((r) => `        - ${r}`).join("\n")}
      </required>
    </typescript>
    <architecture>
${codeQuality.architecture.rules.map((r) => `      - ${r}`).join("\n")}
    </architecture>
    <component_structure>
${codeQuality.componentStructure.order.map((o) => `      ${o}`).join("\n")}
    </component_structure>
  </code_quality>`;

  // Taste Skill — active skill content as raw Markdown (unescaped)
  const ts = tasteSkill;
  const tasteBlock = `  <taste_skill name="${ts.name}" version="${ts.version}" active_key="${ts.activeSkillKey}">
    <router_info>
      Selected Reason: ${ts.routerInfo.selectedReason}
      Available Skills: ${ts.routerInfo.availableSkills.join(", ")}
      Fetch Other: ${ts.routerInfo.fetchOtherSkillInstruction}
    </router_info>
    <active_skill_content>
${ts.activeSkillContent}
    </active_skill_content>
    <taste_directives>
${JSON.stringify(ts.tasteSkillDirectives, null, 2).split("\n").map((l) => `      ${l}`).join("\n")}
    </taste_directives>
    <code_skeletons>
${renderCodeSkeletons(ts.codeSkeletons)}
    </code_skeletons>
    <examples>
${renderExamples(ts.examples)}
    </examples>
  </taste_skill>`;

  return `<system_directives>
  <anti_hallucination_rules severity="${antiHallucinationRules.severity}">
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
${JSON.stringify(project, null, 2)}
</project_context>`;
}

function renderStructure(structure: Record<string, unknown>): string {
  return `<structure>
${JSON.stringify(structure, null, 2)}
</structure>`;
}

function renderPrd(prd: string): string {
  // The PRD is already a Markdown string — just emit it raw (unescaped).
  return `<prd_document>
${prd}
</prd_document>`;
}

function renderDesignData(design: DesignData): string {
  const tokensJson = JSON.stringify(design.colorTokens, null, 2);
  const sectionsJson = JSON.stringify(design.sections, null, 2);

  return `<design_data>
  <color_tokens>
${tokensJson}
  </color_tokens>

  <design_sections>
${sectionsJson}
  </design_sections>

  <raw_design_markdown>
${design.rawMarkdown}
  </raw_design_markdown>
</design_data>`;
}

function renderTaskList(tasks: unknown, taskStatuses: Record<string, string>): string {
  return `<task_list>
${JSON.stringify({ phases: tasks, taskStatuses }, null, 2)}
</task_list>`;
}

function renderCodeSkeletons(skeletons: Record<string, string>): string {
  return Object.entries(skeletons)
    .map(
      ([name, code]) =>
        `      <skeleton name="${name}">
\`\`\`tsx
${code}
\`\`\`
      </skeleton>`
    )
    .join("\n");
}

function renderExamples(examples: Record<string, Record<string, string>>): string {
  return Object.entries(examples)
    .map(([category, items]) => {
      const itemsStr = Object.entries(items)
        .map(
          ([name, code]) =>
            `        <example name="${name}">
\`\`\`tsx
${code}
\`\`\`
        </example>`
        )
        .join("\n");
      return `      <category name="${category}">
${itemsStr}
      </category>`;
    })
    .join("\n");
}
