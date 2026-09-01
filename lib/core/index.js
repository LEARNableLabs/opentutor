/**
 * OpenTutor core — platform-agnostic entry point.
 *
 * Usage:
 *   import { TutorState, CurriculumPipeline } from 'opentutor/lib/core';
 *   import { createAdapter } from 'opentutor/lib/adapters';
 *
 *   const state = new TutorState('/path/to/opentutor');
 *   const adapter = createAdapter('claude-sdk');
 *   const pipeline = new CurriculumPipeline({ adapter, state, skills });
 *   await pipeline.run('quantum computing', 'quantum-computing', 'intermediate', researchMd);
 */

export { TutorState } from './state.js';
export { TutorStore } from './store.js';
export { SupabaseStore } from './supabase-store.js';
export { openDatabase, openDatabaseFromEnv } from './db.js';
export { CurriculumPipeline } from './pipeline.js';
export {
  buildPlanPrompt,
  buildCurriculumBuilderPrompt,
  buildDomainFilesPrompt,
  buildCriticPrompt,
  buildTeacherPrompt,
  buildLessonPlanPrompt,
  buildSocraticResponsePrompt,
} from './prompts.js';
export { buildStudentModel, formatStudentModel } from './student-model.js';
