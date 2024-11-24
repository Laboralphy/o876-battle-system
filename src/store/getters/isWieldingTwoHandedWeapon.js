const CONSTS = require('../../consts')

/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    return Boolean(oWeapon && oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED))
}