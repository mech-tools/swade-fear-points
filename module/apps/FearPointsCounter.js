import { SETTINGS } from "../settings/settings";
import { CONSTANTS } from "../shared/constants";

/**
 * Get the per scene setting
 * @returns {boolean} per scene setting
 */
export const perScenePointsSetting = () => {
  return game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PER_SCENE);
};

/**
 * Get the current fear points
 * @returns {integer} current fear points
 */
export const getFearPoints = () => {
  return perScenePointsSetting()
    ? game.canvas.scene.getFlag(CONSTANTS.MODULE_NAME, SETTINGS.GLOBAL_POINTS) ?? 0
    : game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.GLOBAL_POINTS);
};

/**
 * Get the current fear points per ruling
 * @returns {integer} current fear points
 */
export const getFearPointsPerRuling = () => {
  const errata2023 = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.ERRATA_2023);

  return errata2023 ? Math.ceil(getFearPoints() / 2) : getFearPoints();
};

/**
 * Set a new value for the fear point setting
 * @param {integer} points the new points
 */
export const setFearPoints = async (points) => {
  perScenePointsSetting()
    ? await game.canvas.scene.setFlag(CONSTANTS.MODULE_NAME, SETTINGS.GLOBAL_POINTS, points)
    : await game.settings.set(CONSTANTS.MODULE_NAME, SETTINGS.GLOBAL_POINTS, points);
};

/**
 * Increment the fear points counter by 1
 */
export const incrementFearPoint = async () => {
  const fearPoints = getFearPoints();
  const newFearPoints = fearPoints + 1;

  await setFearPoints(newFearPoints);
};

/**
 * Decrement the fear points counter by 1 (minimum: 0)
 */
export const decrementFearPoint = async () => {
  const fearPoints = getFearPoints();
  const newFearPoints = Math.max(fearPoints - 1, 0);

  await setFearPoints(newFearPoints);
};

/**
 * Fear points counter application
 */
export class FearPointsCounter extends Application {
  /**
   * Create and store an instance
   */
  static initialize() {
    this.fearPointsDisplay = new FearPointsCounter();
  }

  /**
   * Update the current instance
   */
  static update() {
    this.fearPointsDisplay.update();
  }

  /**
   * Render the current instance
   */
  static render() {
    this.fearPointsDisplay.render(true);
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "swade-fear-points-display",
      template: `${CONSTANTS.PATH}templates/fear-points-counter.hbs`,
      top: 100,
      left: 120,
      height: 150,
      resizable: false,
      popout: false,
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.window-title`),
      background: "none"
    });
  }

  /** @override */
  constructor() {
    super();
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    const rawHtml = html[0];

    const plusButton = rawHtml.querySelector(".fear-plus-button");
    if (plusButton) plusButton.addEventListener("click", incrementFearPoint);

    const minusButton = rawHtml.querySelector(".fear-minus-button");
    if (minusButton) minusButton.addEventListener("click", decrementFearPoint);
  }

  /** @override */
  getData() {
    return {
      fearPoints: getFearPoints(),
      isGm: game.user.isGM
    };
  }

  /** @override */
  update() {
    if (this.rendered) {
      this.render(true);
    }
  }
}
