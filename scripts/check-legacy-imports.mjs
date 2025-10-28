#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { glob } from 'glob';

// Transitional legacy files (allowed to exist, but not to be imported elsewhere)
const legacyFiles = [
  'src/order/CMoTOrder.ts',
  'src/load/CMoTLoad.ts',
  'src/visit/CMoTVisit.ts',
  'src/timestamp/CMoTTimeStamp.ts',
  'src/subscription/CMoTSubscription.ts'
];

// Build quick lookup for allowance (self file can reference itself – though they currently only re-export)
const legacySet = new Set(legacyFiles);

// We only flag package-style imports (what consumers would write). Internal relative imports
// are tolerated temporarily until fully migrated.
const transitionalBasenames = new Set(legacyFiles.map(f => f.split('/').pop()));
const sourceFiles = glob.sync('src/**/*.ts');
const pkgImportRegex = /from\s+['"]@mobidevel\/mobione-sdk\/.*\/CMoT[A-Za-z]+['"]/g;
let found = [];
for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8');
  // Skip scanning the transitional file itself (it may document usage examples in comments)
  if (transitionalBasenames.has(file.split('/').pop())) continue;
  const matches = content.match(pkgImportRegex);
  if (matches) {
    found.push({ file, matches });
  }
}
if (found.length) {
  console.error('\nForbidden package imports of transitional CMoT* files detected:');
  for (const f of found) {
    for (const m of f.matches) console.error(` - ${f.file}: ${m}`);
  }
  console.error('\nReplace with namespace imports (e.g. @mobidevel/mobione-sdk/order).');
  process.exit(1);
}
console.log('check-legacy-imports: OK (no forbidden package CMoT* imports found)');
