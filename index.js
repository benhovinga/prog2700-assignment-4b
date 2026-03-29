(async function () {
  class Cell {
    /**
     * Individual cell of the puzzle
     * @param {number} currentState
     * @param {number} correctState
     * @param {boolean} canToggle
     */
    constructor(currentState, correctState, canToggle) {
      this.currentState = Cell.validateState(currentState);
      this.correctState = Cell.validateState(correctState);
      if (typeof canToggle !== 'boolean')
        throw new TypeError('Invalid canToggle parameter');
      this.canToggle = canToggle;
      this.createButton();
    }

    createButton() {
      this.button = document.createElement('button');;
      this.button.classList.add('cell');
      this.button.cellObj = this;

      // Apply styles to the button
      this.updateButtonStyle();

      // Disable locked cells
      if (!this.canToggle) {
        this.button.disabled = true;
      }

      // On left click, cycle state forward
      this.button.addEventListener('click', () => {
        this.cycleCell();
      });

      // On right click, cycle state reversed
      this.button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (this.canToggle)
          this.cycleCellRev();
      });
    }

    updateButtonStyle() {
      this.button.innerHTML = Cell.stateToValue(this.currentState);
      if (this.currentState === 0) {
        this.button.classList.remove('cell-x', 'cell-o');
      } else if (this.currentState === 1) {
        this.button.classList.add('cell-x');
        this.button.classList.remove('cell-o');
      } else if (this.currentState === 2) {
        this.button.classList.add('cell-o');
        this.button.classList.remove('cell-x');
      }
    }

    cycleCell() {
      if (this.currentState < 2) this.currentState++;
      else this.currentState = 0;
      this.updateButtonStyle();
    }

    cycleCellRev() {
      if (this.currentState > 0) this.currentState--;
      else this.currentState = 2;
      this.updateButtonStyle();
    }

    isCorrect() {
      return this.currentState === this.correctState;
    }

    static validateState(state) {
      if (typeof state !== 'number' || !Number.isInteger(state) || state < 0 || state > 2)
        throw new TypeError(`Invalid state '${state}'`);
      return state;
    }

    static stateToValue(state) {
      if (state === 0)
        return "&nbsp;";
      else if (state === 1)
        return "X";
      else if (state === 2)
        return "O";
      throw new TypeError(`Invalid state '${state}'`);
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
    const isLevelValid = (level) => typeof level === 'string' && LEVELS.includes(level);

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
   * @returns {Promise<Cell[][]>}
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
    if (!Object.hasOwn(json, "rows"))
      throw new Error("API error! Response missing 'rows' property.");

    // Map the 2D array of cells from the API
    return Array(...json['rows']).map((row) => {
      return Array(...row).map((cell) => {
        return new Cell(cell['currentState'], cell['correctState'], cell['canToggle']);
      });
    });
  };


  const gridElement = document.getElementById('gameGrid');
  if (!gridElement || !(gridElement instanceof HTMLDivElement))
    throw new Error("Fatal Error: Unable to find element with id 'gameGrid'.");


  const loadNewGrid = async () => {
    // Load a new puzzle from the API
    const puzzle = await fetchNewPuzzle(gameLevel.getLevel());
    console.debug(puzzle);

    // Clear the grid element
    gridElement.innerHTML = "";

    // Create new table for the cells and add it to the grid element
    const tableElement = document.createElement('table');
    gridElement.appendChild(tableElement);

    puzzle.forEach((row) => {
      // Add row to table
      const rowElement = tableElement.insertRow(-1);

      row.forEach((cell) => {
        // Add cell to row
        const cellElement = rowElement.insertCell(-1);
        cellElement.appendChild(cell.button);
      });
    });
  }

  await loadNewGrid();

})();
