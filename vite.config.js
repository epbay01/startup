import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        include: ["src/questionClass.js"]
    },
    server: {
        proxy: {
            '/api': 'http://localhost:4000',
            "/ws": {
                target: "ws://localhost:4000",
                ws: true
            }
        },
    },
});