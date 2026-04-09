# OpenTutor — Setup Guide

A personalized daily tutor delivered via Telegram and/or Slack, powered by OpenClaw. OpenTutor onboards you, builds a custom curriculum, and delivers bite-sized lessons on a schedule. It uses deliberate practice principles: targets your weak spots, stays in your stretch zone, and adapts based on how you respond.

## What's in the box

OpenTutor is a full agent setup, not just a skill plugin. The `skills/tutor/` directory contains everything needed:

```
skills/tutor/
  SKILL.md                        # teaching methodology and skill instructions
  workspace/                      # workspace templates
    AGENTS.md                     # agent config (session flow, memory, guardrails)
    SOUL.md                       # tutor personality
    IDENTITY.md                   # name, role, vibe
    USER.md                       # student profile (blank template)
    tutor/
      progress.json               # initial learning state
      curricula/.gitkeep          # per-topic lesson plans (created as you learn)
    memory/.gitkeep               # daily session notes (created automatically)
  cron/
    jobs.template.json            # scheduled lesson delivery template
```

## Prerequisites

- OpenClaw gateway installed and running (`openclaw gateway`)
- An Anthropic API key configured
- For Telegram: a bot token from [@BotFather](https://t.me/BotFather)
- For Slack: a Slack app configured with the gateway

---

## Step 1 — Install skill + workspace

A single command copies everything into place — the skill, workspace files, and empty directories for curricula and memory:

```bash
mkdir -p ~/.openclaw/skills/tutor ~/.openclaw/workspaces/tutor/tutor/curricula ~/.openclaw/workspaces/tutor/memory \
  && cp skills/tutor/SKILL.md ~/.openclaw/skills/tutor/SKILL.md \
  && cp skills/tutor/workspace/AGENTS.md skills/tutor/workspace/SOUL.md skills/tutor/workspace/IDENTITY.md skills/tutor/workspace/USER.md ~/.openclaw/workspaces/tutor/ \
  && cp skills/tutor/workspace/tutor/progress.json ~/.openclaw/workspaces/tutor/tutor/progress.json
```

> **YAML gotcha:** The `description` field in `SKILL.md` frontmatter must be quoted if it contains `: ` (colon-space), otherwise the YAML parser silently drops the skill. The file in this repo is already fixed.

Enable live skill reloading so future edits are picked up without a gateway restart:

```json5
// ~/.openclaw/openclaw.json
{
  skills: {
    load: { watch: true },
  },
}
```

Edit `USER.md` with the student's name and timezone:

```bash
# Edit ~/.openclaw/workspaces/tutor/USER.md
```

```markdown
- **Name:** Your Name
- **What to call them:** Your Name
- **Timezone:** America/New_York
```

---

## Step 2 — Create a Telegram bot (optional)

1. Open Telegram and start a chat with **[@BotFather](https://t.me/BotFather)**
2. Send `/newbot` and follow the prompts:
   - **Name**: anything (e.g. `My Tutor`)
   - **Username**: must end in `bot` (e.g. `mytutor_bot`)
3. BotFather replies with a token — copy it now: `123456789:ABCdef_ghiJKLmnoPQRstu`
4. *(Recommended)* Send `/setprivacy` → select your bot → choose **Disable** so the bot can read all group messages
5. Paste the token into `~/.openclaw/openclaw.json` under `channels.telegram.botToken` (see Step 3)

---

## Step 3 — Configure the gateway

Add the following to `~/.openclaw/openclaw.json`. Merge carefully with existing keys — do not duplicate `agents`, `channels`, etc.

```json5
{
  agents: {
    // keep your existing defaults block...
    list: [
      {
        id: "tutor",
        name: "OpenTutor",
        skills: ["tutor"],
        workspace: "~/.openclaw/workspaces/tutor",
        model: { primary: "anthropic/claude-opus-4-6" },
      },
    ],
  },

  channels: {
    // keep your existing channels...
    telegram: {
      enabled: true,
      botToken: "PASTE_YOUR_TOKEN_HERE",
      dmPolicy: "pairing",
      groupPolicy: "open",
    },
  },

  bindings: [
    { agentId: "tutor", match: { channel: "telegram" } },
    // add a slack binding too if you want the same agent on slack:
    // { "agentId": "tutor", "match": { "channel": "slack" } }
  ],
}
```

---

## Step 4 — Restart the gateway

The gateway must restart to pick up new channel config and the managed skill:

```bash
openclaw gateway stop
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

Or restart via the **OpenClaw macOS menubar app** (stop then start).

Verify both channels are up:

```bash
openclaw channels status
# Telegram default: enabled, configured, running, mode:polling, token:config
```

Verify the skill loaded:

```bash
openclaw skills list | grep tutor
# ✓ ready  tutor  ...  openclaw-managed
```

---

## Step 5 — Pair your Telegram account

1. Open Telegram, DM your bot (any message)
2. Run:

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

Pairing codes expire after 1 hour.

To skip pairing and lock the bot to your ID only, find your Telegram numeric user ID (visible in `openclaw logs --follow` as `from.id` when you DM the bot), then update the config:

```json5
"telegram": {
  "dmPolicy": "allowlist",
  "allowFrom": [YOUR_NUMERIC_ID]
}
```

---

## Step 6 — Scheduled lesson delivery (cron)

A cron template is provided at `openclaw/cron/jobs.template.json`. To set up scheduled lessons:

1. Generate a UUID: `uuidgen | tr '[:upper:]' '[:lower:]'`
2. Copy the template into your cron config:

```bash
# If you don't have existing cron jobs:
cp openclaw/cron/jobs.template.json ~/.openclaw/cron/jobs.json

# If you already have jobs.json, merge the job entry manually
```

3. Edit `~/.openclaw/cron/jobs.json`:
   - Replace `GENERATE_A_UUID` with the UUID you generated
   - Replace `CHANNEL_NAME` with `telegram` or `slack`
   - Adjust the cron expression (`0 9,13,19 * * *` = 9am, 1pm, 7pm daily)
   - Adjust the timezone

Duplicate the job entry if you want delivery on multiple channels (each needs a unique ID).

The gateway watches `jobs.json` for changes — no restart needed after editing.

---

## File layout (running)

| Path                                                        | Purpose                                          |
| ----------------------------------------------------------- | ------------------------------------------------ |
| `~/.openclaw/skills/tutor/SKILL.md`                         | Skill instructions (teaching methodology)        |
| `~/.openclaw/workspaces/tutor/AGENTS.md`                    | Agent config — session flow, memory, guardrails  |
| `~/.openclaw/workspaces/tutor/SOUL.md`                      | Tutor personality                                |
| `~/.openclaw/workspaces/tutor/IDENTITY.md`                  | Name, role, vibe                                 |
| `~/.openclaw/workspaces/tutor/USER.md`                      | Student profile (updated by the tutor over time) |
| `~/.openclaw/workspaces/tutor/tutor/progress.json`          | Active topics, schedule, lesson history          |
| `~/.openclaw/workspaces/tutor/tutor/curricula/<topic>.json` | Per-topic lesson plan                            |
| `~/.openclaw/workspaces/tutor/memory/YYYY-MM-DD.md`         | Daily session notes                              |
| `~/.openclaw/workspaces/tutor/MEMORY.md`                    | Curated long-term memory (created over time)     |
| `~/.openclaw/agents/tutor/sessions/`                        | Conversation history per channel session         |
| `~/.openclaw/cron/jobs.json`                                | Scheduled delivery jobs                          |

Progress, curricula, and memory are **shared across channels** — a lesson completed on Slack is marked done for Telegram too.

---

## In-chat commands

The bot responds to natural language. Key phrases from the skill:

| Say                | Effect                                    |
| ------------------ | ----------------------------------------- |
| `next lesson`      | Deliver the next lesson now               |
| `quiz me`          | Ad-hoc review of recent material          |
| `skip`             | Mark current lesson done, move on         |
| `I'm stuck on X`   | Deep dive into that concept               |
| `show my progress` | Summary of where you are                  |
| `add topic: X`     | Start a new curriculum                    |
| `pause` / `resume` | Toggle scheduled delivery                 |
| `/model sonnet`    | Switch to Sonnet for lighter sessions     |
| `/reset`           | Start a fresh session (loads skill fresh) |

---

## Troubleshooting

**Skill not loading (`After skill filter: (none)`):**

- Check `~/.openclaw/skills/tutor/SKILL.md` exists
- Validate YAML frontmatter: `description` must be quoted if it contains `: `
- Run: `openclaw skills list | grep tutor`
- If missing, restart the gateway

**Bot introduces itself as a generic AI (not a tutor):**

- The workspace files are missing or still have the generic defaults — copy the templates from `skills/tutor/workspace/`
- The session has a stale skill snapshot — delete `~/.openclaw/agents/tutor/sessions/sessions.json` and all `.jsonl` files in that directory, then send a new message
- After any workspace file change, clear sessions to force a fresh system prompt

**Cron job timing out:**

- The cron payload should short-circuit when `active_topics` is empty — check the payload matches the template
- Reduce `thinking` to `"low"` or shorten the prompt
- Check `~/.openclaw/cron/jobs.json` → `state.lastError` for details

**Telegram not showing in `openclaw channels status`:**

- Config changes to `channels.telegram` always require a full gateway restart (not a hot reload)
