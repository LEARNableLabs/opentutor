/**
 * Concept graph — parse concept-map.md into a dependency graph.
 * Supports credit propagation, prerequisite gating, and mastery tracking.
 */

/**
 * Parse concept-map.md into a dependency graph.
 * @returns {{ concepts: string[], dependencies: Map<string, string[]> }}
 */
export function parseConceptGraph(conceptMapMd) {
  if (!conceptMapMd) return { concepts: [], dependencies: new Map() };

  const concepts = [];
  const dependencies = new Map();
  const lines = conceptMapMd.split('\n');

  for (const line of lines) {
    const conceptMatch = line.match(/\*\*([^*]+)\*\*/);
    if (conceptMatch) {
      const concept = conceptMatch[1].trim();
      if (!concepts.includes(concept)) concepts.push(concept);

      const depsMatch = line.match(/[Dd]epends?\s+on:?\s*(.+)/);
      if (depsMatch) {
        const deps = depsMatch[1]
          .split(/,|and/)
          .map((d) => d.replace(/\*\*/g, '').trim())
          .filter(Boolean);
        dependencies.set(concept.toLowerCase(), deps.map((d) => d.toLowerCase()));
      }
    }
  }

  for (const line of lines) {
    const reqMatch = line.match(
      /\*\*([^*]+)\*\*\s+(?:requires|builds on|depends on)\s+(?:understanding\s+)?\*\*([^*]+)\*\*/i,
    );
    if (reqMatch) {
      const concept = reqMatch[1].trim().toLowerCase();
      const prereq = reqMatch[2].trim().toLowerCase();
      if (!dependencies.has(concept)) dependencies.set(concept, []);
      if (!dependencies.get(concept).includes(prereq)) {
        dependencies.get(concept).push(prereq);
      }
    }
  }

  return { concepts, dependencies };
}

/**
 * Get concepts that depend on the given concept (downstream).
 */
export function getDependents(graph, concept) {
  const lower = concept.toLowerCase();
  const dependents = [];
  for (const [c, deps] of graph.dependencies) {
    if (deps.includes(lower)) dependents.push(c);
  }
  return dependents;
}

/**
 * Get prerequisites for a concept (upstream).
 */
export function getPrerequisites(graph, concept) {
  return graph.dependencies.get(concept.toLowerCase()) || [];
}

/**
 * Compute mastery level for each concept.
 * Levels: unseen → learning → shaky → solid → mastered
 */
export function computeConceptMastery(conceptMapMd, curriculum, spacedRepetition) {
  const graph = parseConceptGraph(conceptMapMd);
  const mastery = new Map();
  const sr = spacedRepetition || {};

  for (const concept of graph.concepts) {
    const lower = concept.toLowerCase();

    let srRecord = null;
    for (const [, record] of Object.entries(sr)) {
      if (record.concept?.toLowerCase() === lower) {
        srRecord = record;
        break;
      }
    }

    let level;
    if (!srRecord) {
      const covered = curriculum?.lessons?.some(
        (l) =>
          l.status === 'completed' &&
          (l.concepts || []).some((c) => c.toLowerCase() === lower),
      );
      level = covered ? 'learning' : 'unseen';
    } else if (srRecord.interval >= 14 && srRecord.streak >= 3) {
      level = 'mastered';
    } else if (srRecord.ease >= 2.0 && srRecord.streak >= 1) {
      level = 'solid';
    } else if (srRecord.ease < 2.0 || srRecord.streak === 0) {
      level = 'shaky';
    } else {
      level = 'learning';
    }

    mastery.set(concept, {
      level,
      interval: srRecord?.interval || 0,
      ease: srRecord?.ease || 2.5,
      streak: srRecord?.streak || 0,
    });
  }

  return mastery;
}

/**
 * Check if all prerequisites for a concept are solid or above.
 * @returns {{ ready: boolean, blocking: string[] }}
 */
export function checkPrerequisites(graph, mastery, concept) {
  const prereqs = getPrerequisites(graph, concept);
  const blocking = [];
  const solidLevels = ['solid', 'mastered'];

  for (const prereq of prereqs) {
    const m =
      mastery.get(prereq) ||
      mastery.get(prereq.charAt(0).toUpperCase() + prereq.slice(1));
    if (!m || !solidLevels.includes(m.level)) {
      blocking.push(prereq);
    }
  }

  return { ready: blocking.length === 0, blocking };
}
