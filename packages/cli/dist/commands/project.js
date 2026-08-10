"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectCommand = projectCommand;
const store_js_1 = require("../config/store.js");
const client_js_1 = require("../api/client.js");
async function projectCommand(section, options = {}) {
    try {
        const projectId = options.project || (0, store_js_1.getProjectConfig)().projectId;
        if (!projectId) {
            throw new Error("NO_PROJECT_LINKED: Run 'npx piardify init' or specify '--project <projectId>' first.");
        }
        let sec = section || "overview";
        if (sec === "current")
            sec = "overview";
        let url = `/api/agent/project?projectId=${projectId}&section=${sec}`;
        if (options.skill) {
            url += `&skill=${encodeURIComponent(options.skill)}`;
        }
        const res = await (0, client_js_1.apiRequest)(url);
        if (options.json) {
            console.log(JSON.stringify(res, null, 2));
        }
        else {
            console.log(`\n--- Piardify Project [${sec.toUpperCase()}] ---`);
            if (sec === "prd") {
                console.log(res.prd || "No PRD content found.");
            }
            else {
                console.log(JSON.stringify(res, null, 2));
            }
            console.log("");
        }
    }
    catch (err) {
        if (options.json) {
            console.log(JSON.stringify({ success: false, error: err.message }));
        }
        else {
            console.error(`\n❌ Project command failed: ${err.message}\n`);
        }
        process.exit(1);
    }
}
