const config = {
  input: 'src/shallowWithContext.js',
  treeshake: {
    pureExternalModules: true
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
  external: ['to-aop']
};

export default config;
