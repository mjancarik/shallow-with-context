const config = {
  input: 'src/shallowWithContext.js',
  treeshake: {
    moduleSideEffects: 'no-external'
  },
  output: [
    {
      file: `./dist/shallowWithContext.cjs.js`,
      format: 'cjs',
      exports: 'named'
    },
    {
      file: `./dist/shallowWithContext.esm.js`,
      format: 'esm',
      exports: 'named'
    }
  ],
  external: ['to-aop', 'create-clone-class']
};

export default config;
