const CONSTS = require('../../consts');


/**
 * Returns true if dexterity bonus is greater than strength bonus
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
function shouldUseDexterity (getters) {
    const mods = getters.getAbilityModifiers;
    const nStrMod = mods[CONSTS.ABILITY_STRENGTH];
    const nDexMod = mods[CONSTS.ABILITY_DEXTERITY];
    return nStrMod < nDexMod;
}


/**
 * returns true if specified weapon is a finesse weapon
 * @param oWeapon {RBSItem}
 * @returns {boolean}
 */
function isWeaponFinesse (oWeapon) {
    return oWeapon
        ? oWeapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_FINESSE)
        : false;
}

/**
 * Returns true if weapon is ranged
 * @param oWeapon {RBSItem}
 * @returns {boolean}
 */
function isWeaponRanged (oWeapon) {
    return oWeapon
        ? oWeapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
        : false;
}

/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Object<string, string>}
 */
module.exports = (state, getters) => {
    const bShouldIUseDex = shouldUseDexterity(getters);
    const getWeaponOffensiveAbility = (slot) => {
        const oWeapon = getters.getEquipment[slot];
        const bWeaponFinesse = isWeaponFinesse(oWeapon);
        const bWeaponRanged = isWeaponRanged(oWeapon);
        return ((bWeaponFinesse || bWeaponRanged) && bShouldIUseDex)
            ? CONSTS.ABILITY_DEXTERITY
            : CONSTS.ABILITY_STRENGTH;
    };
    return {
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: getWeaponOffensiveAbility(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE),
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: CONSTS.ABILITY_DEXTERITY,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: getWeaponOffensiveAbility(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1),
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: getWeaponOffensiveAbility(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2),
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: getWeaponOffensiveAbility(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3)
    };
};
