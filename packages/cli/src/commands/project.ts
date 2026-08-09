import { getProjectConfig } from "../config/store.js";
import { apiRequest } from "../api/client.js";

export async function projectCommand(section?: string, options: { project?: string; json?: boolean } = {}) {
  try {
    const projectId = options.project || getProjectConfig().projectId;

    if (!projectId) {
      throw new Error("NO_PROJECT_LINKED: Run 'npx piardify init' or specify '--project <projectId>' first.");
    }

    let sec = section || "overview";
    if (sec === "current") sec = "overview";

    const res = await apiRequest(`/api/agent/project?projectId=${projectId}&section=${sec}`);

    if (options.json) {
      console.log(JSON.stringify(res, null, 2));
    } else {
      console.log(`\n--- Piardify Project [${sec.toUpperCase()}] ---`);
      if (sec === "prd") {
        console.log(res.prd || "No PRD content found.");
      } else {
        console.log(JSON.stringify(res, null, 2));
      }
      console.log("");
    }
  } catch (err: any) {
    if (options.json) {
      console.log(JSON.stringify({ success: false, error: err.message }));
    } else {
      console.error(`\n❌ Project command failed: ${err.message}\n`);
    }
    process.exit(1);
  }
}
