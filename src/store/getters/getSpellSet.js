/**
 * Retuns a Set of learned spells
 * @param state {RBSStoreState}
 * @returns {Set<string>}
 */
module.exports = state => new Set(state.spells);
