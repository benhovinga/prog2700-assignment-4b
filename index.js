(async function () {
  class Level {
    /** All possible game levels */
    static LEVELS = Object.freeze([
      '6x6',
      '8x8',
      '10x10',
      '12x12',
      '14x14',
      'sample',
      'random',
    ]);

    /** @type {HTMLSelectElement} */
    selectorElement;

    /** @type {String} */
    #currentLevel = Level.LEVELS[0];  // Default to first level

    constructor() {
      // Get and validate the level selector element
      this.selectorElement = document.getElementById('gameLevelSelect');
      if (!this.selectorElement || !(this.selectorElement instanceof HTMLSelectElement))
        throw new Error("Missing HTML select element 'gameLevelSelect'");

      // Make sure the level selectors value is in sync with the current level
      this.currentLevel = this.selectorElement.value;

      // Add onChange event listener to the level selector
      this.selectorElement.addEventListener('change', (e) => {this.onChange(e);});
    }

    /**
     * Validates the level is in the levels list.
     * @param {string} level 
     */
    static isLevelValid(level) {
      return typeof level === 'string' && Level.LEVELS.includes(level);
    }

    /** Get the current level. */
    get currentLevel() {
      return this.#currentLevel;
    }

    /** 
     * Set the current level to a new level.
     * 
     * @param {String} value
     */
     set currentLevel(value) {
      if (!Level.isLevelValid(value))
        throw new Error(`Invalid level "${value}"`);
      this.#currentLevel = value;
    }

    /** 
     * Change event listener for the level selector.
     * @param {Event} event
     */
    onChange(event) {
      if(!event.target || !(event.target instanceof HTMLSelectElement))
        throw new Error("Event target must be instance of HTMLSelectElement");
      // TODO: Load the puzzle from the API

      // TODO: Redraw the game board
      // Update the current level
      this.currentLevel = event.target.value;
      info("New level selected:", this.currentLevel);
    }
  }
  const gameLevel = new Level();
})();
