/**
 * Shared initialization for Vercel serverless functions.
 * Resolves store (Supabase in production, SQLite locally),
 * LLM adapter, and skill files.
 */

import fs from 'fs';
import path from 'path';
import { createAdapterFromEnv, createPipelineAdapterFromEnv } from '../../lib/adapters/index.js';

let _state, _adapter, _pipelineAdapter, _skills;

export async function getState() {
  if (!_state) {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { SupabaseStore } = await import('../../lib/core/supabase-store.js');
        _state = new SupabaseStore();
      } catch {
        const { TutorStore } = await import('../../lib/core/store.js');
        _state = new TutorStore(process.cwd());
      }
    } else {
      const { TutorStore } = await import('../../lib/core/store.js');
      _state = new TutorStore(process.cwd());
    }
  }
  return _state;
}

export function getAdapter() {
  if (!_adapter) _adapter = createAdapterFromEnv();
  return _adapter;
}

export function getPipelineAdapter() {
  if (!_pipelineAdapter) _pipelineAdapter = createPipelineAdapterFromEnv();
  return _pipelineAdapter;
}

export function getSkills() {
  if (!_skills) {
    _skills = new Map();
    const load = (key, p) => { try { _skills.set(key, fs.readFileSync(p, 'utf-8')); } catch {} };
    const root = process.cwd();
    const skillsDir = path.join(root, 'skills', 'tutor');
    const refs = path.join(skillsDir, 'references');
    load('domain-template', path.join(skillsDir, 'templates', 'domain-template.md'));
    load('curriculum-format', path.join(refs, 'curriculum-format.md'));
    load('teaching-method', path.join(refs, 'teaching-method.md'));
    load('lesson-delivery', path.join(refs, 'lesson-delivery.md'));
    load('source-verification', path.join(refs, 'source-verification.md'));
  }
  return _skills;
}
