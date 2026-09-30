import { describe, it, expect } from 'vitest';
import fs from 'fs';

// The assistant is OpenTutor (#243). "Study buddy" was early persona text, and the model
// repeats whatever name its prompt gives it, so no prompt, greeting or refusal may use it.
const SAID_OR_READ = [
  'api/chat.js',
  'lib/core/prompts.js',
  'lib/core/llm-access.js',
  'public/app.js',
  'public/learn.html',
  'scripts/bot/context.js',
  'scripts/bot/onboarding.js',
  'skills/tutor/SKILL.md',
  'skills/tutor/references/onboarding.md',
  'skills/tutor-onboarding/SKILL.md',
  'claude-web/SKILL.md',
  'workspace/SOUL.md',
  'workspace/IDENTITY.md',
  'workspace/AGENTS.md',
  'hermes/SOUL.md',
  'openclaw/SOUL.md',
  'docs/deployment.md',
];

describe('the assistant is called OpenTutor', () => {
  it.each(SAID_OR_READ)('%s never says "study buddy"', (file) => {
    expect(fs.readFileSync(file, 'utf8')).not.toMatch(/study[ -]?buddy/i);
  });

  it.each(['api/chat.js', 'lib/core/prompts.js', 'scripts/bot/context.js'])(
    '%s tells the model it is OpenTutor',
    (file) => {
      expect(fs.readFileSync(file, 'utf8')).toMatch(/You are OpenTutor/);
    },
  );

  it.each(['public/app.js', 'scripts/bot/onboarding.js'])('%s greets as OpenTutor', (file) => {
    expect(fs.readFileSync(file, 'utf8')).toMatch(/I[’']m OpenTutor/);
  });
});
