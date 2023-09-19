import { FearPointsCounter } from "../apps/FearPointsCounter";
import { SETTINGS } from "../settings/settings";
import { CONSTANTS } from "../shared/constants";

/**
 * Open up the fear points counter window at startup
 */
export const openAtStartup = () => {
  const openAtStartup = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.OPEN_AT_STARTUP);
  if (!openAtStartup) return;

  // When fvtt is ready
  Hooks.once("ready", () => {
    if (!game.canvas.scene) return;

    const playerVisibility = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_VISIBILITY);
    if (!playerVisibility && !game.user.isGM) return;

    FearPointsCounter.render();
  });
};
