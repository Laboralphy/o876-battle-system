const CONSTS = require('../../consts');
const { aggregateModifiers } = require('../../libs/aggregator');
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../../libs/props-effects-filters');

/**
 *
 * @param x {{ sum: number }|undefined}
 * @returns {number}
 */
function getSumOr0 (x) {
    if (x === undefined) {
        return 0;
    }
    if (!('sum' in x)) {
        throw new TypeError('parameter missing properties "sum"');
    }
    return x.sum;
}

/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {{}}
 * @returns {Object<string, number>}
 */
module.exports = (state, getters, externals) => {
    const eq = state.equipment;
    const capa = getters.getCapabilitySet;

    // Defenses like shield and reflexes can only be used when creature is able to act and see
    const bCanActAndSee = capa.has(CONSTS.CAPABILITY_ACT) && capa.has(CONSTS.CAPABILITY_SEE);

    // **** Natural armor **** Natural armor **** Natural armor **** Natural armor **** Natural armor ****
    // **** Natural armor **** Natural armor **** Natural armor **** Natural armor **** Natural armor ****
    // **** Natural armor **** Natural armor **** Natural armor **** Natural armor **** Natural armor ****
    // **** Natural armor **** Natural armor **** Natural armor **** Natural armor **** Natural armor ****

    const nACNaturalArmorClass = state.naturalArmorClass;

    // **** Shield **** Shield **** Shield **** Shield **** Shield **** Shield **** Shield ****
    // **** Shield **** Shield **** Shield **** Shield **** Shield **** Shield **** Shield ****
    // **** Shield **** Shield **** Shield **** Shield **** Shield **** Shield **** Shield ****
    // **** Shield **** Shield **** Shield **** Shield **** Shield **** Shield **** Shield ****

    const oShield = getters.isWieldingTwoHandedWeapon
        ? null
        : eq[CONSTS.EQUIPMENT_SLOT_SHIELD];
    const nACShieldBaseBonus = oShield ? oShield.blueprint.ac : 0;

    const { sum: nACShieldPropRangedBonus} = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: filterRangedAttackTypes,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD],
        excludeInnate: true
    });

    const { sum: nACShieldPropMeleeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: filterMeleeAttackTypes,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD],
        excludeInnate: true
    });

    const { sorter: oACShieldDamageTypeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: prop => prop.data.damageType !== undefined,
        propSorter: prop => prop.data.damageType,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD],
        excludeInnate: true
    });

    // **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor ****
    // **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor ****
    // **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor ****
    // **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor **** Armor ****

    const oArmor = eq[CONSTS.EQUIPMENT_SLOT_CHEST];
    const nMaxDexterityBonus = getters.getPropertySet.has(CONSTS.PROPERTY_MAX_DEXTERITY_BONUS)
        ? aggregateModifiers([
            CONSTS.PROPERTY_MAX_DEXTERITY_BONUS
        ], getters).min
        : Infinity;
    const nACArmorBaseBonus = oArmor ? oArmor.blueprint.ac : 0;

    const { sum: nACArmorPropRangedBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: filterRangedAttackTypes,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_CHEST],
        excludeInnate: true
    });

    const { sum: nACArmorPropMeleeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: filterMeleeAttackTypes,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_CHEST],
        excludeInnate: true
    });

    const { sorter: oACArmorDamageTypeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: prop => prop.data.damageType !== undefined,
        propSorter: prop => prop.data.damageType,
        restrictSlots: [CONSTS.EQUIPMENT_SLOT_CHEST],
        excludeInnate: true
    });

    // **** Dexterity **** Dexterity **** Dexterity **** Dexterity **** Dexterity **** Dexterity ****
    // **** Dexterity **** Dexterity **** Dexterity **** Dexterity **** Dexterity **** Dexterity ****
    // **** Dexterity **** Dexterity **** Dexterity **** Dexterity **** Dexterity **** Dexterity ****
    // **** Dexterity **** Dexterity **** Dexterity **** Dexterity **** Dexterity **** Dexterity ****

    const nACDexBonus = bCanActAndSee
        ? Math.min(nMaxDexterityBonus, getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY])
        : 0;

    // **** Gears & Weapon *** Gears & Weapon *** Gears & Weapon *** Gears & Weapon *** Gears & Weapon ***
    // **** Gears & Weapon *** Gears & Weapon *** Gears & Weapon *** Gears & Weapon *** Gears & Weapon ***
    // **** Gears & Weapon *** Gears & Weapon *** Gears & Weapon *** Gears & Weapon *** Gears & Weapon ***
    // **** Gears & Weapon *** Gears & Weapon *** Gears & Weapon *** Gears & Weapon *** Gears & Weapon ***

    const aGearSlots = [
        CONSTS.EQUIPMENT_SLOT_HEAD,
        CONSTS.EQUIPMENT_SLOT_NECK,
        CONSTS.EQUIPMENT_SLOT_BACK,
        CONSTS.EQUIPMENT_SLOT_ARMS,
        CONSTS.EQUIPMENT_SLOT_FINGER_LEFT,
        CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT,
        CONSTS.EQUIPMENT_SLOT_WAIST,
        CONSTS.EQUIPMENT_SLOT_FEET,
        ...getters.getOffensiveSlots
    ];

    const { sum: nACGearMeleeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        CONSTS.EFFECT_ARMOR_CLASS_MODIFIER
    ], getters, {
        effectFilter: filterMeleeAttackTypes,
        propFilter: filterMeleeAttackTypes,
        restrictSlots: aGearSlots
    });

    const { sum: nACGearRangedBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        CONSTS.EFFECT_ARMOR_CLASS_MODIFIER
    ], getters, {
        effectFilter: filterRangedAttackTypes,
        propFilter: filterRangedAttackTypes,
        restrictSlots: aGearSlots
    });

    const { sorter: oACGearDamageTypeBonus } = aggregateModifiers([
        CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER
    ], getters, {
        propFilter: prop => prop.data.damageType !== undefined,
        propSorter: prop => prop.data.damageType,
        restrictSlots: aGearSlots
    });

    // **** Results **** Results **** Results **** Results **** Results **** Results **** Results ****
    // **** Results **** Results **** Results **** Results **** Results **** Results **** Results ****
    // **** Results **** Results **** Results **** Results **** Results **** Results **** Results ****
    // **** Results **** Results **** Results **** Results **** Results **** Results **** Results ****

    const nBaseArmorClass = externals.VARIABLES.BASE_ARMOR_CLASS + nACDexBonus;
    const nACArmorMeleeBonus = nACArmorBaseBonus + nACArmorPropMeleeBonus + nACGearMeleeBonus;
    const nACArmorRangedBonus = nACArmorBaseBonus + nACArmorPropRangedBonus + nACGearRangedBonus;
    const nACShieldMeleeBonus = nACShieldBaseBonus + nACShieldPropMeleeBonus;
    const nACShieldRangedBonus = nACShieldBaseBonus + nACShieldPropRangedBonus;
    const nSlashingDamageBonus =
        getSumOr0(oACShieldDamageTypeBonus[CONSTS.DAMAGE_TYPE_SLASHING]) +
        getSumOr0(oACArmorDamageTypeBonus[CONSTS.DAMAGE_TYPE_SLASHING]) +
        getSumOr0(oACGearDamageTypeBonus[CONSTS.DAMAGE_TYPE_SLASHING]);
    const nCrushingDamageBonus =
        getSumOr0(oACShieldDamageTypeBonus[CONSTS.DAMAGE_TYPE_CRUSHING]) +
        getSumOr0(oACArmorDamageTypeBonus[CONSTS.DAMAGE_TYPE_CRUSHING]) +
        getSumOr0(oACGearDamageTypeBonus[CONSTS.DAMAGE_TYPE_CRUSHING]);
    const nPiercingDamageBonus =
        getSumOr0(oACShieldDamageTypeBonus[CONSTS.DAMAGE_TYPE_PIERCING]) +
        getSumOr0(oACArmorDamageTypeBonus[CONSTS.DAMAGE_TYPE_PIERCING]) +
        getSumOr0(oACGearDamageTypeBonus[CONSTS.DAMAGE_TYPE_PIERCING]);

    return {
        [CONSTS.ATTACK_TYPE_MELEE]: nBaseArmorClass + nACNaturalArmorClass + nACArmorMeleeBonus + nACShieldMeleeBonus,
        [CONSTS.ATTACK_TYPE_RANGED]: nBaseArmorClass + nACNaturalArmorClass + nACArmorRangedBonus + nACShieldRangedBonus,
        [CONSTS.DAMAGE_TYPE_SLASHING]: nSlashingDamageBonus,
        [CONSTS.DAMAGE_TYPE_CRUSHING]: nCrushingDamageBonus,
        [CONSTS.DAMAGE_TYPE_PIERCING]: nPiercingDamageBonus
    };
};
