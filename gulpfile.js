const { src, dest, parallel, series } = require("gulp");
var ejs = require("gulp-ejs");
var file = require("gulp-file");
const rename = require("gulp-rename");
const del = require("del");
const { rollup } = require("rollup");

const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const { babel } = require("@rollup/plugin-babel");
const { terser } = require("rollup-plugin-terser");
const replace = require("@rollup/plugin-replace");

async function tutorialsDemoScript() {
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
  ];

  const bundle = await rollup({
    input: "src/index.js",
    external,
    plugins,
  });

  return bundle.write({
    file: `build/jsdoc/default/static/scripts/${outputFile}.js`,
    format: "iife",
    globals,
    name: libraryName,
    plugins: [terser()],
    sourcemap: false,
  });
}

async function tutorials() {
  return src("./build/jsdoc/tutorial_templates/*.ejs")
    .pipe(
      ejs({
        title: "Alpine Steps Tutorials",
        steps: ["first step", "second step", "third step"],
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("./tutorials"))
    .pipe(dest("./tutorials"));
}

async function tutorialsConfig() {
  return file(
    "tutorial.config.json",
    JSON.stringify(
      {
        "basic_usage.html": {
          title: "Basic",
        },
        "carousel_usage.html": {
          title: "Carousel",
        },
        "tabs_usage.html": {
          title: "Tabs",
        },
        "wizard_usage.html": {
          title: "Wizard",
        },
        "stimulus_usage.html": {
          title: "Stimulus",
        },
      },
      { src: true }
    )
  ).pipe(dest("./tutorials"));
}

async function cleanForBuild() {
  return del(["tutorials/**/*"]);
}

async function cleanForDocs() {
  return del(["tutorials/**/partial_*.html"]);
}

exports.default = series(
  cleanForBuild,
  parallel(tutorials, tutorialsConfig, tutorialsDemoScript),
  cleanForDocs
);
