/**
 * returns true if creature is from an evil specie
 * by default, evil species are : undead, aberration, fiend
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 * @return {boolean}
 */
module.exports = (state, getters, externals) => {
    return externals['SPECIE_ALIGNMENT']['SPECIE_ALIGNMENT_EVIL'].includes(getters.getSpecie);
};
