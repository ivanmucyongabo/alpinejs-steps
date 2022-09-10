/*!
  * alpinejs-steps v1.0.0 (https://github.com/ivanmucyongabo/alpinejs-steps#readme)
  * Copyright 2021-2022 Ivan Mucyo Ngabo
  * Licensed under MIT (https://github.com/ivanmucyongabo/alpinejs-steps/blob/main/LICENSE)
  */
/**
 * Alpine Steps
 * @module alpinejs-steps
 */

/**
 * Class for stepwise UI controller
 *
 * @property {string[]|Object[]} steps - Step items.
 * @property {string} currentStep - The name of the active step item.
 * @property {boolean} circular - If circular indexing is enabled.
 */

class StepsController {
  /**
   * Create a controller
   * @param {string[]|Object[]} model - Step items.
   * @param {string} model[].name - The name of the step, if an array of Objects.
   * @param {boolean} circular - Allow circular step indexing.
   * @param {string} initialStep - The name of the step to start at.
   */
  constructor(model = [], circular = false, initialStep) {
    this.steps = model;
    this.currentStep = initialStep ? initialStep : model[0].name || model[0];
    this.circular = circular;
  }
  /**
   * Get the length of steps.
   * @return {number} The length of the steps array.
   */


  get length() {
    return this.steps.length;
  }
  /**
   * Get the 1 based index of active step.
   * @return {number} 1 based index of active step.
   */


  get currentStepIndex() {
    // 1 based
    return this.currentIndex + 1;
  }
  /**
   * Get the 0 based index of active step.
   * @return {number} 0 based index of active step.
   */


  get currentIndex() {
    // 0 based
    return this.steps.findIndex(step => {
      let name = step.name || step;
      return name === this.currentStep;
    });
  }
  /**
   * Get the name for the first step item.
   * @return {string} Name of first step item.
   */


  get firstStepName() {
    const firstNode = this.steps[0];
    return firstNode.name || firstNode;
  }
  /**
   * Get the active step item.
   * @return {string|Object} The active step item.
   */


  get currentStepNode() {
    return this.steps.find(stepNode => (stepNode.name || stepNode) === this.currentStep);
  }
  /**
   * Validate if step is active by name.
   * @param {string} name - Name of step to check.
   * @returns {boolean} If the step is active.
   */


  isActive(name) {
    return this.currentStep === name;
  }
  /**
   * Activate step by name.
   * @param {string} to - Name of step to activate.
   * @returns {boolean} If the step was activated.
   */


  transitionTo(to) {
    const destination = to.name || to;

    if (destination && destination !== this.currentStep) {
      return this.activate(destination);
    }

    return false;
  }
  /**
   * Activate the next step.
   * @returns {boolean} If the next step is activated.
   */


  transitionToNext() {
    const to = this.pickNext();
    return this.transitionTo(to);
  }
  /**
   * Activate the previous step.
   * @returns {boolean} If the previous step is activated.
   */


  transitionToPrevious() {
    const to = this.pickPrevious();
    return this.transitionTo(to);
  }
  /**
   * Set current step by name.
   * @param {string|Object} step
   * @param {string} step[].name - The name of the step, if an Object.
   * @returns {boolean} If step is activated, without error.
   */


  activate(step) {
    const name = step.name || step;
    this.currentStep = name;
    return true;
  }
  /**
   * Get the next available step item.
   * Note: If in circular mode, it will always return a step.
   * @returns {boolean|string} The next step if available or false.
   */


  pickNext() {
    const currentNode = this.steps[this.incrementIndex()];

    if (currentNode) {
      return currentNode.name || currentNode;
    }

    return false;
  }
  /**
   * Get the previous available step item.
   * Note: If in circular mode, it will always return a step.
   * @returns {boolean|string} The previous step if available or false.
   */


  pickPrevious() {
    const currentNode = this.steps[this.incrementIndex(-1)];

    if (currentNode) {
      return currentNode.name || currentNode;
    }

    return false;
  }
  /**
   * Increment the index.
   * Note: If in circular mode, it will always return an in bounds index.
   * @param {number} increment - The value to increment by.
   * @returns {number} The index after increment.
   */


  incrementIndex(increment = 1) {
    let l = this.length;
    let i = this.currentIndex + increment;

    if (this.circular) {
      i = (i % l + l) % l;
    }

    return i;
  }
  /**
   * Get the 1 based index of the step by name.
   * @param {string} nameQuery - The name of the step to check.
   * @returns {number} The index of the step if available.
   */


  getIndex(nameQuery) {
    return this.steps.findIndex(step => {
      let name = step.name || step;
      return name === nameQuery;
    }) + 1;
  }
  /**
   * Required by Alpine for automatic execution.
   */


  init() {}

}
/**
 * @typedef {Object} StepsComponentData
 * @property {string[]|Object[]} steps - Step items.
 * @property {string} currentStep - The name of the active step item.
 * @property {boolean} circular - If circular indexing is enabled.
 * @property {number} length - The length of the steps items.
 * @property {number} currentStepIndex - 1 based index of active step.
 * @property {number} currentIndex - 0 based index of active step.
 * @property {string} firstStepName - Name of first step item.
 * @property {string|Object} currentStepNode - The active step item.
 * @method isActive - Validate if step is active by name.
 * @method transitionTo - Activate step by name.
 * @method transitionToNext - Activate the next step.
 * @method transitionToPrevious - Activate the previous step.
 * @method activate - Set current step by name.
 * @method pickNext - Get the next available step item.
 * @method pickPrevious - Get the previous available step item.
 * @method incrementIndex - Increment the index.
 * @method getIndex - Get the 1 based index of the step by name.
 * @method init - Required by Alpine for automatic execution.
 */

/**
 * Callback function for building a step component.
 *
 * Usage Examples {@tutorial usage-tutorial}
 *
 * @param {string[]|Object[]} model - Step items.
 * @param {boolean} circular - Allow circular step indexing.
 * @param {string} initialStep - Name of step to start with.
 * @returns {StepsComponentData}
 */

const StepsComponent = (model = [], circular = false, initialStep) => ({
  steps: model,
  circular: circular,
  currentStep: initialStep ? initialStep : model[0].name || model[0],

  get length() {
    return this.steps.length;
  },

  get currentStepIndex() {
    return this.currentIndex + 1;
  },

  get currentIndex() {
    return this.steps.findIndex(step => {
      let name = step.name || step;
      return name === this.currentStep;
    });
  },

  get firstStepName() {
    const firstNode = this.steps[0];
    return firstNode.name || firstNode;
  },

  get currentStepNode() {
    return this.steps.find(stepNode => (stepNode.name || stepNode) === this.currentStep);
  },

  isActive(name) {
    return this.currentStep === name;
  },

  transitionTo(to) {
    const destination = to.name || to;

    if (destination && destination !== this.currentStep) {
      this.activate(destination);
    }

    return false;
  },

  transitionToNext() {
    const to = this.pickNext();
    return this.transitionTo(to);
  },

  transitionToPrevious() {
    const to = this.pickPrevious();
    return this.transitionTo(to);
  },

  activate(step) {
    const name = step.name || step;
    this.currentStep = name;
    return true;
  },

  pickNext() {
    const currentNode = this.steps[this.incrementIndex()];

    if (currentNode) {
      return currentNode.name || currentNode;
    }

    return false;
  },

  pickPrevious() {
    const currentNode = this.steps[this.incrementIndex(-1)];

    if (currentNode) {
      return currentNode.name || currentNode;
    }

    return false;
  },

  incrementIndex(increment = 1) {
    let l = this.length;
    let i = this.currentIndex + increment;

    if (this.circular) {
      i = (i % l + l) % l;
    }

    return i;
  },

  getIndex(nameQuery) {
    return this.steps.findIndex(step => {
      let name = step.name || step;
      return name === nameQuery;
    }) + 1;
  },

  init() {}

});

export { StepsComponent, StepsController };
//# sourceMappingURL=steps.esm.js.map
