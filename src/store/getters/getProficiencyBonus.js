const { clamp } = require('../../libs/clamp');

/**
 * Return the proficiency bonus according to creature level
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 * @returns {number}
 */
module.exports = (state, getters, externals) => {
    const pb = externals['PROFICIENCY_BONUS'];
    return pb[clamp(getters.getLevel - 1, 0, pb.length - 1)];
};
