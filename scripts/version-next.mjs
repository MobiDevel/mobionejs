#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

// Automated patch release script.
// Steps:
// 1. Ensure git working tree clean
// 2. npm version patch (creates tag)
// 3. Generate changelog
// 4. Amend / create conventional commit including ClickUp ID (env CU_ID or placeholder)
// 5. Print next steps

function sh(cmd) {
  return execSync(cmd, { stdio: 'inherit' });
}

function get(cmd) {
  return execSync(cmd, { stdio: 'pipe' }).toString().trim();
}

const cuId = process.env.CU_ID || 'CU-placeholder';

const status = get('git status --porcelain');
if (status) {
  console.error('✖ Working tree not clean. Commit or stash before running version:next.');
  process.exit(1);
}

console.log('🔢 Bumping patch version...');
sh('npm version patch');

console.log('📝 Generating changelog...');
if (!existsSync('CHANGELOG.md')) {
  console.log('ℹ️  CHANGELOG.md missing; creating initial file');
  // create minimal initial by running generator (will create file if -i specified and present)
}
sh('npm run changelog:generate');

console.log('📦 Staging release artifacts...');
const filesToStage = ['package.json', 'package-lock.json', 'CHANGELOG.md']
  .filter((file) => existsSync(file));
sh(`git add ${filesToStage.join(' ')}`);

const newVersion = JSON.parse(readFileSync('package.json', 'utf8')).version;
const commitMsg = `chore(release): ${newVersion} ${cuId}`;

console.log(`✅ Committing release: ${commitMsg}`);
try {
  sh(`git commit -m "${commitMsg}"`);
} catch (e) {
  console.error('Commit failed (maybe hook rules?). You may need to amend manually.');
  process.exit(1);
}

const tag = get('git describe --tags --abbrev=0');
console.log(`🏷  Tag created: ${tag}`);

console.log('\nNext steps:');
console.log('  git push && git push --tags');
console.log('  (Optional) Create GitHub Release from tag to trigger publish workflow');
console.log('\nOverride ClickUp ID by setting CU_ID environment variable, e.g.');
console.log('  CU_ID=CU-123abc npm run version:next');
