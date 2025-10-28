#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import process from 'process';

const write = process.argv.includes('--write');

const root = process.cwd();
const symbolMapPath = path.join(root, 'scripts', 'symbol-map.json');
if (!fs.existsSync(symbolMapPath)) {
  console.error('Missing symbol-map.json. Run: npm run generate:symbol-map');
  process.exit(1);
}
const symbolMap = JSON.parse(fs.readFileSync(symbolMapPath, 'utf8'));

// Group symbols by module path
/** @type {Record<string,string[]>} */
const moduleToSymbols = {};
for (const [sym, mod] of Object.entries(symbolMap)) {
  if (!moduleToSymbols[mod]) moduleToSymbols[mod] = [];
  moduleToSymbols[mod].push(sym);
}

const SRC_DIR = path.join(root, 'src');

/** Collect all TS files except declaration & tests for transformation */
function allFiles(dir) {
  return fs.readdirSync(dir).flatMap(entry => {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) return allFiles(full);
    if (!/\.(ts|tsx)$/.test(entry)) return [];
    if (/\.d\.ts$/.test(entry)) return [];
    return [full];
  });
}

const files = allFiles(SRC_DIR);

let modified = 0;
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  // Only target imports from root package
  if (!src.includes("'@mobidevel/mobione-sdk'") && !src.includes('"@mobidevel/mobione-sdk"')) continue;

  // Find import blocks from root
  const importRegex = /(import\s+{[^}]+}\s+from\s+['"]@mobidevel\/mobione-sdk['"];?)/g;
  let changed = false;
  src = src.replace(importRegex, (full) => {
    const braceContent = full.split('{')[1].split('}')[0];
    const symbols = braceContent.split(',').map(s=>s.trim()).filter(Boolean);
    // Partition by original module
    /** @type {Record<string,string[]>} */
    const modBuckets = {};
    for (const sym of symbols) {
      const mod = symbolMap[sym];
      if (!mod) return full; // unknown symbol, skip entire block (conservative)
      if (!modBuckets[mod]) modBuckets[mod] = [];
      modBuckets[mod].push(sym);
    }
    changed = true;
    // Build new grouped imports
    const newImports = Object.entries(modBuckets).map(([mod, syms]) => {
      return `import { ${syms.join(', ')} } from '@mobidevel/mobione-sdk/${mod}';`;
    }).join('\n');
    return newImports;
  });

  if (changed) {
    modified++;
    if (write) fs.writeFileSync(file, src, 'utf8');
    else {
      console.log('[DRY] Would modify', path.relative(root, file));
    }
  }
}

console.log(write ? `Updated ${modified} files.` : `Dry run complete. ${modified} files would change.`);
