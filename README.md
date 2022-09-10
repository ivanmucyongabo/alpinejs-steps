# alpinejs-steps

A controller for creating stepwise UI. Inspired by ember-steps.

## Installation

```
$ npm i alpinejs-steps --save
```
## What's included

With the download you'll find the following directoryies and files, with both compiled and minified versions.

<details>
    <summary>Download contents</summary>

    ```text
    debug-console/dist/
    ├── steps.bundle.js
    ├── steps.bundle.js.map
    ├── steps.bundle.min.js
    ├── steps.bundle.min.js.map
    ├── steps.esm.js
    ├── steps.esm.js.map
    ├── steps.esm.min.js
    ├── steps.esm.min.js.map
    ├── steps.js
    ├── steps.js.map
    ├── steps.min.js
    └── steps.min.js.map
    ```

</details>

## Usage

**node**
app.js/app.ts
```js
import Alpine from `alpinejs`
import { StepsComponent } from 'alpinejs-steps';
 
Alpine.data('steps', StepsComponent)
// OR
Alpine.data('tabs', StepsComponent)
// OR
Alpine.data('wizard', StepsComponent)
// OR
Alpine.data('carousel', StepsComponent)

Alpine.start()
```

**browser**
indext.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/alpinejs@3.10.3/dist/cdn.min.js" defer="true"></script>
    <script src="https://unpkg.com/alpinejs-steps@latest/dist/steps.bundle.min.js"></script>
  </head>
  <body>
    <section>
        <h3>Basic usage</h3>
                    
        <div x-data="steps(['first step', 'second step', 'third step'])">
            <div>
                <div x-show="isActive('first step')">first step</div>
                <div x-show="isActive('second step')">second step</div>
                <div x-show="isActive('third step')">third step</div>
            </div>
            <div>
            <button x-on:click="transitionToPrevious()" type="button">Previous</button>
            <button x-on:click="transitionToNext()" type="button">Next</button>
            </div>
        </div>
    </section>
    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('steps', AlpineSteps.StepsComponent)
        })
    </script>    
  </body>
</html>
```

## Tutorials

The above examples show the basic idea, but there're other ways to use it. Take a look at [the tutorials][tutorials] for some examples.

Even though it is built with AlpineJs in mind.
Because of how decoupled it is, integration with
other projects focused on server rendered html, like Stimulus.

## Copyright and license

Code copyright 2021–2022. Code released under the [MIT License](https://github.com/ivanmucyongabo/alpinejs-steps/blob/main/LICENSE).

[tutorials]: https://ivanmucyongabo.github.io/alpinejs-steps/tutorial-index_.html