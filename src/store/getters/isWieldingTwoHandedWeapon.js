const CONSTS = require('../../consts')

/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getEquipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
    return !!oWeapon
        ? oWeapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED)
        : false
}