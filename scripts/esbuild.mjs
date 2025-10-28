import * as esbuild from 'esbuild';
import * as glob from 'glob';

esbuild
  .build({
    stdin: {contents: ''},
    inject: glob.sync('dist/**/*.{js,cjs,mjs}'),
    bundle: true,
    sourcemap: true,
    minify: true,
    outfile: 'dist/index.min.js',
    allowOverwrite: true,
  })
  .then(() => console.log('⚡ Javascript build complete! ⚡'))
  .catch(() => process.exit(1));
