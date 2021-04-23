import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const plugins = [
  babel({
    babelHelpers: 'bundled'
  }),
  commonjs(),
  json(),
  nodeResolve({
    preferBuiltins: true
  }),
  (
    process.env.ROLLUP_WATCH
      ? undefined
      : terser()
  )
];

export default [
  {
    input: 'src/provider.js',
    output: {
      dir: 'lib',
      format: 'cjs',
      sourcemap: true
    },
    external: [
      // Atom
      'atom',
      'electron',

      // Node
      'assert',
      'buffer',
      'child_process',
      'events',
      'fs',
      'os',
      'path',
      'stream',
      'util'
    ],
    plugins: plugins
  }
];
