import { OldFilmFilter } from "@pixi/filter-old-film";
import { FearPointsCounter, getFearPointsPerRuling } from "../apps/FearPointsCounter";
import { SETTINGS } from "../settings/settings";
import { CONSTANTS } from "../shared/constants";

/**
 * Update the counter when the global fear points are updated
 */
export const updateGlobalFearPoints = () => {
  const perScenePoints = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PER_SCENE);
  if (perScenePoints) return;

  // When canvas is ready (e.g: change scene)
  Hooks.on("canvasReady", () => {
    updateEnvironmentFilters();
  });

  // When global settings are modified (e.g: fear points setting)
  Hooks.on("updateSetting", (setting) => {
    if (setting.key !== `${CONSTANTS.MODULE_NAME}.${SETTINGS.GLOBAL_POINTS}`) return;

    FearPointsCounter.update();
    updateEnvironmentFilters();
  });
};

/**
 * Update the counter when the per scene fear points are updated
 */
export const updatePerSceneFearPoints = () => {
  const perScenePoints = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PER_SCENE);
  if (!perScenePoints) return;

  // When canvas is ready (e.g: change scene)
  Hooks.on("canvasReady", () => {
    FearPointsCounter.update();
    updateEnvironmentFilters();
  });

  // When scene is updated (e.g: fear points flag)
  Hooks.on("updateScene", (scene, diff) => {
    if (
      !foundry.utils.hasProperty(diff, `flags.${CONSTANTS.MODULE_NAME}.${SETTINGS.GLOBAL_POINTS}`)
    )
      return;

    FearPointsCounter.update();
    if (scene.id === game.canvas.scene.id) updateEnvironmentFilters();
  });
};

/** Vignette filter */
let vignetteFilter = undefined;

/**
 * Update the environment filters with a vignette filter
 */
const updateEnvironmentFilters = () => {
  if (!game.canvas.scene) return;

  const vignetteEffect = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.VIGNETTE_EFFECT);
  if (!vignetteEffect) return;

  if (!vignetteFilter) createVignetteFilter();

  const environmentFilters = canvas.environment.filters.filter(
    (f) => f.id !== CONSTANTS.MODULE_NAME
  );

  updateVignetteFilter();

  environmentFilters.push(vignetteFilter);
  canvas.environment.filters = environmentFilters;
};

/**
 * Create the vignette filter with defaults
 */
const createVignetteFilter = () => {
  vignetteFilter = new OldFilmFilter({
    id: CONSTANTS.MODULE_NAME,
    sepia: 0,
    noise: 0,
    noiseSize: 0,
    scratch: 0,
    scratchDensity: 0,
    scratchWidth: 1,
    vignetting: 0,
    vignettingAlpha: 0,
    vignettingBlur: 0.3
  });

  canvas.app.ticker.add(() => (vignetteFilter.seed = Math.random()));
};

/**
 * Update the vignette filter depending on the current fear points
 */
const updateVignetteFilter = () => {
  const fearPoints = Math.min(getFearPointsPerRuling(), 6);

  vignetteFilter = foundry.utils.mergeObject(vignetteFilter, {
    noise: fearPoints > 4 ? 0.1 : 0,
    noiseSize: fearPoints > 4 ? 0.1 : 0,
    scratch: fearPoints > 2 ? 0.2 : 0,
    scratchDensity: fearPoints > 2 ? 0.2 : 0,
    vignetting:
      (game.canvas.scene.dimensions.width - game.canvas.scene.width) /
        game.canvas.scene.dimensions.width /
        2 +
      0.3,
    vignettingAlpha: 0 + fearPoints * 0.15
  });
};
