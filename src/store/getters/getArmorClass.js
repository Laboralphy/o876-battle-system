const CONSTS = require('../../consts')
const { aggregateModifiers } = require('../../libs/aggregator')
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../../libs/filters')

module.exports = (state, getters) => {
    const eq = getters.getEquipment
    const oArmor = eq[CONSTS.EQUIPMENT_SLOT_CHEST]
    const oShield = getters.isWieldingTwoHandedWeapon
        ? null
        : eq[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const naturalArmorClass = state.naturalArmorClass
    const { sum: nACBonusMelee } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        CONSTS.EFFECT_ARMOR_CLASS_MODIFIER
    ], getters, {
        effectFilter: filterMeleeAttackTypes,
        propFilter: filterMeleeAttackTypes
    })
    const { sum: nACBonusRanged } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        CONSTS.EFFECT_ARMOR_CLASS_MODIFIER
    ], getters, {
        effectFilter: filterRangedAttackTypes,
        propFilter: filterRangedAttackTypes
    })
    // If cannot act or see : no dexterity bonus and no shield bonus ; equipment armor steel count
    const bCanActAndSee = getters.getCapabilities.act && getters.getCapabilities.see
    const nACDexBonus = bCanActAndSee ? getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY] : 0
    const nACArmorBonus = oArmor?.ac || 0
    const nACShieldBonus = bCanActAndSee ? (oShield?.ac || 0) : 0
    const nEquipmentAC = naturalArmorClass + nACDexBonus + nACArmorBonus + nACShieldBonus
    return {
        natural: naturalArmorClass,
        equipment: nEquipmentAC,
        melee: nEquipmentAC + nACBonusMelee,
        ranged: nEquipmentAC + nACBonusRanged,
        details: {
            shield: nACShieldBonus,
            armor: nACArmorBonus,
            dexterity: nACDexBonus
        }
    }
}