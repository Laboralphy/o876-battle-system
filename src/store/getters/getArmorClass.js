const CONSTS = require('../../consts')
const { aggregateModifiers } = require('../../libs/aggregator')
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../../libs/filters')

/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Object<string, number>}
 */
module.exports = (state, getters) => {
    const eq = getters.getEquipment
    const capa = getters.getCapabilitySet

    // Defenses like shield and reflexes can only be used when creature is able to act and see
    const bCanActAndSee = capa.has(CONSTS.CAPABILITY_ACT) && capa.has(CONSTS.CAPABILITY_SEE)

    // Natural armor
    const nACNaturalArmorClass = state.naturalArmorClass

    // Dexterity
    const nACDexBonus = bCanActAndSee ? getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY] : 0

    // Shield
    const oShield = getters.isWieldingTwoHandedWeapon
        ? null
        : eq[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const nACShieldBaseBonus = oShield ? oShield.blueprint.ac : 0

    const { sum: nACShieldPropRangedBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: filterRangedAttackTypes,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD],
        excludeInnate: true
    })

    const { sum: nACShieldPropMeleeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: filterMeleeAttackTypes,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD],
        excludeInnate: true
    })

    // Armor
    const { sum: nACArmorPropRangedBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: filterRangedAttackTypes,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_CHEST],
        excludeInnate: true
    })

    const { sum: nACArmorPropMeleeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: filterMeleeAttackTypes,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_CHEST],
        excludeInnate: true
    })

    const oArmor = eq[CONSTS.EQUIPMENT_SLOT_CHEST]
    const nACArmorBaseBonus = oArmor ? oArmor.blueprint.ac : 0

    const { sum: nACGearRangedBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        CONSTS.EFFECT_ARMOR_CLASS_MODIFIER
    ], getters, {
        effectFilter: filterRangedAttackTypes,
        propFilter: filterRangedAttackTypes,
        restrictSlots: [
            CONSTS.EQUIPMENT_SLOT_HEAD,
            CONSTS.EQUIPMENT_SLOT_NECK,
            CONSTS.EQUIPMENT_SLOT_BACK,
            CONSTS.EQUIPMENT_SLOT_ARMS,
            getters.getOffensiveSlot,
            CONSTS.EQUIPMENT_SLOT_FINGER_LEFT,
            CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT,
            CONSTS.EQUIPMENT_SLOT_AMMO,
            CONSTS.EQUIPMENT_SLOT_WAIST,
            CONSTS.EQUIPMENT_SLOT_FEET
        ]
    })

    const { sum: nACGearMeleeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        CONSTS.EFFECT_ARMOR_CLASS_MODIFIER
    ], getters, {
        effectFilter: filterRangedAttackTypes,
        propFilter: filterRangedAttackTypes,
        restrictSlots: [
            CONSTS.EQUIPMENT_SLOT_HEAD,
            CONSTS.EQUIPMENT_SLOT_NECK,
            CONSTS.EQUIPMENT_SLOT_BACK,
            CONSTS.EQUIPMENT_SLOT_ARMS,
            getters.getOffensiveSlot,
            CONSTS.EQUIPMENT_SLOT_FINGER_LEFT,
            CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT,
            CONSTS.EQUIPMENT_SLOT_AMMO,
            CONSTS.EQUIPMENT_SLOT_WAIST,
            CONSTS.EQUIPMENT_SLOT_FEET
        ]
    })

    const nBaseArmorClass = 10 + nACDexBonus
    const nACArmorMeleeBonus = nACArmorBaseBonus + nACArmorPropMeleeBonus
    const nACArmorRangedBonus = nACArmorBaseBonus + nACArmorPropRangedBonus
    const nACShieldMeleeBonus = nACShieldBaseBonus + nACShieldPropMeleeBonus
    const nACShieldRangedBonus = nACShieldBaseBonus + nACShieldPropRangedBonus
    return {
        [CONSTS.ATTACK_TYPE_MELEE]: nBaseArmorClass + nACNaturalArmorClass + nACArmorMeleeBonus + nACShieldMeleeBonus,
        [CONSTS.ATTACK_TYPE_MELEE_TOUCH]: nBaseArmorClass + nACGearMeleeBonus,
        [CONSTS.ATTACK_TYPE_RANGED]: nBaseArmorClass + nACNaturalArmorClass + nACArmorRangedBonus + nACShieldRangedBonus,
        [CONSTS.ATTACK_TYPE_RANGED_TOUCH]: nBaseArmorClass + nACGearRangedBonus,
    }
}

