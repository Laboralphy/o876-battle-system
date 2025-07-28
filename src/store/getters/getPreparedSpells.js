/**
 * Returns a list of prepared spells
 * @param state {RBSStoreState}
 * @returns {string[]}
 */
module.exports = state => Object
    .entries(state.spells)
    .filter(([, { prepared }]) => prepared)
    .map(([spell]) => spell);
