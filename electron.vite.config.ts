import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import Icons from "unplugin-icons/vite";
import version from "vite-plugin-package-version";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [
      svelte(),
      Icons({
        compiler: "svelte",
      }),
      version(),
    ],
  },
});
