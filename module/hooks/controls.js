import { FearPointsCounter } from "../apps/FearPointsCounter";
import { SETTINGS } from "../settings/settings";
import { CONSTANTS } from "../shared/constants";

/**
 * Add the fear points control display button to the token controls
 */
export const addFearPointsControl = () => {
  // When controls are rendered (e.g: token controls)
  Hooks.on("getSceneControlButtons", (controls) => {
    const playerVisibility = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_VISIBILITY);
    if (!playerVisibility && !game.user.isGM) return;

    let group = controls.find((b) => b.name == "token");
    group.tools.push({
      name: "fear-points",
      title: `${CONSTANTS.MODULE_NAME}.control-button-title`,
      icon: "fa-solid fa-face-scream",
      button: true,
      onClick: () => {
        FearPointsCounter.render();
      }
    });
  });
};
