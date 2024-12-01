const CONSTS = require('../../consts')

/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    return !!oWeapon
        ? oWeapon.blueprint.proficiency.includes(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED)
        : false
}