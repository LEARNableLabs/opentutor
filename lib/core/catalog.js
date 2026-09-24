import fs from 'node:fs';
import path from 'node:path';
// Public catalog deliberately reads shipped content only, never student stores.
export function publicCatalog(root = process.cwd()) {
  const dir = path.join(root, 'skills/tutor/domains');
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap(({ name: slug }) => {
      try {
        const c = JSON.parse(fs.readFileSync(path.join(dir, slug, 'curriculum.json'), 'utf8'));
        if (!Array.isArray(c.lessons) || !c.lessons.length) return [];
        return [
          {
            slug,
            topic: c.topic || slug.replace(/-/g, ' '),
            total: c.lessons.length,
            level: c.student_level || 'All levels',
            preview: c.lessons.slice(0, 3).map((l) => l.title),
          },
        ];
      } catch {
        return [];
      }
    })
    .sort((a, b) => a.topic.localeCompare(b.topic));
}
