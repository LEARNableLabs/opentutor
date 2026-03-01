import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

// OpenTutor is primarily delivered via the skills in skills/.
// OpenClaw auto-discovers SKILL.md files in those directories and
// injects the tutor persona and teaching instructions into the agent.
//
// Add api.registerTool(...) or api.registerCommand(...) here to extend
// the tutor with runtime capabilities (progress tracking, spaced
// repetition, resource fetching, etc.).

const openTutorPlugin = {
  id: "opentutor",
  name: "OpenTutor",
  description:
    "Interactive AI tutor for any topic: programming, math, science, languages, and more.",
  configSchema: emptyPluginConfigSchema(),
  register(_api: OpenClawPluginApi) {
    // Skills in skills/ are auto-discovered by OpenClaw.
  },
};

export default openTutorPlugin;
