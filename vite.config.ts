import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@commonTypes': path.resolve(__dirname, 'src/commonTypes.ts'), // теперь @ указывает на src/
      '@src': path.resolve(__dirname, 'src/'),
    },
  },
});
