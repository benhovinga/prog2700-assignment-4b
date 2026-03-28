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
          throw new Error(`Invalid state '${state}'`);
        return state;
      };
      this.currentState = validateState(currentState);
      this.correctState = validateState(correctState);
      if (typeof canToggle !== 'boolean')
        throw new Error('Invalid canToggle parameter');
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
    
    /** Returns the level selector HTML element */
    const getElement = () => {return element;};

    /** Returns the currently selected level */
    const getLevel = () => {return element.value;};

    /** 
     * Set the game level
     * @param {string} value
     */
    const setLevel = (value) => {
      if (!value || typeof value !== 'string' || !LEVELS.includes(value))
        throw new Error(`Invalid level "${value}"`);
      element.value = value;
    }

    return {
      LEVELS,
      getElement,
      getLevel,
      setLevel
    };
  })();
})();
