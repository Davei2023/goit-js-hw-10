import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import sortMediaQueries from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    base: '/goit-js-hw-10/',

    root: 'src',

    define: {
      global: 'globalThis',
    },

    css: {
      postcss: {
        plugins: [
          sortMediaQueries({
            sort: 'mobile-first',
          }),
        ],
      },
    },

    build: {
      sourcemap: true,
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor';
          },
          entryFileNames: chunkInfo =>
            chunkInfo.name === 'commonHelpers' ? 'commonHelpers.js' : '[name].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },

    plugins: [
      injectHTML(),
      FullReload(['src/**/*.html']),
    ],

    server: {
      open: '/1-timer.html',
    },
  };
});