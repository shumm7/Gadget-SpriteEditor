import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [tsconfigPaths()],
    build: {
        lib: {
            entry: resolve(__dirname, "src/main.ts"),
            name: "SpriteEditor",
            fileName: "Gadget-SpriteEditor",
        },
        target: "es2021",
    },
    publicDir: "./public",
})
