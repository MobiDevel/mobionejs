#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'src');
const indexFile = path.join(root, 'index.ts');
const text = fs.readFileSync(indexFile, 'utf8');

// Simple heuristic: capture lines like `export { a, b as c } from './order/CMoTOrder';` and `export type { X } from`.
const exportRegex = /export\s+(type\s+)?{([^}]+)}\s+from\s+'(.+?)';/g;
const starRegex = /export \* from '\.(.+?)';/g;

/** @type {Record<string,string>} */
const symbolToModule = {};

let match;
while ((match = exportRegex.exec(text))) {
  const modulePath = match[3];
  const symbols = match[2].split(',').map(s=>s.trim().split('\n').join('')).filter(Boolean);
  for (let raw of symbols) {
    // Strip possible alias: symbol as Alias
    const parts = raw.split(/\s+as\s+/);
    const original = parts[0].trim();
    const alias = (parts[1]||original).trim();
    symbolToModule[alias] = modulePath.replace(/^\.\//,'');
  }
}
// star exports (warning only)
if (starRegex.test(text)) {
  console.warn('Warning: star exports present; codemod map may be incomplete');
}

const outPath = path.join(process.cwd(), 'scripts', 'symbol-map.json');
fs.writeFileSync(outPath, JSON.stringify(symbolToModule, null, 2));
console.log('Generated symbol map at', outPath, 'with', Object.keys(symbolToModule).length, 'entries');
