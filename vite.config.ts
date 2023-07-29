import { defineConfig } from "vite";
import pxToRemOrVwPlugin from "vite-plugin-px-rem-vw"
import react from "@vitejs/plugin-react";




// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    pxToRemOrVwPlugin({
      type: "vw",
      options: {
        viewportWidth: 1920
      }
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": "/src/"
    }
  }
});
