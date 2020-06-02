import sucrase from "@rollup/plugin-sucrase"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
// import { terser } from "rollup-plugin-terser"
import path from "path"
import { chmodSync } from "fs"

function executable() {
  let file
  return {
    generateBundle(options) {
      file = options.file
    },

    writeBundle() {
      if (file) chmodSync(file, 0o751)
    },
  }
}

export default {
  input: "src/index.ts",
  output: {
    file: "dist/polydock.js",
    banner: `#!/usr/bin/gjs
      imports.gi.versions.Gtk = "3.0"
      imports.gi.versions.Wnck = "3.0"
      imports.gi.versions.GdkX11 = "3.0"`,
    format: "iife",
    /**
     * @param {string} id
     */
    globals: (id) => `imports.gi.${path.basename(id).replace(/-.*/u, "")}`,
  },
  /**
   * @param {string} id
   */
  external: (id) => {
    return id.startsWith("./types")
  },
  plugins: [
    replace({ "console.log": "log" }),
    resolve({
      extensions: [".js", ".ts"],
    }),
    sucrase({
      production: false,
      exclude: ["node_modules/**"],
      transforms: ["typescript"],
    }),
    // terser(),
    executable(),
  ],
}
