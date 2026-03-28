(async function () {
  const LOG_DEBUG = true;

  /**
   * Creates a console logging function with log level highlighting.
   * 
   * @param {"log" | "error" | "warn" | "info" | "debug"} logLevel 
   *  Log levels available on the `console` object.
   * @param {boolean} enabled 
   *  Turn console output on or off. Best used with environment variables.
   * @returns {(...args: any[]) => void}
   * @author Benjamin P.C. Hovinga
   * @license MIT
   */
  function createLogger(logLevel = "log", enabled = true) {
      // Define console colors for each log level
      const colors = {
          "log": "\x1b[30m", // BLACK
          "error": "\x1b[31m", // RED
          "warn": "\x1b[33m", // YELLOW
          "info": "\x1b[36m", // CYAN
          "debug": "\x1b[35m", // MAGENTA
      };
      const reset = "\x1b[0m";  // RESET COLOR

      // Validate logLevel
      if (!colors.hasOwnProperty(logLevel))
          throw TypeError(`${logLevel} is not a valid logLevel.`);

      // Build prefix string
      const prefix = `${colors[logLevel]}[${logLevel.toUpperCase()}]${reset}`;

      // Return logger function
      return function (...args) {
          if (enabled) console[logLevel](prefix, ...args);
      }
  }

  // Create console loggers
  const debug = createLogger("debug", LOG_DEBUG);
  const info = createLogger("info");
  const error = createLogger("error");


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
      debug("Level selector element:", this.selectorElement);

      // Make sure the level selectors value is in sync with the current level
      this.currentLevel = this.selectorElement.value;
      debug("Initial level:", this.currentLevel);

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
