"use strict";

import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
const replace = require("@rollup/plugin-replace");

import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
const html = require("@rollup/plugin-html");

const htmlTemplate = require("./build/html.js");
const banner = require("./build/banner.js");

export default (commandLineArgs) => {
  const DEMO = commandLineArgs.configDemo === true;
  // this will make Rollup ignore the CLI argument
  delete commandLineArgs.configDemo;

  const libraryName = "AlpineSteps";
  const BUNDLE = process.env.BUNDLE === "true";
  const ESM = process.env.ESM === "true";

  let outputFile = `steps${ESM ? ".esm" : ""}`;
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
  ];

  if (BUNDLE) {
    outputFile += DEMO ? "" : ".bundle";
    plugins.push(
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      nodeResolve()
    );
  }

  if (DEMO) {
    plugins.push(
      html({
        template: htmlTemplate({
          vendors: [
            {
              type: "js",
              pos: "before",
              attributes: {
                src: "https://unpkg.com/alpinejs@3.10.3/dist/cdn.min.js",
                defer: true,
              },
            },
            {
              type: "css",
              pos: "before",
              attributes: {
                href: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css",
                integrity:
                  "sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT",
                crossorigin: "anonymous",
              },
            },
          ],
        }),
        title: "Alpine Steps Demo",
      }),
      serve({
        open: true,
        contentBase: "demo",
      }),
      livereload({
        watch: "demo",
      })
    );
  }

  const rollupConfig = {
    input: "src/index.js",
    output: [
      {
        banner,
        file: DEMO ? `demo/${outputFile}.js` : `dist/${outputFile}.js`,
        format: ESM ? "es" : "umd",
        globals,
        sourcemap: true,
      },
    ],
    external,
    plugins,
  };

  if (!DEMO) {
    rollupConfig.output.push({
      banner,
      file: `dist/${outputFile}.min.js`,
      format: ESM ? "es" : "umd",
      globals,
      plugins: [terser()],
      sourcemap: true,
    });
  }

  if (!ESM) {
    for (
      let i = 0, outputs = rollupConfig.output, output;
      (output = outputs[i]);
      i++
    ) {
      output.name = libraryName;
    }
  }

  return rollupConfig;
};
