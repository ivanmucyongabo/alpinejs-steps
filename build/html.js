"use strict";

const { makeHtmlAttributes } = require("@rollup/plugin-html");

const year = new Date().getFullYear();

function htmlTemplate({ locals, vendors }) {
  return ({ attributes, files, meta, publicPath, title }) => {
    let scripts = [...(files.js || [])];
    let links = [...(files.css || [])];
    let vendorScripts = [];
    let vendorLinks = [];

    // locals = [{ type: 'js', file: '//xxxx1.js', pos: 'before' }, { type: 'css', file: '//xxxx1.css' }]
    if (Array.isArray(locals)) {
      const beforeLinks = [];
      const beforeScripts = [];
      locals.forEach((node) => {
        let fileList;
        const isCssFile = node.type === "css";
        if (node.pos === "before") {
          fileList = isCssFile ? beforeLinks : beforeScripts;
        } else {
          fileList = isCssFile ? links : scripts;
        }
        fileList.push({ fileName: node.file });
      });
      scripts = beforeScripts.concat(scripts);
      links = beforeLinks.concat(links);
    }

    if (Array.isArray(vendors)) {
      const beforeLinks = [];
      const beforeScripts = [];
      vendors.forEach((node) => {
        let fileList;
        const isCssFile = node.type === "css";
        if (node.pos === "before") {
          fileList = isCssFile ? beforeLinks : beforeScripts;
        } else {
          fileList = isCssFile ? vendorLinks : vendorScripts;
        }
        fileList.push({ attributes: node.attributes });
      });
      vendorScripts = beforeScripts.concat(vendorScripts);
      vendorLinks = beforeLinks.concat(vendorLinks);
    }

    scripts = scripts
      .map(({ fileName }) => {
        const attrs = makeHtmlAttributes(attributes.script);
        return `<script src="${publicPath}${fileName}"${attrs}></script>`;
      })
      .join("\n");

    links = links
      .map(({ fileName }) => {
        const attrs = makeHtmlAttributes(attributes.link);
        return `<link href="${publicPath}${fileName}" screen="media" rel="stylesheet"${attrs} screen>`;
      })
      .join("\n");

    vendorScripts = vendorScripts
      .map(({ attributes }) => {
        const attrs = makeHtmlAttributes(attributes);
        return `<script ${attrs}></script>`;
      })
      .join("\n");

    vendorLinks = vendorLinks
      .map(({ attributes }) => {
        const attrs = makeHtmlAttributes(attributes);
        return `<link screen="media" rel="stylesheet"${attrs}>`;
      })
      .join("\n");

    const metas = meta
      .map((input) => {
        const attrs = makeHtmlAttributes(input);
        return `<meta${attrs}>`;
      })
      .join("\n");

    return `
      <!doctype html>
      <html${makeHtmlAttributes(attributes.html)}>
        <head>
          ${metas}
          <title>${title}</title>
          ${vendorLinks}
          ${links}
          ${vendorScripts}
          ${scripts}
        </head>
        <body>
          <header class="container">
            <nav class="navbar bg-light">
              <a class="navbar-brand" href="#">
                <h1>${title}</h1>
              </a>
            </nav>
          </header>
          <main class="container">
            <section class="row gy-5">
              <header class="col-sm-12">
                <h2>Common UI examples</h2>
                <p class="lead">Note that these examples use some AlpineJs specific features, but the controller is the root.</p>
              </header>
              <article class="col-sm-12 col-lg-6">
                <h3>Basic usage</h3>
                ${basicHtml(data)}
              </article>
              <article class="col-sm-12 col-lg-6">
                <h3>Tabs usage</h3>
                ${tabsHtml(data)}
              </article>
              <article class="col-sm-12 col-sm-12">
                <h3>Wizard usage</h3>
                ${wizardHtml(data)}
              </article>
              <article class="col-sm-12 col-sm-12">
                <h3>Carousel usage</h3>
                ${carouselHtml(data)}
              </article>
            </section>
          </main>
          <footer></footer>
          <script>
            ${initAlpine}
          </script>
        </body>
      </html>
    `;
  };
}

const data = ["first step", "second step", "third step"];

const xData = `x-data='steps(${JSON.stringify(data)})'`;

const initAlpine = `
document.addEventListener('alpine:init', () => {
  Alpine.data('steps', AlpineSteps.StepsComponent)
})
`;

const contClasses = "p-5 bg-light";

const basicHtml = (steps) => {
  return `
  <div ${xData}>
    <div class="${contClasses}">
      ${steps
        .map((step) => `<div x-show="isActive('${step}')">${step}</div>`)
        .join("")}
    </div>
    <div>
      <button x-on:click="transitionToPrevious()" type="button" class="btn btn-secondary">Previous</button>
      <button x-on:click="transitionToNext()" type="button" class="btn btn-primary">Next</button>
    </div>
  </div>`;
};

const tabsHtml = (steps) => {
  return `
  <div ${xData}>
    <div role="tablist" class="nav nav-tabs">
      ${steps
        .map(
          (step, i) => `<div 
      id="tab-${i}"
      class="nav-item"
      role="tab"" 
      aria-controls="tabpanel-${i}"
      x-bind:aria-selected="isActive('${step}')"
      x-on:click="transitionTo('${step}')">
        <a 
        class="nav-link"
        href="#"
        x-bind:class="isActive('${step}') && 'active'" >${step}</a>
      </div>`
        )
        .join("")}
    </div>
    <div class="${contClasses}">
      ${steps
        .map(
          (step, i) => `<div 
      id="tabpanel-${i}" 
      role="tabpanel" 
      tabindex="0" 
      aria-labelledby="tab-${i}"
      x-show="isActive('${step}')">${step}</div>`
        )
        .join("")}
    </div>
  </div>`;
};

const wizardHtml = (steps) => {
  return `
  <div ${xData}>
    <div class="progress">
      <div 
      class="progress-bar" 
      role="progressbar" 
      aria-label="Wizard example"
      aria-valuemin="0"
      x-bind:style="\`width: \${(currentStepIndex/length)*100}%;\`" 
      x-bind:aria-valuenow="currentStepIndex" 
      x-bind:aria-valuemax="length"></div>
    </div>  
    <div class="${contClasses}">
      ${steps
        .map(
          (step) => `<div
      x-show="isActive('${step}')">${step}</div>`
        )
        .join("")}
    </div>
    <div>
      <button 
      type="button" 
      class="btn btn-secondary"
      x-on:click="transitionToPrevious()"
      x-bind:disabled="!pickPrevious()">Previous</button>
      <button 
      type="button" 
      class="btn btn-primary" 
      x-on:click="transitionToNext()"
      x-bind:disabled="!pickNext()">Next</button>
    </div>
  </div>`;
};

const carouselHtml = (steps) => {
  return `
  <div x-data='steps(${JSON.stringify(data)}, true)'>
    <div 
    id="carousel"
    class="carousel slide"
    aria-roledescription="carousel"
    aria-label="Placeholder images">

      <div class="carousel-indicators">
        ${steps
          .map(
            (step) => `
            <button 
            type="button" 
            aria-controls="carousel-items"
            aria-label="${step}"
            data-bs-target=""
            x-bind:class="isActive('${step}') && 'active'" 
            x:bind:aria-current="isActive('${step}')  && 'true'"></button>
            `
          )
          .join("")}      
      </div>

      <div class="carousel-inner" id="carousel-items" aria-live="off">
        ${steps
          .map(
            (step) => `<div 
            class="carousel-item" 
            role="group"
            aria-roledescription="slide"
            x-bind:aria-label="getIndex('${step}')"
            x-bind:class="isActive('${step}') && 'active'">
              <img src="https://via.placeholder.com/350x150/000000/FFFFFF/?text=${step}" class="d-block w-100" alt="${step}">
            </div>`
          )
          .join("")}
      </div>

      <button 
      class="carousel-control-prev" 
      type="button"
      aria-controls="carousel-items"
      aria-label="Previous Slide"
      x-on:click="transitionToPrevious()">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button 
      class="carousel-control-next" 
      type="button"
      aria-controls="carousel-items"
      aria-label="Next Slide"
      x-on:click="transitionToNext()">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>

    </div>
  </div>`;
};

module.exports = htmlTemplate;
