import { FearPointsCounter } from "../apps/FearPointsCounter";
import { SETTINGS } from "../settings/settings";
import { CONSTANTS } from "../shared/constants";

/**
 * Open up the fear points counter window at startup
 */
export const openAtStartup = () => {
  // When fvtt is ready
  Hooks.once("ready", () => {
    const playerVisibility = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_VISIBILITY);
    if (!playerVisibility && !game.user.isGM) return;
    if (!game.canvas.scene) return;

    FearPointsCounter.render();
  });
};
