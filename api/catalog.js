import { publicCatalog } from '../lib/core/catalog.js';
let catalog;
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  catalog ||= publicCatalog();
  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json(catalog);
}
