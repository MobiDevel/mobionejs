import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
// SDK is a pure TS domain library (no React); keep config lean and forbid React imports.


export default defineConfig([
  // Only lint source and test files; ignore generated dist & build scripts.
  { ignores: [
    'dist/**',
    'coverage/**',
    'scripts/**',
    'metro.config.js',
    'babel.config.js',
    'tsdx.config.js'
  ] },
  { files: ["src/**/*.{ts,tsx}", "src/**/*.test.{ts,tsx}", "src/**/__tests__/**/*.{ts,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'max-lines-per-function': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 16],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'Do not add React to the SDK; keep it framework-agnostic.' },
            { name: 'react-dom', message: 'Do not add React DOM dependencies to the SDK.' }
          ],
          // Only block consumer-style package imports of transitional files; internal relative imports will be migrated gradually.
          patterns: [
            {
              group: [
                '@mobidevel/mobione-sdk/**/CMoTOrder',
                '@mobidevel/mobione-sdk/**/CMoTLoad',
                '@mobidevel/mobione-sdk/**/CMoTVisit',
                '@mobidevel/mobione-sdk/**/CMoTTimeStamp',
                '@mobidevel/mobione-sdk/**/CMoTSubscription'
              ],
              message: 'Transitional CMoT* file import detected. Use namespace modules instead (e.g. @mobidevel/mobione-sdk/order).'
            }
          ]
        }
      ],
    }
  },
  // Test overrides: allow larger test blocks & slightly higher complexity to keep specs readable
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    rules: {
      'max-lines-per-function': ['warn', { max: 600, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 30],
    }
  }
]);