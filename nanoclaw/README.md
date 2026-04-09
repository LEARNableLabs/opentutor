# OpenTutor — NanoClaw Setup Guide

OpenTutor as a skill for NanoClaw. The tutor runs inside NanoClaw's container agent and delivers lessons over Telegram, Slack, or WhatsApp.

## How skills work in NanoClaw

NanoClaw syncs skills from `container/skills/` into each group's isolated `.claude/skills/` directory at container spawn time. The container agent (Claude Code SDK) discovers and activates them automatically. Skills never need to be registered — just placed in the right directory.

## Step 1 — Copy the skill

From the opentutor repo root:

```bash
cp -r skills/tutor /path/to/nanoclaw/container/skills/tutor
```

Or from the opentutor repo root if nanoclaw is a sibling directory:

```bash
cp -r skills/tutor ../nanoclaw/container/skills/tutor
```

NanoClaw will sync the skill into every group's container on next spawn.

## Step 2 — Copy workspace templates into the group folder

The tutor stores state (progress, curricula, memory) in the group's workspace folder, mounted at `/workspace/group` inside the container.

Copy the templates into the group you want to be the tutor (usually `main`):

```bash
GROUP=main  # change to your group folder name

cp skills/tutor/workspace/IDENTITY.md  ../nanoclaw/groups/$GROUP/IDENTITY.md
cp skills/tutor/workspace/SOUL.md      ../nanoclaw/groups/$GROUP/SOUL.md
cp skills/tutor/workspace/USER.md      ../nanoclaw/groups/$GROUP/USER.md
cp skills/tutor/workspace/tutor/progress.json ../nanoclaw/groups/$GROUP/tutor/progress.json
mkdir -p ../nanoclaw/groups/$GROUP/tutor/curricula
mkdir -p ../nanoclaw/groups/$GROUP/memory
```

> **Note:** `AGENTS.md` is not copied — NanoClaw uses `CLAUDE.md` in the group folder for the same purpose. Edit the group's `CLAUDE.md` if you want to add tutor-specific boot instructions (see Step 3).

Edit `USER.md` with the student's name and timezone:

```markdown
- **Name:** Your Name
- **What to call them:** Your Name
- **Timezone:** America/New_York
- **Educational level:** undergrad
```

## Step 3 — (Optional) Update the group's CLAUDE.md

The tutor skill activates automatically when the agent decides it's relevant. If you want the agent to always boot as a tutor (rather than as a general assistant), add this to the top of `groups/<group>/CLAUDE.md`:

```markdown
## Tutor Mode

You are a personalized tutor. At the start of every session:

1. Read your `tutor` skill (SKILL.md) — teaching methodology
2. Read `USER.md` — who you're teaching
3. Read `tutor/progress.json` — current learning state
4. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context

Never narrate your boot-up. Use these files silently and jump straight into the conversation.
```

## Step 4 — Enable Telegram (optional)

NanoClaw can deliver lessons over Telegram instead of (or in addition to) WhatsApp.

**Create the bot:**

1. Open Telegram and start a chat with **[@BotFather](https://t.me/BotFather)**
2. Send `/newbot`, follow the prompts (username must end in `bot`)
3. Copy the token BotFather gives you: `123456789:ABCdef_ghiJKLmnoPQRstu`
4. *(Recommended)* Send `/setprivacy` → select your bot → **Disable** (lets it read group messages)

**Configure NanoClaw:**

Add to your NanoClaw `.env`:

```
TELEGRAM_BOT_TOKEN=123456789:ABCdef_ghiJKLmnoPQRstu
TELEGRAM_ONLY=true   # omit this line if you want both WhatsApp and Telegram
```

Restart NanoClaw — it will start polling Telegram automatically.

---

## Step 5 — Schedule daily lessons

NanoClaw has its own task scheduler — use `schedule_task` from within the agent rather than the `cron/jobs.template.json` (which is for OpenClaw's cron system).

From the main channel, ask the agent to schedule lessons:

```
@Andy schedule a daily tutor lesson at 9am, 1pm, and 7pm Eastern
```

Or schedule via the agent's `schedule_task` tool directly:

```
schedule_task(
  prompt: "Read tutor/progress.json. If active_topics is empty, send a short friendly message asking what the student wants to learn — suggest 2-3 interesting options. If active_topics has entries, read the matching curriculum file in tutor/curricula/ and deliver a concise daily lesson with a small exercise. Keep total response under 200 words.",
  schedule_type: "cron",
  schedule_value: "0 9,13,19 * * *"
)
```

## File layout (running)

| Container path | Host path | Purpose |
|---|---|---|
| `/home/node/.claude/skills/tutor/SKILL.md` | `container/skills/tutor/SKILL.md` | Tutor teaching instructions |
| `/workspace/group/USER.md` | `groups/<group>/USER.md` | Student profile |
| `/workspace/group/IDENTITY.md` | `groups/<group>/IDENTITY.md` | Tutor identity |
| `/workspace/group/SOUL.md` | `groups/<group>/SOUL.md` | Teaching style |
| `/workspace/group/tutor/progress.json` | `groups/<group>/tutor/progress.json` | Active topics, schedule, history |
| `/workspace/group/tutor/curricula/` | `groups/<group>/tutor/curricula/` | Per-topic lesson plans |
| `/workspace/group/memory/` | `groups/<group>/memory/` | Daily session notes |

## Updating the skill

When a new version of opentutor is released:

```bash
cp -r skills/tutor ../nanoclaw/container/skills/tutor
```

The updated skill will be picked up on the next container spawn — no restart needed.

## Troubleshooting

**Tutor skill not activating:**
- Verify `container/skills/tutor/SKILL.md` exists in the nanoclaw project
- Check that the group has been spawned at least once since copying the skill (the sync happens at spawn time)
- Verify with: `ls data/sessions/<group>/.claude/skills/`

**Agent responds as general assistant, not tutor:**
- The skill activates based on context — trigger it explicitly: `@Andy next lesson` or `@Andy quiz me`
- Or add tutor boot instructions to `groups/<group>/CLAUDE.md` (see Step 3)

**Progress not persisting between sessions:**
- Confirm `tutor/progress.json` exists in the group folder
- The agent must write updates to `/workspace/group/tutor/progress.json` — check session logs if it's not persisting
