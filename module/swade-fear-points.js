import { FearPointsCounter } from "./apps/FearPointsCounter";
import {
  addFearPointsControl,
  alterSpiritAttributeRolls,
  openAtStartup,
  updateGlobalFearPoints,
  updatePerSceneFearPoints
} from "./hooks";
import { registerSettings } from "./settings/settings";
import { logger } from "./shared/helpers";

/**
 * Starting point of the module
 */
new (class SwadeFearPoints {
  /**
   * Init all the proper components on init
   */
  constructor() {
    // Init module
    this.init();
  }

  /**
   * Init module and settings
   */
  init() {
    Hooks.once("init", () => {
      logger("Initializing module");

      // Register settings
      registerSettings();

      // Init fear points counter
      FearPointsCounter.initialize();

      // Hooks
      openAtStartup();
      addFearPointsControl();
      updateGlobalFearPoints();
      updatePerSceneFearPoints();
      alterSpiritAttributeRolls();
    });
  }
})();
