// Published content and its resumable build share one versioned row. Publishing
// with compare-and-set fences out a worker whose lease expired or student was removed.
export const GENERATED_PREFIX = 'generated_topic:';
export function generatedTopicKey(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug)) throw new Error('Invalid topic slug');
  return GENERATED_PREFIX + slug;
}
export function decodeTopic(raw) {
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}
