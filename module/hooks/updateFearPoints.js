import { FearPointsCounter } from "../apps/FearPointsCounter";
import { SETTINGS } from "../settings/settings";
import { CONSTANTS } from "../shared/constants";

/**
 * Update the counter when the global fear points are updated
 */
export const updateGlobalFearPoints = () => {
  // When global settings are modified (e.g: fear points setting)
  Hooks.on("updateSetting", (setting) => {
    const perScenePoints = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PER_SCENE);
    if (perScenePoints) return;
    if (setting.key !== `${CONSTANTS.MODULE_NAME}.${SETTINGS.GLOBAL_POINTS}`) return;

    FearPointsCounter.update();
  });
};

/**
 * Update the counter when the per scene fear points are updated
 */
export const updatePerSceneFearPoints = () => {
  // When canvas is ready (e.g: change scene)
  Hooks.on("canvasReady", () => {
    const perScenePoints = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PER_SCENE);
    if (!perScenePoints) return;

    FearPointsCounter.update();
  });

  // When scene is updated (e.g: fear points flag)
  Hooks.on("updateScene", (scene, diff) => {
    const perScenePoints = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PER_SCENE);
    if (!perScenePoints) return;
    if (
      !foundry.utils.hasProperty(diff, `flags.${CONSTANTS.MODULE_NAME}.${SETTINGS.GLOBAL_POINTS}`)
    )
      return;

    FearPointsCounter.update();
  });
};
