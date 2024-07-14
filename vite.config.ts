import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === "serve") {
    return {
      plugins: [react(), nodePolyfills({ include: ["fs", "stream"] })],
      server: {
        https: {
          key: fs.readFileSync("./certs/localhost.key"),
          cert: fs.readFileSync("./certs/localhost.crt"),
        },
      },
    };
  } else {
    return {
      plugins: [react(), nodePolyfills({ include: ["fs", "stream"] })],
    };
  }
});
