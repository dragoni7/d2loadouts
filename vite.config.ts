import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      server: {
        https: {
          key: fs.readFileSync('./certs/localhost.key'),
          cert: fs.readFileSync('./certs/localhost.crt'),
        },
      },
      resolve: {
        alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      },
    };
  } else {
    return {
      plugins: [react()],
      resolve: {
        alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      },
    };
  }
});
