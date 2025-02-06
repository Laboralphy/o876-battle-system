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
 *
 * @return {{ effect: RBSEffect, saved: boolean }}
 */
function doDamage (oManager, oTarget, oSource, {
    amount,
    damageType,
    offensiveAbility = '',
    defensiveAbility = '',
}) {
    let bSaved = false
    if (offensiveAbility) {
        const dc = oSource.getters.getSpellDifficultyClass[offensiveAbility]
        const oSavingThrow = oTarget.rollSavingThrow(defensiveAbility, dc)
        bSaved = oSavingThrow.success
    }
    const nFullDamage = oTarget.dice.roll(amount)
    const nDamage = bSaved ? Math.floor(nFullDamage / 2) : nFullDamage
    const eDam = oManager.createEffect(CONSTS.EFFECT_DAMAGE, nDamage, { damageType })
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

module.exports = {
    doDamage,
    getWeaponRange
}
