"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeCommand = themeCommand;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const index_js_1 = require("../presets/index.js");
async function themeCommand(options) {
    try {
        const workspaceRoot = process.cwd();
        const piardifyDir = path.join(workspaceRoot, ".piardify");
        if (!fs.existsSync(piardifyDir)) {
            fs.mkdirSync(piardifyDir, { recursive: true });
        }
        const targetDomain = options.target || "web";
        const presetContent = (0, index_js_1.getTailwindPresetContent)(targetDomain);
        const cssContent = (0, index_js_1.getCssVariablesContent)(targetDomain);
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
        }
        else {
            console.log("\n==========================================");
            console.log("  Piardify Theme Boilerplate Initialized");
            console.log("==========================================");
            console.log(`  Tailwind Preset : Created -> piardify.preset.js`);
            console.log(`  CSS Variables   : Created -> .piardify/theme.css`);
            console.log("\nAdd 'presets: [require(\"./piardify.preset.js\")]' to tailwind.config.js to enable semantic classes.\n");
        }
    }
    catch (err) {
        if (options.json) {
            console.log(JSON.stringify({ success: false, error: err.message }));
        }
        else {
            console.error(`\n[ERROR] Theme initialization failed: ${err.message}\n`);
        }
        process.exit(1);
    }
}
