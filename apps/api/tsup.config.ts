import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    server: 'src/server.ts',
  },
  format: ['cjs'],
  dts: false,
  clean: true,
  external: ['@prisma/client'],
  banner: {
    js: '#!/usr/bin/env node',
  },
});