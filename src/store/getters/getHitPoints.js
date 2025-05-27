const CONSTS = require('../../consts');

/**
 * Returns the current hit points
 * @param state {*}
 * @returns {number}
 */
module.exports = state => state.pools[CONSTS.POOL_HITPOINTS];
