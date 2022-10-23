import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@USupport-components-library": path.resolve(
          __dirname,
          "./USupport-components-library"
        ),
      },
    },
  };
});
