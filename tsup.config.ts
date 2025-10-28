import { defineConfig } from 'tsup';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

const external = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {})
];

export default defineConfig({
  entry: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.stories.tsx',
    '!src/**/*.stories.ts',
    '!src/**/__tests__/**'
  ],
  format: ['esm', 'cjs'],
  target: 'es2020',
  sourcemap: true,
  dts: true,
  clean: true,
  bundle: false,
  splitting: false,
  minify: false,
  platform: 'neutral',
  skipNodeModulesBundle: true,
  external,
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs'
    };
  }
});
