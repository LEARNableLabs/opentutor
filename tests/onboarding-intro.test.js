import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { buildOnboardingPrompt } from '../lib/core/prompts.js';

// A new student was greeted warmly and told nothing about what they had just
// opened: not that lessons are daily and short, not that it asks instead of
// explains, not that it tracks what they get wrong. They had to infer the
// product from its behaviour.
//
// The guidance also has to reach every surface. `references/onboarding.md` is
// the source of truth, but api/onboard.js and scripts/web/server.js each carried
// their own hardcoded prompt — byte-identical to each other — and neither read
// it. Only the Telegram bot did.

const REPO = path.resolve('.');
const ONBOARDING = fs.readFileSync(path.join(REPO, 'skills/tutor/references/onboarding.md'), 'utf-8');

const skills = new Map([['onboarding', ONBOARDING]]);

describe('the onboarding reference', () => {
  it('tells the tutor to explain how the system works', () => {
    expect(ONBOARDING).toMatch(/how (this|it) works/i);
  });

  it('covers the four things a new student cannot infer', () => {
    const guidance = ONBOARDING.toLowerCase();
    // Daily cadence, Socratic delivery, that it adapts, and that a topic can be
    // built on request — none of which are visible from a greeting.
    expect(guidance, 'daily / short sessions').toMatch(/day|daily|minutes/);
    expect(guidance, 'asks rather than lectures').toMatch(/question|ask/);
    expect(guidance, 'tracks weak spots').toMatch(/track|remember|weak|struggl/);
    expect(guidance, 'can build a new topic').toMatch(/293|build|research/);
  });

  it('keeps it to one message, not a tour', () => {
    // A product explainer that outlasts the student's patience is worse than
    // none — the rule is a couple of lines, once.
    const section = ONBOARDING.match(/##+ .*how (this|it) works[\s\S]*?(?=\n##|$)/i)?.[0] || '';
    expect(section).toMatch(/once|brief|short|don't repeat|two|couple/i);
  });
});

describe('buildOnboardingPrompt', () => {
  it('carries the reference into the prompt rather than restating it', () => {
    const { system } = buildOnboardingPrompt(skills, '');
    expect(system).toContain('how this works');
  });

  it('includes the student profile when there is one', () => {
    const { system } = buildOnboardingPrompt(skills, '# Student Profile\n- **Name:** Ada');
    expect(system).toContain('Ada');
  });

  it('works with no profile and no reference loaded', () => {
    const { system } = buildOnboardingPrompt(new Map(), '');
    expect(typeof system).toBe('string');
    expect(system.length).toBeGreaterThan(50);
  });

  it('keeps the topic marker the routes parse', () => {
    const { system } = buildOnboardingPrompt(skills, '');
    expect(system).toContain('<TOPIC>');
  });
});

describe('every surface uses it', () => {
  const reads = (f) => fs.readFileSync(path.join(REPO, f), 'utf-8');

  it.each(['api/onboard.js', 'scripts/web/server.js'])('%s builds the prompt from core', (f) => {
    expect(reads(f)).toMatch(/buildOnboardingPrompt/);
  });

  it('no surface still hardcodes its own copy', () => {
    for (const f of ['api/onboard.js', 'scripts/web/server.js']) {
      expect(reads(f), `${f} should not inline the onboarding prompt`).not.toMatch(/study buddy meeting a new student/i);
    }
  });

  it('the serverless skill loader actually loads it', () => {
    // Without this the prompt builder gets an empty reference and silently
    // falls back, which is how the guidance failed to reach the web before.
    expect(reads('api/_lib/init.js')).toMatch(/load\('onboarding'/);
  });
});
