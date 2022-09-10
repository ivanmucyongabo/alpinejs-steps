"use strict";

import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

import emitEJS from "rollup-plugin-emit-ejs";

const replace = require("@rollup/plugin-replace");
const banner = require("./banner.js");

export default (commandLineArgs) => {
  // this will make Rollup ignore the CLI argument
  delete commandLineArgs.configTutorial;

  const libraryName = "AlpineSteps";

  let outputFile = "index";
  const external = [];
  const globals = [];

  const plugins = [
    commonjs(),
    babel({
      // Only transpile our source code
      exclude: "node_modules/**",
      // Include the helpers in the bundle, at most one copy of each
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
          },
        ],
      ],
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    nodeResolve(),
    emitEJS({
      src: "build/jsdoc/tutorial_templates",
      layout: "build/jsdoc/tutorial_templates/layout.html.ejs",
      // dest: "tutorials",
      data: {
        title: "Alpine Steps Tutorials",
        steps: ["first step", "second step", "third step"],
      },
    }),
  ];

  const rollupConfig = {
    input: "src/index.js",
    output: [
      {
        banner,
        file: `tutorials/${outputFile}.js`,
        format: "umd",
        globals,
        name: libraryName,
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    external,
    plugins,
  };

  return rollupConfig;
};
