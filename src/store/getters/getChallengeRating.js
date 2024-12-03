const { aggregateModifiers } = require('../../libs/aggregator');
const CONSTS = require('../../consts');
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../../libs/props-effects-filters')


/**
 *
 * @param getters {RBSStoreGetters}
 * @param sSlot {string}
 * @returns {number}
 */
function getSlotProficiencyBonus (getters, sSlot) {
    const eq = getters.getEquipment
    // get the corresponding weapon
    const oWeapon = eq[sSlot]
    const ps = getters.getProficiencySet
    if (!oWeapon) {
        // No ranged weapon : return 0
        return ps.has(CONSTS.PROFICIENCY_WEAPON_NATURAL)
            ? getters.getProficiencyBonus
            : 0
    }
    // return proficiency bonus if creature is proficient with weapon bonus, else return 0
    return ps.has(oWeapon.blueprint.proficiency)
        ? getters.getProficiencyBonus
        : 0
}

/**
 * Returns true if weapon needs ammunition and correct ammo type is equipped
 * this function is used to determine if item in ammo slot may be used to consider attack modifier properties
 * @param getters {RBSStoreGetters}
 * @return {boolean}
 */
function isCorrectAmmoTypeEquipped (getters) {
    const eq = getters.getEquipment
    // get the corresponding weapon
    const oWeapon = eq[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
    if (!oWeapon) {
        // no weapon : exit
        return false
    }
    const aWeaponAttributes = new Set(oWeapon.blueprint.attributes)
    if (!aWeaponAttributes.has(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)) {
        // no need ammunition : do not include ammo slot
        return false
    }
    const oAmmo = eq[CONSTS.EQUIPMENT_SLOT_AMMO]
    return oWeapon.blueprint.ammoType === oAmmo.blueprint.ammoType
}

/**
 * Get the attack bonus if using ranged weapon, including proficiency bonus
 * @param getters {RBSStoreGetters}
 * @returns {number}
 */
function getRangedWeaponAttackBonus (getters) {
    // Weapon proficiency bonus
    const nProficiencyBonus = getSlotProficiencyBonus(getters, CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)

    // Weapon properties, and creature effects
    // Include defensive slots + ranged weapon slot
    const aSlots = [
        ...getters.getDefensiveSlots,
        CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
    ]
    if (isCorrectAmmoTypeEquipped(getters)) {
        aSlots.push(CONSTS.EQUIPMENT_SLOT_AMMO)
    }
    const nWeaponAttackBonus = aggregateModifiers([
            CONSTS.PROPERTY_ATTACK_MODIFIER,
            CONSTS.EFFECT_ATTACK_MODIFIER
        ],
        getters,
        {
            effectFilter: filterRangedAttackTypes,
            propFilter: filterRangedAttackTypes,
            restrictSlots: aSlots
        }).sum
    const nAbilityBonus = getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]
    return nAbilityBonus + nProficiencyBonus + nWeaponAttackBonus
}

function getMeleeWeaponAttackBonus (getters) {
    // Weapon proficiency bonus
    const nProficiencyBonus = getSlotProficiencyBonus(getters, CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)

    // Weapon properties, and creature effects
    // Include defensive slots + ranged weapon slot
    const aSlots = [
        ...getters.getDefensiveSlots,
        CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
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
    const nAbilityBonus = getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]
    return nAbilityBonus + nProficiencyBonus + nWeaponAttackBonus
}

module.exports = (state, getters) => {
    return {
        attack: {
            ranged: getRangedWeaponAttackBonus(getters),
            melee: getMeleeWeaponAttackBonus(getters)
        }
    }
}
