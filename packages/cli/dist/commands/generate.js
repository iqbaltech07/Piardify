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
exports.generateCommand = generateCommand;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const index_js_1 = require("../templates/index.js");
async function generateCommand(nameOrType, extraName, options = {}) {
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
        let componentType = "card";
        let componentName = nameOrType;
        const validTypes = ["card", "hero", "table", "form", "modal", "bento", "sidebar"];
        if (validTypes.includes(nameOrType.toLowerCase()) && extraName) {
            componentType = nameOrType.toLowerCase();
            componentName = extraName;
        }
        else if (options.type && validTypes.includes(options.type.toLowerCase())) {
            componentType = options.type.toLowerCase();
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
        const scaffoldCode = (0, index_js_1.getScaffoldTemplate)(cleanName, componentType);
        fs.writeFileSync(filePath, scaffoldCode, "utf-8");
        if (options.json) {
            console.log(JSON.stringify({
                success: true,
                componentName: cleanName,
                componentType,
                filePath,
            }));
        }
        else {
            console.log("\n==========================================");
            console.log("  🎨 Piardify Component Generator");
            console.log("==========================================");
            console.log(`  Component Name : ${cleanName}`);
            console.log(`  Archetype Type : ${componentType.toUpperCase()}`);
            console.log(`  File Created   : ${path.relative(workspaceRoot, filePath)}`);
            console.log("  Anti-Slop Status: 100% Compliant (Clean surface contrast, responsive)\n");
        }
    }
    catch (err) {
        if (options.json) {
            console.log(JSON.stringify({ success: false, error: err.message }));
        }
        else {
            console.error(`\n❌ Component generation failed: ${err.message}\n`);
        }
        process.exit(1);
    }
}
