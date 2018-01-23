import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-minify-es';

export default [
  {
    input: 'lib/index.js',
    output: {
      name: 'urlParser',
      file: 'dist/jsVideoUrlParser.js',
      format: 'umd',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        presets: [['@babel/env', {'modules': false}]],
      }),
    ],
  }, {
    input: 'lib/index.js',
    output: {
      name: 'urlParser',
      file: 'dist/jsVideoUrlParser.min.js',
      format: 'umd',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        presets: [['@babel/env', {'modules': false}]],
      }),
      minify(),
    ],
  },
];
