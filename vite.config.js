
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        account: resolve(__dirname, 'account.html'),
        messaging: resolve(__dirname, 'messaging.html'),
        postmake1: resolve(__dirname, 'postmake1.html'),
        postmake2: resolve(__dirname, 'postmake2.html'),
        postview: resolve(__dirname, 'postview.html'),
        postworkspace: resolve(__dirname, 'postworkspace.html'),
      }
    }
  }
});