#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const expectedFolders = [
  'loads','orders'
];

const exportsField = pkg.exports || {};
const problems = [];

for (const folder of expectedFolders) {
  const pattern = `./${folder}/*`;
  if (!exportsField[pattern]) {
    problems.push(`Missing export pattern: ${pattern}`);
  }
}

// Ensure internal not exported
for (const key of Object.keys(exportsField)) {
  if (key.startsWith('./internal')) {
    problems.push(`Internal folder should not be exported: ${key}`);
  }
}

if (problems.length) {
  console.error('\u274c Export map validation failed:\n' + problems.map(p=>'- '+p).join('\n'));
  process.exit(1);
}

console.log('\u2705 Export map validation passed.');
