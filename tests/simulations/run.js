#!/usr/bin/env node
/**
 * Simulation runner — tests full learning trajectories with simulated students.
 * No LLM calls — uses the student's scripted answer generator.
 *
 * Tests: mode selection, directive enforcement, student model evolution,
 * engagement detection, session resume, accuracy trends.
 *
 * Usage: node tests/simulations/run.js [student-name] [--lessons N]
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { STUDENTS, STUDENT_LIST } from './students.js';
import { TutorState } from '../../lib/core/state.js';
import { buildStudentModel, formatStudentModel } from '../../lib/core/student-model.js';
import { evaluatePractice, formatPracticeFeedback, parseDirectives, applyDirectives } from '../../lib/core/deliberate-practice.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const args = process.argv.slice(2);
const studentFilter = args.find((a) => !a.startsWith('--'));
const lessonCount = parseInt(args.find((a) => a.startsWith('--lessons'))?.split('=')[1] || '10');

const students = studentFilter ? [studentFilter] : STUDENT_LIST;

for (const name of students) {
  const student = STUDENTS[name];
  if (!student) {
    console.error(`Unknown student: ${name}. Available: ${STUDENT_LIST.join(', ')}`);
    continue;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SIMULATING: ${student.name} — ${student.slug} (${lessonCount} lessons)`);
  console.log(`${'='.repeat(60)}`);

  // Create isolated temp directory
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `opentutor-sim-${name}-`));
  const domainsDir = path.join(ROOT, 'skills', 'tutor', 'domains');

  // Create a state instance pointing to the real domains
  const state = new TutorState(ROOT);

  // Write student profile
  const userPath = path.join(ROOT, 'workspace', 'USER.md');
  const originalUser = fs.existsSync(userPath) ? fs.readFileSync(userPath, 'utf-8') : '';
  fs.writeFileSync(userPath, student.profile);

  const curriculum = state.readCurriculum(student.slug);
  if (!curriculum) {
    console.log(`  SKIP: no curriculum for ${student.slug}`);
    continue;
  }

  const trajectory = [];
  const STEPS = ['retrieval', 'diagnostic', 'followUp', 'application'];

  for (let i = 0; i < Math.min(lessonCount, curriculum.lessons.length); i++) {
    const lesson = curriculum.lessons[i];
    if (!lesson) break;

    const lessonDay = lesson.day || lesson.lesson;
    const learningMd = state.readDomainFile(student.slug, 'learning.md') || '';
    const studentModel = buildStudentModel(learningMd, curriculum, student.profile);

    // Read directives
    const feedbackMd = state.readDomainFile(student.slug, 'practice-feedback.md') || '';
    const directives = parseDirectives(feedbackMd);
    const constraints = applyDirectives(directives);

    // Select mode
    const mode = selectMode(studentModel, constraints);

    // Simulate lesson steps
    const history = [];
    for (const step of STEPS) {
      const answer = student.generateAnswer(step, null, history);
      history.push({ role: 'user', content: answer });
      history.push({ role: 'assistant', content: `[simulated response to: ${answer.slice(0, 40)}]` });
    }

    // Assess engagement
    const engagement = assessEngagement(history);

    // Determine accuracy from student behavior
    const accurate = Math.random() < student.behavior.accuracy;
    const engagementLabel = accurate ? 'correct' : 'incorrect';

    // Mark complete
    lesson.status = 'completed';
    lesson.delivered = new Date().toISOString().split('T')[0];
    lesson.engagement = engagementLabel;

    // Run deliberate practice evaluation
    const evaluation = evaluatePractice(learningMd, curriculum, student.profile);
    const feedback = formatPracticeFeedback(evaluation, curriculum.topic || student.slug);
    state.writeDomainFile(student.slug, 'practice-feedback.md', feedback);

    // Write learning log
    const completedCount = curriculum.lessons.filter((l) => l.status === 'completed').length;
    state.writeDomainFile(student.slug, 'learning.md', [
      `# Learning Log: ${curriculum.topic}`,
      '',
      `## Position`,
      `- **Last lesson:** Day ${lessonDay} — ${lesson.title}`,
      `- **Progress:** ${completedCount}/${curriculum.lessons.length} (${Math.round(completedCount / curriculum.lessons.length * 100)}%)`,
      '',
      `## Accuracy Trend`,
      `- **Last exercise:** ${engagementLabel}`,
      `- **Engagement:** ${engagement}`,
    ].join('\n'));

    const activeDirectives = evaluation.directives.filter((d) => d.priority === 'critical' || d.priority === 'high');

    trajectory.push({
      lesson: lessonDay,
      title: lesson.title.slice(0, 50),
      mode,
      accurate,
      engagement,
      directives: activeDirectives.map((d) => `${d.type}:${d.target.slice(0, 20)}`),
      accuracy: studentModel.recentAccuracy,
      difficulty: studentModel.difficulty.level,
    });

    console.log(
      `  Day ${String(lessonDay).padStart(2)} | ${mode.padEnd(8)} | ` +
      `${accurate ? '✓' : '✗'} | ${engagement.padEnd(8)} | ` +
      `acc=${Math.round(studentModel.recentAccuracy * 100).toString().padStart(3)}% | ` +
      `diff=${studentModel.difficulty.level} | ` +
      `${activeDirectives.length ? activeDirectives.map((d) => d.type).join(',') : '-'}`
    );
  }

  // Summary
  const correct = trajectory.filter((t) => t.accurate).length;
  const modes = {};
  trajectory.forEach((t) => { modes[t.mode] = (modes[t.mode] || 0) + 1; });
  const allDirectives = trajectory.flatMap((t) => t.directives);

  console.log(`\n  Summary:`);
  console.log(`    Accuracy: ${correct}/${trajectory.length} (${Math.round(correct / trajectory.length * 100)}%)`);
  console.log(`    Modes: ${Object.entries(modes).map(([m, c]) => `${m}=${c}`).join(', ')}`);
  console.log(`    Directives issued: ${allDirectives.length} (${[...new Set(allDirectives)].join(', ') || 'none'})`);

  // Restore original user profile
  fs.writeFileSync(userPath, originalUser);

  // Reset curriculum status
  for (const lesson of curriculum.lessons) {
    lesson.status = 'pending';
    delete lesson.delivered;
    delete lesson.engagement;
  }
  state.writeCurriculum(student.slug, curriculum);

  // Clean up domain artifacts
  try { fs.unlinkSync(path.join(domainsDir, student.slug, 'learning.md')); } catch {}
  try { fs.unlinkSync(path.join(domainsDir, student.slug, 'practice-feedback.md')); } catch {}

  fs.rmSync(tmpDir, { recursive: true, force: true });
}

// ── Copied from lesson.js (to avoid bot dependencies) ──────

function selectMode(studentModel, constraints) {
  if (constraints.blocked) return 'deep';
  if (studentModel.recentAccuracy < 0.3) return 'deep';
  if (studentModel.trend === 'declining') return 'deep';
  if (studentModel.recentAccuracy > 0.85
    && studentModel.trend === 'improving'
    && studentModel.engagement !== 'low'
    && studentModel.engagement !== 'declining') {
    return 'quick';
  }
  return 'standard';
}

function assessEngagement(history) {
  const studentMessages = history.filter((m) => m.role === 'user');
  if (!studentMessages.length) return 'minimal';
  const avgLength = studentMessages.reduce((sum, m) => sum + m.content.length, 0) / studentMessages.length;
  const askedQuestions = studentMessages.some((m) => m.content.includes('?'));
  const usedBecause = studentMessages.some((m) => /because|since|therefore|so that/i.test(m.content));
  const saidSkip = studentMessages.some((m) => /^(skip|next|move on|idk|i don'?t know)$/i.test(m.content.trim()));
  if (saidSkip) return 'minimal';
  if (askedQuestions) return 'high';
  if (usedBecause && avgLength > 20) return 'high';
  if (studentMessages.length >= 3 && avgLength > 15) return 'engaged';
  if (avgLength > 30) return 'engaged';
  if (avgLength > 10) return 'brief';
  return 'minimal';
}
