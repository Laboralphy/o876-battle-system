const CONSTS = require('../../consts')

/**
 * Returns true if ranged weapon is equipped and is loaded with the correct ammo type
 * Returns true if equipped ranged weapon does'n need ammo
 * return false if no ranged weapon is equipped, or if ranged weapon is not loaded with correct ammo
 * @param state {RBSStoreState}
 * @returns {boolean}
 */
module.exports = (state) => {
    const weapon = state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
    if (!weapon) {
        return false
    }
    if (weapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)) {
        const sAmmoType = weapon.ammoType
        const oAmmo = state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO]
        return !!oAmmo && (oAmmo.ammoType === sAmmoType)
    } else {
        return true
    }
}