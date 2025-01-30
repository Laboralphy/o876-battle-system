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
 *
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
    return {
        effect: oManager.applyEffect(eDam, oTarget, 0, oSource),
        saved: bSaved
    }
}

module.exports = {
    doDamage
}