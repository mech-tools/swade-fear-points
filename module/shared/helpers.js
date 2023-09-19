import { CONSTANTS } from "./constants";

/**
 * Preprend logged message with the module title
 * @param {string} msg Message to print
 */
export const logger = (msg) => {
  console.log(`${CONSTANTS.MODULE_TITLE} | ${msg}`);
};

/**
 * Debounce call before reloading page
 */
export const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 500);
