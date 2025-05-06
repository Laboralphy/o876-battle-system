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
    const hd = getters.getAbilityModifiers[CONSTS.ABILITY_CONSTITUTION] + (state.hitDie / 2) + 1;
    const nExtraHitPoints = aggregateModifiers([
        CONSTS.PROPERTY_EXTRA_HITPOINTS
    ], getters).sum;
    const nLevel = getters.getLevel;
    return Math.floor(nLevel * Math.max(1, hd)) + nExtraHitPoints;
};
