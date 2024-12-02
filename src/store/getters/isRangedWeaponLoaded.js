const CONSTS = require('../../consts')

/**
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const weapon = state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
    if (!weapon) {
        return false
    }
    if (weapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)) {
        const sAmmoType = weapon.ammoType
        const oAmmo = state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO]
        return !!oAmmo && (oAmmo.ammoType === sAmmoType)
    } else {
        return true
    }
}