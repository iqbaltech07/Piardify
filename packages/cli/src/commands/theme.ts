import * as fs from "fs";
import * as path from "path";
import { getTailwindPresetContent, getCssVariablesContent } from "../presets/index.js";

export async function themeCommand(options: { target?: string; json?: boolean }) {
  try {
    const workspaceRoot = process.cwd();
    const piardifyDir = path.join(workspaceRoot, ".piardify");
    if (!fs.existsSync(piardifyDir)) {
      fs.mkdirSync(piardifyDir, { recursive: true });
    }

    const targetDomain = options.target || "web";

    const presetContent = getTailwindPresetContent(targetDomain);
    const cssContent = getCssVariablesContent(targetDomain);

    const presetPath = path.join(workspaceRoot, "piardify.preset.js");
    fs.writeFileSync(presetPath, presetContent, "utf-8");

    const cssPath = path.join(piardifyDir, "theme.css");
    fs.writeFileSync(cssPath, cssContent, "utf-8");

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        presetFile: presetPath,
        cssFile: cssPath,
      }));
    } else {
      console.log("\n==========================================");
      console.log("  Piardify Theme Boilerplate Initialized");
      console.log("==========================================");
      console.log(`  Tailwind Preset : Created -> piardify.preset.js`);
      console.log(`  CSS Variables   : Created -> .piardify/theme.css`);
      console.log("\nAdd 'presets: [require(\"./piardify.preset.js\")]' to tailwind.config.js to enable semantic classes.\n");
    }
  } catch (err: any) {
    if (options.json) {
      console.log(JSON.stringify({ success: false, error: err.message }));
    } else {
      console.error(`\n[ERROR] Theme initialization failed: ${err.message}\n`);
    }
    process.exit(1);
  }
}
