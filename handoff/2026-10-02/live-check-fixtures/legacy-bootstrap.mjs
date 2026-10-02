import { ClaudeCLIAdapter } from 'file:///Users/ggiannon/Documents/gcg/opentutor/lib/adapters/claude-cli.js';
import { ClaudeCLIAdapter as Legacy } from './legacy-cli.mjs';
ClaudeCLIAdapter.prototype.generate = Legacy.prototype.generate;
