import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBabel } from '@rsbuild/plugin-babel';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  server: {
    base: '/track',
  },
  output: {
    assetPrefix: '/track/',
  },
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.[jt]sx?$/,
      exclude: [/[\\/]node_modules[\\/]/],
      babelLoaderOptions(opts) {
        opts.plugins?.unshift('babel-plugin-react-compiler');
      },
    }),
  ],
});
