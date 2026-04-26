/**
 * Lab manual variant 5 — thin wrappers around `Math`.
 * @param {number} a
 * @returns {number}
 */
export const round = (a) => Math.round(a);

/**
 * @param {number} a
 * @returns {number}
 */
export const trunc = (a) => Math.trunc(a);

/**
 * @returns {number} Pseudo-random number in [0, 1).
 */
export const random = () => Math.random();
