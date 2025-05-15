import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import typescript from "rollup-plugin-typescript2";

/**
 * Get the rollup config based on the arguments
 * @param {"esm" | "cjs" | "iife"} format format of the bundle
 * @param {string} generatedFileName generated file name
 * @param {boolean} minified should it be minified
 */
function getConfigForFormat(format, minified = false) {
  return {
    file: `dist/index.js`,
    format,
    name: "o_spreadsheet",
    extend: true,
    globals: { "@odoo/owl": "owl" },
    plugins: minified ? [terser()] : [],
  };
}

export default (commandLineArgs) => {
  let output = [];
  let input = "";
  let plugins = [nodeResolve()];
  let config = {};

  if (commandLineArgs.configDev || commandLineArgs.configDist) {
    // Only build one version to improve speed
    input = "build/js/index.js";
    output = [
      {
        name: "o_spreadsheet",
        extend: true,
        globals: { "@odoo/owl": "owl" },
      },
    ];
    if (commandLineArgs.configDev) {
      output[0].file = `build/index.js`;
      output[0].format = `iife`;
    } else {
      output[0].file = `build/index.js`;
      output[0].format = `esm`;
    }
    config = {
      input,
      external: ["@odoo/owl"],
      output,
      plugins,
    };
  } else {
    input = "src/index.ts";
    output = [getConfigForFormat("esm")];
    plugins.push(typescript({ useTsconfigDeclarationDir: false }));
    config = [
      {
        input,
        external: ["@odoo/owl"],
        output,
        plugins,
      },
      {
        input: "dist/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "es" }],
        plugins: [dts(), nodeResolve()],
      },
    ];
  }

  return config;
};
