const CONSTS = require('../../consts');
const { aggregateModifiers } = require('../../libs/aggregator');
/**
 * Return the creature level
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {number}
 */
module.exports = (state, getters) => Math.max(1, state.level - aggregateModifiers([
    CONSTS.EFFECT_NEGATIVE_LEVEL
], getters).sum);
