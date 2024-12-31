const CONSTS = require("../../consts");


/**
 * Returns true if dexterity bonus is greater than strength bonus
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
function shouldUseDexterity (getters) {
    const mods = getters.getAbilityModifiers
    const nStrMod = mods[CONSTS.ABILITY_STRENGTH]
    const nDexMod = mods[CONSTS.ABILITY_DEXTERITY]
    return nStrMod < nDexMod
}


/**
 * returns true if specified weapon is a finesse weapon
 * @param oWeapon {RBSItem}
 * @returns {boolean}
 */
function isWeaponFinesse (oWeapon) {
    return oWeapon
        ? oWeapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_FINESSE)
        : true // bare hand is weapon finesse
}

/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {{[p: string]: string}}
 */
module.exports = (state, getters) => {
    const SLOT_MELEE = CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
    const sMeleeAbility = (isWeaponFinesse(getters.getEquipment[SLOT_MELEE]) && shouldUseDexterity(getters))
        ? CONSTS.ABILITY_DEXTERITY
        : CONSTS.ABILITY_STRENGTH
    const sRangedAbility = CONSTS.ABILITY_DEXTERITY
    return {
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: sMeleeAbility,
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: sRangedAbility
    }
}