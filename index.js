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

  class GridCell {
    /** @type {number} */
    #currentState;
    /** @type {number} */
    #correctState;
    /** @type {boolean} */
    #isLocked;
    /** @type {HTMLButtonElement} */
    #buttonElement;

    /**
     * Represents a single cell on the grid
     * 
     * @param {number} initState 
     * @param {number} correctState 
     * @param {boolean} isLocked 
     */
    constructor(initState, correctState, isLocked) {
      // Validate and set the initial state property
      if (!GridCell.isStateValid(initState))
        throw new Error(`Invalid state '${initState}'.`);
      this.#currentState = initState;

      // Validate and set the correct state property
      if (!GridCell.isStateValid(correctState))
        throw new Error(`Invalid state '${correctState}'.`);
      this.#correctState = correctState;

      // Validate and set the locked property
      if (typeof isLocked !== 'boolean')
        throw new Error(`isLocked must be a boolean.`);
      this.#isLocked = isLocked;

      // Create the cell button property
      this.#buttonElement = this.#createNewButtonElement();
    }

    /** 
     * Validates if the provided state is an integer and between 0-2 (inclusive).
     * 
     * @param {number} state 
     */
    static isStateValid(state) {
      return Number.isInteger(state) && state >= 0 && state <= 2;
    }

    /** Get the current state of the cell. */
    getState() {
      return this.#currentState;
    }

    /** 
     * Set a new state on the cell. Silently fails if the cell is locked. 
     * 
     * @param {number} state 
     */
    setState(state) {
      if (!GridCell.isStateValid(state))
        throw new Error(`Invalid state '${state}'`);
      if (!this.#isLocked)
        this.#currentState = state;
    }

    /** Get the expected correct state of the cell. */
    getCorrectState() {
      return this.#correctState;
    }

    /** Check if the cell is locked. */
    isLocked() {
      return this.#isLocked;
    }

    /** Check if the current state is correct. */
    isCorrect() {
      return this.getState() === this.getCorrectState();
    }

    /** Gets the button HTML element for this cell. */
    getButtonElement() {
      return this.#buttonElement;
    }

    /** Creates a new button HTML element for the cell. */
    #createNewButtonElement() {
      // TODO: Add style to button element
      const element = document.createElement("button");
      element.value = this.getState();
      element.addEventListener('click', (e) => {this.onClick(e);});
      return element;
    }

    /** 
     * Click event listener added to the cell button.
     * 
     * @param {PointerEvent} event 
     */
    onClick(event) {
      if (!this.isLocked()) {
        // TODO: Change state
      }
    }
  }

  class Puzzle {
    #gameGridElement;

    constructor(level, rows) {
      this.level = level;
    }

    static API_BASE = "https://prog2700.onrender.com/threeinarow/";

    static async #fetchJSON(url) {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
      return await response.json();
    }

    static async new(level) {
      if (!Level.isLevelValid(level))
        throw new Error("potato");
    }
  }

  const gameLevel = new Level();
})();
