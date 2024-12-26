const CONSTS = require('../../consts')

/**
 * Returns true if current weapon is two handed
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    return getters.getSelectedWeaponAttributeSet.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED)
}