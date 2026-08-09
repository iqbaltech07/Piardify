import { ALL_TASTE_SKILLS, codeSkeletons } from "./tasteSkills";

export const TASTE_SKILL_DIRECTIVES = {
  name: "taste-skill-v2",
  version: "2.1.0-modular",
  description: "Modular Taste Skill Library from Knowledge OS Second Brain",

  // ==========================================
  // AUTOMATED SKILL ROUTER (AH-011)
  // ==========================================
  designSkillRouter: {
    rule: "AI Agent MUST match project design style from design.style/vibe in .piardify/context.json to the exact skill key in directives.tasteSkill.skills",
    skillMapping: [
      { keywords: ["minimalist", "editorial", "calm", "document", "document-style", "clean"], targetSkill: "skills.minimalistUi" },
      { keywords: ["luxury", "high-end", "vanguard", "agency", "150k", "apple"], targetSkill: "skills.highEndVisualDesign" },
      { keywords: ["awwwards", "gsap", "motion", "kinetic", "interactive"], targetSkill: "skills.gptTaste" },
      { keywords: ["stitch", "semantic", "google-stitch", "design.md"], targetSkill: "skills.stitchDesignTaste" },
      { keywords: ["redesign", "overhaul", "legacy", "refactor"], targetSkill: "skills.redesignExistingProjects" },
      { keywords: ["saas", "landing", "default", "marketing"], targetSkill: "skills.designTasteFrontend" }
    ],
    mandatoryDeclaration: "AI Agent MUST output '🎨 Design Skill Active: <targetSkill>' before generating any Frontend UI components."
  },

  // ==========================================
  // CATEGORY 1: CORE DIRECTIVES & STORYTELLING FRAMEWORK
  // ==========================================
  tasteSkillDirectives: {
    briefInference: {
      rule: "Sebelum menulis kode UI, analisa konteks produk & deklarasikan satu arah desain yang eksplisit (misal: Minimalist Editorial, High-Density Technical SaaS, Swiss Brutalist, Soft Calming Workspace, atau Warm Industrial).",
      forbiddenDefaults: "Dilarang keras memakai safe default otomatis (misal: background ungu-cyan gradient + 3 card simetris + hero centered)."
    },
    threeDials: {
      variance: "DESIGN_VARIANCE: 8 (1 = Perfect Symmetry, 10 = Artsy Chaos)",
      motion: "MOTION_INTENSITY: 6 (1 = Static, 10 = Cinematic / Physics)",
      density: "VISUAL_DENSITY: 4 (1 = Art Gallery / Airy, 10 = Cockpit / Packed Data)"
    },
    designLocks: {
      colorConsistencyLock: "Gunakan 1 sistem warna aksen utama untuk seluruh halaman.",
      shapeConsistencyLock: "Gunakan 1 sistem corner-radius konsisten per halaman.",
      pageThemeLock: "Tetapkan tema (light atau dark mode) pada root halaman."
    },
    heroDiscipline: {
      headline: "Maksimal 2 baris pada tampilan desktop dengan value proposition yang spesifik.",
      subtext: "Maksimal 20 kata / 4 baris.",
      primaryCTA: "Wajib terlihat langsung tanpa perlu scroll (above the fold).",
      navigation: "Tinggi navbar maksimal 80px, single-line pada desktop.",
      badgeRules: "Badge di atas hero H1 diperbolehkan HANYA jika hero membutuhkan visual anchor."
    },
    storytellingLandingPageFramework: {
      minimumSections: 10,
      targetSections: "10-15 sections",
      narrativeFlow: [
        "1. Hero Section & Primary CTA",
        "2. User Pain Points",
        "3. Why Traditional Solutions Fail",
        "4. Product Reveal & Core Promise",
        "5. Step-by-Step How It Works",
        "6. Interactive Preview / UI Showcase",
        "7. Key Outcomes & Value Impact",
        "8. Social Proof & Testimonials",
        "9. Detailed Bento Grid Features",
        "10. Interactive Calculator / Use Cases",
        "11. FAQ Accordion",
        "12. Final High-Impact CTA"
      ]
    }
  },

  // ==========================================
  // CATEGORY 2: MODULAR TASTE SKILLS (IMPORTED FROM lib/tasteSkills/)
  // ==========================================
  skills: ALL_TASTE_SKILLS,

  // ==========================================
  // CATEGORY 3: CANONICAL CODE SKELETONS
  // ==========================================
  codeSkeletons,

  // ==========================================
  // CATEGORY 4: CODE EXAMPLES
  // ==========================================
  examples: {
    slopVsGood: {
      card_slop: `\n// ❌ AI SLOP: Side-tab border + glassmorphism + over-rounded\n<div className='bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border-l-4 border-purple-500 p-6 hover:scale-105 transition-all duration-500'>\n  <div className='rounded-xl bg-purple-500/10 p-3 mb-3'>\n    <Icon className='w-6 h-6 text-purple-500' />\n  </div>\n  <h3 className='text-lg font-semibold'>Feature</h3>\n</div>\n`,
      card_good: `\n// ✅ GOOD: Subtle shadow, consistent radius, no accent border, icon inline\n<div className='bg-surface rounded-lg shadow-sm border border-border p-4 md:p-6 hover:shadow-md hover:-translate-y-px transition-shadow duration-200'>\n  <div className='flex items-center gap-3 mb-2'>\n    <Icon className='w-5 h-5 text-primary' />\n    <h3 className='text-base font-semibold'>Feature</h3>\n  </div>\n  <p className='text-sm text-secondary'>Description</p>\n</div>\n`,
      hero_slop: `\n// ❌ AI SLOP: Eyebrow pill + gradient text + metric row + abstract shape\n<section className='relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400'>\n  <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]' />\n  <span className='inline-block px-3 py-1 rounded-full bg-white/20 text-xs uppercase tracking-widest mb-4'>Introducing</span>\n  <h1 className='text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent'>Build the Future of Work</h1>\n</section>\n`,
      hero_good: `\n// ✅ GOOD: Solid bg, no eyebrow, solid text, clear hierarchy\n<section className='bg-surface border-b border-border'>\n  <div className='max-w-3xl mx-auto px-4 py-16 md:py-24'>\n    <h1 className='text-3xl md:text-4xl font-bold text-primary tracking-tight'>Project management for fast-moving teams</h1>\n    <p className='mt-4 text-lg text-secondary max-w-xl'>Ship features faster with less chaos.</p>\n  </div>\n</section>\n`,
      button_slop: `\n// ❌ AI SLOP: Gradient, bounce, excessive glow, pill shape everywhere\n<button className='bg-gradient-to-r from-purple-500 to-blue-600 rounded-full px-8 py-4 text-white font-bold hover:scale-110 hover:shadow-purple-500/50 shadow-lg transition-all duration-500 animate-pulse'>\n  🚀 Supercharge Your Workflow\n</button>\n`,
      button_good: `\n// ✅ GOOD: Solid color, subtle hover, consistent radius, no emoji, no buzzword\n<button className='bg-primary text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-hover transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>\n  Start free trial\n</button>\n`,
      section_slop: `\n// ❌ AI SLOP: Repeated kicker + numbered markers + identical cards\n<section>\n  <p className='text-xs uppercase tracking-widest text-purple-500 mb-2'>01 — Features</p>\n  <h2>What You Get</h2>\n  <div className='grid grid-cols-3 gap-6'>\n    {[1,2,3].map(i => (\n      <div className='border-l-4 border-purple-500 rounded-xl p-6'>\n        <div className='rounded-lg bg-purple-50 p-3 w-fit mb-4'><Icon /></div>\n        <h3>Feature {i}</h3>\n        <p>Description</p>\n      </div>\n    ))}\n  </div>\n</section>\n`,
      section_good: `\n// ❌ GOOD: No kicker, no numbers, varied card layout, no accent border\n<section>\n  <h2 className='text-2xl font-bold'>Features</h2>\n  <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-4'>\n    <div className='bg-surface rounded-lg border border-border p-6 md:row-span-2'>\n      <Icon className='w-5 h-5 text-primary mb-3' />\n      <h3 className='font-semibold'>Feature one</h3>\n      <p className='text-sm text-secondary mt-1'>Detailed description for the primary feature that gets more space.</p>\n    </div>\n    <div className='bg-surface rounded-lg border border-border p-6'>\n      <Icon className='w-5 h-5 text-primary mb-3' />\n      <h3 className='font-semibold'>Feature two</h3>\n      <p className='text-sm text-secondary mt-1'>Brief description.</p>\n    </div>\n  </div>\n</section>\n`
    }
  }
};

/**
 * Selective Taste Skill Filter (Modular Import)
 */
export function getFilteredTasteSkill(designTextOrVibe?: string, requestedSkillKey?: string) {
  const allSkills = ALL_TASTE_SKILLS as Record<string, string>;
  let selectedKey = requestedSkillKey;

  if (!selectedKey && designTextOrVibe) {
    const lower = designTextOrVibe.toLowerCase();
    if (lower.includes("minimalist") || lower.includes("editorial") || lower.includes("calm") || lower.includes("document")) {
      selectedKey = "minimalistUi";
    } else if (lower.includes("luxury") || lower.includes("vanguard") || lower.includes("high-end") || lower.includes("agency")) {
      selectedKey = "highEndVisualDesign";
    } else if (lower.includes("awwwards") || lower.includes("gsap") || lower.includes("kinetic") || lower.includes("motion")) {
      selectedKey = "gptTaste";
    } else if (lower.includes("stitch") || lower.includes("semantic")) {
      selectedKey = "stitchDesignTaste";
    } else if (lower.includes("redesign") || lower.includes("overhaul") || lower.includes("legacy")) {
      selectedKey = "redesignExistingProjects";
    } else if (lower.includes("full") || lower.includes("unabridged")) {
      selectedKey = "fullOutputEnforcement";
    } else {
      selectedKey = "designTasteFrontend";
    }
  }

  if (!selectedKey || !allSkills[selectedKey]) {
    selectedKey = "designTasteFrontend";
  }

  return {
    name: "taste-skill-v2",
    version: "2.1.0-selective-modular",
    activeSkillKey: selectedKey,
    activeSkillContent: allSkills[selectedKey],
    routerInfo: {
      selectedReason: `Auto-selected skill '${selectedKey}' based on project design requirements`,
      availableSkills: Object.keys(allSkills),
      fetchOtherSkillInstruction: "To fetch another specific skill on demand, request section=taste-skill&skill=<skillName>"
    },
    tasteSkillDirectives: TASTE_SKILL_DIRECTIVES.tasteSkillDirectives,
    codeSkeletons: TASTE_SKILL_DIRECTIVES.codeSkeletons,
    examples: TASTE_SKILL_DIRECTIVES.examples
  };
}
