const { aggregateModifiers } = require('../../libs/aggregator');
const CONSTS = require('../../consts');
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../../libs/props-effects-filters')

/**
 * Get the attack bonus if using melee weapon, including proficiency bonus
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {number}
 */
module.exports = (state, getters) => {
    const SLOT_MELEE = CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
    const sAbility = getters.getAttackAbility[SLOT_MELEE]

    // Weapon proficiency bonus
    const nProficiencyBonus = getters.isEquipmentProficient[SLOT_MELEE]
        ? getters.getProficiencyBonus
        : 0

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
    const nAbilityBonus = getters.getAbilityModifiers[sAbility]
    return nAbilityBonus + nProficiencyBonus + nWeaponAttackBonus
}
