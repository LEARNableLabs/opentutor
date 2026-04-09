# OpenTutor — NemoClaw Setup Guide

OpenTutor as a skill for NemoClaw. The tutor runs inside NemoClaw's agent runtime and delivers lessons over Telegram, Slack, or other configured channels.

## Prerequisites

- NemoClaw installed and configured (`~/.nemoclaw/`)
- An Anthropic API key

---

## Step 1 — Install skill + workspace

```bash
npx opentutor setup
```

Select **NemoClaw** when prompted. The script copies the skill and workspace templates into `~/.nemoclaw/` and registers the tutor agent in `~/.nemoclaw/nemoclaw.json`.

Or manually:

```bash
mkdir -p ~/.nemoclaw/skills/tutor ~/.nemoclaw/workspaces/tutor/tutor/curricula ~/.nemoclaw/workspaces/tutor/memory \
  && cp -r skills/tutor/. ~/.nemoclaw/skills/tutor/ \
  && cp skills/tutor/workspace/AGENTS.md skills/tutor/workspace/SOUL.md \
     skills/tutor/workspace/IDENTITY.md skills/tutor/workspace/USER.md \
     ~/.nemoclaw/workspaces/tutor/ \
  && cp skills/tutor/workspace/tutor/progress.json ~/.nemoclaw/workspaces/tutor/tutor/progress.json
```

Edit `USER.md` with the student's name and timezone:

```markdown
- **Name:** Your Name
- **What to call them:** Your Name
- **Timezone:** America/New_York
- **Educational level:** undergrad
```

---

## Step 2 — Create a Telegram bot (optional)

1. Open Telegram and start a chat with **[@BotFather](https://t.me/BotFather)**
2. Send `/newbot`, follow the prompts:
   - **Name**: anything (e.g. `My Tutor`)
   - **Username**: must end in `bot` (e.g. `mytutor_bot`)
3. BotFather replies with a token — copy it: `123456789:ABCdef_ghiJKLmnoPQRstu`
4. *(Recommended)* Send `/setprivacy` → select your bot → **Disable** (lets it read group messages)
5. Paste the token into `~/.nemoclaw/nemoclaw.json` under `channels.telegram.botToken` (see Step 3)

---

## Step 3 — Configure the gateway

Add to `~/.nemoclaw/nemoclaw.json`:

```json5
{
  agents: {
    list: [
      {
        id: "tutor",
        name: "OpenTutor",
        skills: ["tutor"],
        workspace: "~/.nemoclaw/workspaces/tutor",
        model: { primary: "anthropic/claude-opus-4-6" },
      },
    ],
  },

  channels: {
    telegram: {
      enabled: true,
      botToken: "PASTE_YOUR_TOKEN_HERE",
    },
  },

  bindings: [
    { agentId: "tutor", match: { channel: "telegram" } },
  ],
}
```

---

## Step 4 — Schedule daily lessons

A cron template is at `skills/tutor/cron/jobs.template.json`. Copy it into your NemoClaw cron config and adjust the channel name, timezone, and schedule.

---

## File layout (running)

| Path | Purpose |
|---|---|
| `~/.nemoclaw/skills/tutor/SKILL.md` | Tutor teaching instructions |
| `~/.nemoclaw/workspaces/tutor/AGENTS.md` | Session boot instructions |
| `~/.nemoclaw/workspaces/tutor/USER.md` | Student profile |
| `~/.nemoclaw/workspaces/tutor/IDENTITY.md` | Tutor identity |
| `~/.nemoclaw/workspaces/tutor/SOUL.md` | Teaching style |
| `~/.nemoclaw/workspaces/tutor/tutor/progress.json` | Active topics, schedule, history |
| `~/.nemoclaw/workspaces/tutor/tutor/curricula/` | Per-topic lesson plans |
| `~/.nemoclaw/workspaces/tutor/memory/` | Daily session notes |
