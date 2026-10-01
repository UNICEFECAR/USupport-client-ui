/* eslint-disable */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { execSync } from "child_process";

const getCommit = () => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
};

// Unique per build, so open tabs can detect that a newer version was deployed (see useAppVersionCheck)
const APP_VERSION = `${getCommit()}-${Date.now()}`;

const appVersionPlugin = () => ({
  name: "app-version",
  apply: "build",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "version.json",
      source: JSON.stringify({
        version: APP_VERSION,
        builtAt: new Date().toISOString(),
      }),
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: "/client/",
    plugins: [react(), appVersionPlugin()],
    define: {
      __APP_VERSION__: JSON.stringify(APP_VERSION),
    },
    resolve: {
      alias: {
        "@USupport-components-library": path.resolve(
          __dirname,
          "./USupport-components-library"
        ),
        "#blocks": path.resolve(__dirname, "./src/blocks"),
        "#pages": path.resolve(__dirname, "./src/pages"),
        "#services": path.resolve(__dirname, "./src/services"),
        "#backdrops": path.resolve(__dirname, "./src/backdrops"),
        "#routes": path.resolve(__dirname, "./src/routes"),
        "#hooks": path.resolve(__dirname, "./src/hooks"),
        "#modals": path.resolve(__dirname, "./src/modals"),
      },
    },
    build: {
      sourcemap: true,
    },
    server: {
      allowedHosts: [
        "romania.staging.usupport.georgiganchev",
        "poland.staging.usupport.georgiganchev",
        "kazakhstan.staging.usupport.georgiganchev",
      ],
    },
  };
});
