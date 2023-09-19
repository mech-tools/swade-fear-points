import { getFearPoints } from "../apps/FearPointsCounter";
import { SETTINGS } from "../settings/settings";
import { CONSTANTS } from "../shared/constants";

/**
 * Modify the spirit attributes depending on the current fear points (roll - fear points)
 */
export const alterSpiritAttributeRolls = () => {
  // Before a SWADE attribute roll (e.g: spirit)
  Hooks.on("swadePreRollAttribute", (actor, attribute, roll, modifiers) => {
    if (attribute !== "spirit") return;

    const fearPoints = getFearPoints();
    if (fearPoints < 1) return;

    const charactersOnly = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.CHARACTERS_ONLY);
    if (charactersOnly && actor.type !== "character") return;

    modifiers.push({
      label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.modifier-label`),
      value: `- ${fearPoints}`,
      ignore: false
    });
  });
};
