import { terser } from 'rollup-plugin-terser'

export default {
  input: './wc-bell-ring.js',
  output: {
    file: 'dist/wc-bell-ring.min.js',
    format: 'iife',
    sourcemap: 'inline',
  },
  plugins: [
    terser()
  ],
}