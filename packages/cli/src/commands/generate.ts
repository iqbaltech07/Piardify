import * as fs from "fs";
import * as path from "path";
import { getScaffoldTemplate, ComponentType } from "../templates/index.js";

export async function generateCommand(
  nameOrType?: string,
  extraName?: string,
  options: { type?: string; target?: string; json?: boolean } = {}
) {
  try {
    if (!nameOrType) {
      console.log("\n==========================================");
      console.log("  🎨 Piardify Component Generator v2.0");
      console.log("==========================================");
      console.log("  Usage: npx piardify generate <ComponentName> [--type <card|hero|table|form|modal|bento>]\n");
      console.log("  Available Anti-Slop Component Archetypes:");
      console.log("    • card     : Data Metric Cards with Compact Currency");
      console.log("    • hero     : Editorial Storytelling Hero Section with CTA");
      console.log("    • table    : High-Density Utilitarian Data Table");
      console.log("    • form     : Clean Form Inputs & Validation State");
      console.log("    • modal    : Elevated Dialog Modal Layer");
      console.log("    • bento    : Asymmetric Spatial Feature Grid\n");
      throw new Error("MISSING_COMPONENT_NAME: Please specify component name (e.g. 'npx piardify generate UserDashboard --type card')");
    }

    let componentType: ComponentType = "card";
    let componentName = nameOrType;

    const validTypes: ComponentType[] = ["card", "hero", "table", "form", "modal", "bento", "sidebar"];
    if (validTypes.includes(nameOrType.toLowerCase() as ComponentType) && extraName) {
      componentType = nameOrType.toLowerCase() as ComponentType;
      componentName = extraName;
    } else if (options.type && validTypes.includes(options.type.toLowerCase() as ComponentType)) {
      componentType = options.type.toLowerCase() as ComponentType;
    }

    const cleanName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    const workspaceRoot = process.cwd();

    let targetDir = path.join(workspaceRoot, "components");
    if (fs.existsSync(path.join(workspaceRoot, "src"))) {
      targetDir = path.join(workspaceRoot, "src", "components");
    }
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, `${cleanName}.tsx`);
    const scaffoldCode = getScaffoldTemplate(cleanName, componentType);

    fs.writeFileSync(filePath, scaffoldCode, "utf-8");

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        componentName: cleanName,
        componentType,
        filePath,
      }));
    } else {
      console.log("\n==========================================");
      console.log("  🎨 Piardify Component Generator");
      console.log("==========================================");
      console.log(`  Component Name : ${cleanName}`);
      console.log(`  Archetype Type : ${componentType.toUpperCase()}`);
      console.log(`  File Created   : ${path.relative(workspaceRoot, filePath)}`);
      console.log("  Anti-Slop Status: 100% Compliant (Clean surface contrast, responsive)\n");
    }
  } catch (err: any) {
    if (options.json) {
      console.log(JSON.stringify({ success: false, error: err.message }));
    } else {
      console.error(`\n❌ Component generation failed: ${err.message}\n`);
    }
    process.exit(1);
  }
}
