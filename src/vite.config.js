// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                main_view: resolve(__dirname, 'main_view.html'),
                maze_view: resolve(__dirname, 'maze_view.html'),
            },
        },
    },
})
