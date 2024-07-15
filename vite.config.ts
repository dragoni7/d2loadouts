import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === "serve") {
    return {
      plugins: [react()],
      server: {
        https: {
          key: fs.readFileSync("./certs/localhost.key"),
          cert: fs.readFileSync("./certs/localhost.crt"),
        },
      },
    };
  } else {
    return {
      plugins: [react()],
    };
  }
});
