import logSymbols from 'log-symbols';
import { build } from 'esbuild';

/* eslint-disable @typescript-eslint/no-var-requires */
build({
  bundle: true,
  entryPoints: [
    'src/provider.js'
  ],
  external: [
    'atom',
    'electron'
  ],
  minify: true,
  outfile: 'lib/provider.js',
  platform: 'node',
  sourcemap: true,
  watch: process.env.ESBUILD_WATCH && {
    onRebuild(error) {
      if (error) {
        console.error(`${logSymbols.error} Build failed:`, error.errors.text);
      } else {
        console.log(`${logSymbols.success} Build succeeded`);
      }
    },
  },
}).catch(() => process.exit(1));
