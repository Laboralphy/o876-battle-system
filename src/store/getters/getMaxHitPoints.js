const CONSTS = require('../../consts');
const { aggregateModifiers } = require('../../libs/aggregator');

/**
 * returns the amount of maximum hit points a character may have
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {{}}
 * @returns {number}
 */
module.exports = (state, getters, externals) => {
    const hd = (state.hitDie / 2) + 0.5;
    const nExtraHitPoints = aggregateModifiers([
        CONSTS.PROPERTY_EXTRA_HITPOINTS
    ], getters).sum;
    const nLevel = getters.getLevel;
    return Math.max(1, Math.floor(nLevel * hd) + nExtraHitPoints);
};
