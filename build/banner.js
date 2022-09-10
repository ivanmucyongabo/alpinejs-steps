"use strict";

const pkg = require("../package.json");
const year = new Date().getFullYear();

function getBanner(pluginFilename) {
  return `/*!
  * alpinejs-steps${pluginFilename ? ` ${pluginFilename}` : ""} v${pkg.version} (${
    pkg.homepage
  })
  * Copyright 2021-${year} ${pkg.author}
  * Licensed under MIT (https://github.com/ivanmucyongabo/alpinejs-steps/blob/main/LICENSE)
  */`;
}

module.exports = getBanner;
