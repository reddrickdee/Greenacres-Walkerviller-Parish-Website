import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        globals: true,
        css: true,
        exclude: ['e2e/**', 'node_modules/**'],
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'html'],
            reportsDirectory: 'coverage',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/test/**',
                'src/**/__tests__/**',
                'src/vite-env.d.ts',
                'src/main.tsx',
            ],
            thresholds: {
                'src/lib/**': {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80,
                },
            },
        },
    },
});
