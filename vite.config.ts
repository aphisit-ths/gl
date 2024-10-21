import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon.png",
                "192.png",
            ],
            manifest: {
                name: "🍀",
                short_name: "🍀",
                description: "🍀",
                theme_color: "#96ef82",
                icons: [
                    {
                        src: "192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
});
