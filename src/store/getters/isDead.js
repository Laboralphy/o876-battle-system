/**
 * Return current hit points
 * @param state {RBSStoreState}
 * @returns {boolean}
 */
module.exports = state => state.pools.hitPoints <= 0;
