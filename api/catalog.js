import { publicCatalog } from '../lib/core/catalog.js';
import { demoHandler } from './_lib/demo.js';
let catalog;
function catalogHandler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  catalog ||= publicCatalog();
  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json(catalog);
}
// One function serves /api/catalog and /api/demo: the Hobby plan allows 12 functions
// per deployment, and vercel.json rewrites /api/demo here with ?via=demo.
const demo = demoHandler();
export default (req, res) => (req.query?.via === 'demo' ? demo : catalogHandler)(req, res);
