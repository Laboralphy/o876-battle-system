/**
 * returns true if creature is from an good aligned specie
 * by default "good" species are Fey, Celestial
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 * @return {boolean}
 */
module.exports = (state, getters, externals) => {
    return externals['SPECIE_ALIGNMENT']['SPECIE_ALIGNMENT_GOOD'].includes(getters.getSpecie);
};
