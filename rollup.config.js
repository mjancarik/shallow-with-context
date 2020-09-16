import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import run from '@rollup/plugin-run';

const watchMode = process.env.ROLLUP_WATCH === 'true';

const config = {
  input: 'src/shallowWithContext.js',
  treeshake: {
    moduleSideEffects: 'no-external',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    watchMode &&
      run({
        execArgv: ['-r', 'source-map-support/register'],
      }),
  ],
  watch: {
    include: 'src/**',
  },
  output: [
    {
      file: `./dist/shallowWithContext.cjs`,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: `./dist/shallowWithContext.mjs`,
      format: 'esm',
      exports: 'named',
    },
  ],
  external: ['to-aop', 'create-clone-class'],
};

export default config;
