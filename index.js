(async function () {
  class Cell {
    /**
     * Individual cell of the puzzle
     * @param {number} currentState
     * @param {number} correctState
     * @param {boolean} canToggle
     */
    constructor(currentState, correctState, canToggle) {
      const validateState = (state) => {
        if (typeof state !== 'number' || !Number.isInteger(state) || state < 0 || state > 2)
          throw new TypeError(`Invalid state '${state}'`);
        return state;
      };
      this.currentState = validateState(currentState);
      this.correctState = validateState(correctState);
      if (typeof canToggle !== 'boolean')
        throw new TypeError('Invalid canToggle parameter');
      this.canToggle = canToggle;
    }
  }


  /** 
   * Game level object
   */
  const gameLevel = (() => {
    /** All supported levels */
    const LEVELS = Object.freeze([
      '6x6',
      '8x8',
      '10x10',
      '12x12',
      '14x14',
      'sample',
      'random',
    ]);

    /** The level selector HTML element on the page. */
    const element = document.getElementById('gameLevelSelect');
    if (!element || !(element instanceof HTMLSelectElement))
      throw new Error("Fatal Error: Unable to find select element with id 'gameLevelSelect'.");
    
    /** 
     * Returns the level selector HTML element
     * 
     * @returns {HTMLSelectElement}
     */
    const getElement = () => element;

    /**
     * Check if the provided level is a valid level.
     * 
     * @param {string} level 
     * @returns {boolean}
     */
    const isLevelValid = (level) => typeof value === 'string' && LEVELS.includes(value);

    /** 
     * Returns the currently selected level 
     * 
     * @returns {string}
     */
    const getLevel = () => element.value;

    /** 
     * Set the game level
     * 
     * @param {string} value
     */
    const setLevel = (value) => {
      if (!isLevelValid(value))
        throw new TypeError(`Invalid level "${value}"`);
      element.value = value;
    }

    return {
      LEVELS,
      getElement,
      getLevel,
      setLevel,
      isLevelValid,
    };
  })();


  /**
   * Makes a request to the API to get a new puzzle.
   * @param {string} level 
   * @returns {Cell[][]}
   */
  const fetchNewPuzzle = async (level) => {
    const API_BASE = "https://prog2700.onrender.com/threeinarow/";

    // Ensure provided level is valid
    if (!gameLevel.isLevelValid(level))
      throw new TypeError(`Invalid level '${level}'.`);

    // Make the fetch request
    const response = await fetch(API_BASE + level);
    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);

    // Parse the json
    const json = await response.json();

    return Array(...json['rows']).map((row) => {
      return Array(...row).map((cell) => {
        return new Cell(cell['currentState'], cell['correctState'], cell['canToggle']);
      });
    });
  };
})();
