const CONSTS = require('../../consts');

/**
 * Return current hit points
 * @param state {RBSStoreState}
 * @returns {boolean}
 */
module.exports = state => state.pools[CONSTS.POOL_HITPOINTS] <= 0;
