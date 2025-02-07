const CONSTS = require('../../consts')

/**
 * Do damage to creature with a saving throw allowed for half damage
 * @param oManager {Manager}
 * @param oTarget {Creature}
 * @param oSource {Creature}
 * @param amount {string|number}
 * @param damageType {string}
 * @param offensiveAbility {string}
 * @param defensiveAbility {string}
 * @param extraordinary {boolean}
 *
 * @return {{ effect: RBSEffect, saved: boolean }}
 */
function doDamage (oManager, oTarget, oSource, {
    amount,
    damageType,
    offensiveAbility = '',
    defensiveAbility = '',
    extraordinary = false
}) {
    let bSaved = false
    if (offensiveAbility) {
        const dc = oSource.getters.getSpellDifficultyClass[offensiveAbility]
        const oSavingThrow = oTarget.rollSavingThrow(defensiveAbility, dc)
        bSaved = oSavingThrow.success
    }
    const nFullDamage = oTarget.dice.roll(amount)
    const nDamage = bSaved ? Math.floor(nFullDamage / 2) : nFullDamage
    const eDam = oManager.createEffect(CONSTS.EFFECT_DAMAGE, nDamage, {
        damageType,
        subtype: extraordinary ? oManager.CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY : oManager.CONSTS.EFFECT_SUBTYPE_MAGICAL
    })
    const effect = oManager.applyEffect(eDam, oTarget, 0, oSource)
    return {
        effect,
        saved: bSaved
    }
}

/**
 * Returns the specified weapon range
 * @param weapon {RBSItem}
 * @param DATA {*}
 * @returns {number}
 */
function getWeaponRange (weapon, DATA) {
    if (!weapon) {
        return -1
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
 * Returns the best damage type. The one who will do the most damage.
 * @param aDamageTypes {string[]}
 * @param oMitigation {{ [damageType: string]: { factor: number } }}
 * @returns {string|undefined} DAMAGE_TYPE_*
 */
function getBestDamageTypeVsMitigation (aDamageTypes, oMitigation) {
    if (aDamageTypes.length === 0) {
        throw new Error('DamageType Array must have at least one item')
    }
    return aDamageTypes
        .map(dt => {
            if (dt in oMitigation) {
                return { damageType: dt, factor: oMitigation[dt].factor }
            } else {
                return { damageType: dt, factor: 1 }
            }
        })
        .sort(({ factor: a }, { factor: b }) => b - a)
        .map(({ damageType }) => damageType)
        .shift() ?? aDamageTypes[0]
}

/**
 * Returns the damage type against to most efficient AC
 * @param aDamageTypes {string[]}
 * @param oArmorClasses {{ [damageType: string]: number }}
 * @returns {string}
 */
function getWorstDamageTypeVsAC (aDamageTypes, oArmorClasses) {
    if (aDamageTypes.length === 0) {
        throw new Error('DamageType Array must have at least one item')
    }
    return aDamageTypes
        .filter(dt => dt in oArmorClasses)
        .map(dt => ({ damageType: dt, ac: oArmorClasses[dt] }))
        .sort(({ ac: a }, { ac: b }) => b - a)
        .map(({ damageType }) => damageType)
        .shift() ?? aDamageTypes[0]
}

/**
 * This function extract all damage types from a weapon
 * @param weapon {RBSItem}
 */
function getWeaponDamageTypes (weapon) {
    const aTypes = new Set(weapon.blueprint.damageType)
    weapon.properties.forEach((prop) => {
        if (prop.type === CONSTS.PROPERTY_EXTRA_WEAPON_DAMAGE_TYPE) {
            aTypes.add(prop.data.damageType)
        }
    })
    return [...aTypes]
}

module.exports = {
    doDamage,
    getWeaponRange,
    getBestDamageTypeVsMitigation,
    getWorstDamageTypeVsAC
}
