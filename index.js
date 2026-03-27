(function () {
  class LevelController {
    allLevels = Object.freeze([
      '6x6',
      '8x8',
      '10x10',
      '12x12',
      '14x14',
      'sample',
      'random',
    ]);
    /** @type {String} */
    #currentLevel = this.allLevels[0];  // Default to first level

    constructor() {
      this.selectorElement = document.getElementById('gameLevelSelect');
      if (!this.selectorElement)
        throw new Error("Missing HTML element 'gameLevelSelect'");

      this.setCurrentLevel(this.selectorElement.value);
      this.selectorElement.addEventListener('change', this.onLevelChange);
    }

    getCurrentLevel() {
      return this.#currentLevel;
    }

    /** @param {String} value  */
    setCurrentLevel(value) {
      if (!value || typeof value !== 'string' || !this.allLevels.includes(value))
        throw new Error(`Invalid level value "${value}"`);
      this.#currentLevel = value;
    }

    onLevelChange(event) {
      this.setCurrentLevel(event.target.value);
    }
  }

  const Level = new LevelController();

})();
