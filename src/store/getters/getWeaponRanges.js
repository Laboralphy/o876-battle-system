const CONSTS = require("../../consts");

/**
 * Returns the specified weapon range
 * @param weapon {RBSItem}
 * @param DATA {*}
 * @returns {number}
 */
function getWeaponRange (weapon, DATA) {
    if (!weapon) {
        return 0
    }
    const wa = weapon.blueprint.attributes
    const wr = DATA['WEAPON_RANGES']
    if (wa.includes(CONSTS.WEAPON_ATTRIBUTE_REACH)) {
        return wr['WEAPON_RANGE_REACH'].range
    } else if (wa.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
        return wr['WEAPON_RANGE_RANGED'].range
    } else {
        return wr['WEAPON_RANGE_MELEE'].range
    }
}

/**
 * Return, for each equipped weapon, its range (0 when ranged wepaon is not equipped)
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 */
module.exports = (state, getters, externals) => {
    const eq = getters.getEquipment
    const oMeleeWeapon = eq[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
    const oRangedWeapon = eq[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
    const nDefaultMeleeRange = externals['WEAPON_RANGES']['WEAPON_RANGE_MELEE'].range
    const nMeleeRange = Math.max(nDefaultMeleeRange, getWeaponRange(oMeleeWeapon, externals))
    const nRangedRange = (oRangedWeapon && getters.isRangedWeaponLoaded) ? getWeaponRange(oRangedWeapon, externals) : 0
    return {
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: nMeleeRange,
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: nRangedRange
    }
}