const { aggregateModifiers } = require('../../libs/aggregator');
const CONSTS = require('../../consts');
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../../libs/props-effects-filters')

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
 * Get the attack bonus if using melee weapon, including proficiency bonus
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {number}
 */
module.exports = (state, getters) => {
    const SLOT_MELEE = CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE

    // Weapon proficiency bonus
    const nProficiencyBonus = getters.isEquipmentProficient[SLOT_MELEE]
        ? getters.getProficiencyBonus
        : 0

    // Should we use dexterity instead of strength ?
    const bUseDexterity = isWeaponFinesse(getters.getEquipment[SLOT_MELEE]) && shouldUseDexterity(getters)

    // Weapon properties, and creature effects
    // Include defensive slots + melee weapon slot
    const aSlots = [
        ...getters.getDefensiveSlots,
        SLOT_MELEE
    ]
    const nWeaponAttackBonus = aggregateModifiers([
            CONSTS.PROPERTY_ATTACK_MODIFIER,
            CONSTS.EFFECT_ATTACK_MODIFIER
        ],
        getters,
        {
            effectFilter: filterMeleeAttackTypes,
            propFilter: filterMeleeAttackTypes,
            restrictSlots: aSlots
        }).sum
    const nAbilityBonus = getters.getAbilityModifiers[bUseDexterity ? CONSTS.ABILITY_DEXTERITY : CONSTS.ABILITY_STRENGTH]
    return nAbilityBonus + nProficiencyBonus + nWeaponAttackBonus
}
