const CONSTS = require('../../consts');
const { aggregateModifiers } = require('../../libs/aggregator');
const { filterMeleeAttackTypes } = require('../../libs/props-effects-filters');

function getSlotAttackBonus (sSlot, getters) {
    const sAbility = getters.getAttackAbility[sSlot];

    // Weapon proficiency bonus
    const nProficiencyBonus = getters.isEquipmentProficient[sSlot]
        ? getters.getProficiencyBonus
        : 0;

    // Weapon properties, and creature effects
    // Include defensive slots + melee weapon slot
    const aSlots = [
        ...getters.getDefensiveSlots,
        sSlot
    ];
    const nWeaponAttackBonus = aggregateModifiers([
        CONSTS.PROPERTY_ATTACK_MODIFIER,
        CONSTS.EFFECT_ATTACK_MODIFIER
    ],
    getters,
    {
        effectFilter: filterMeleeAttackTypes,
        propFilter: filterMeleeAttackTypes,
        restrictSlots: aSlots
    }).sum;
    const nAbilityBonus = getters.getAbilityModifiers[sAbility];
    return nAbilityBonus + nProficiencyBonus + nWeaponAttackBonus;
}

/**
 * Returns the attack bonus of the selected action
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Object<string, number>}
 */
module.exports = (state, getters) => {
    const eq = getters.getEquipment;
    return {
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: getSlotAttackBonus(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE, getters),
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: getSlotAttackBonus(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED, getters),
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: eq[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]
            ? getSlotAttackBonus(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1, getters)
            : 0,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: eq[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]
            ? getSlotAttackBonus(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2, getters)
            : 0,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: eq[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]
            ? getSlotAttackBonus(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3, getters)
            : 0,
    };
};
