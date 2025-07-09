/**
 * Returns a dice expression for a cantrip damage
 * @param nDieFaceCount {number}
 * @param nLevel {number}
 * @returns {string}
 */
function getCantripDamageDice (nDieFaceCount, nLevel) {
    let nDamage = 1;
    if (nLevel >= 5) {
        ++nDamage;
    }
    if (nLevel >= 11) {
        ++nDamage;
    }
    if (nLevel >= 17) {
        ++nDamage;
    }
    return nDamage.toString() + 'd' + nDieFaceCount.toString();
}

function createSpellDirectDamageEffect ({
    manager,
    caster,
    target,
    amount,
    damageType,
    savingThrowAbility = '',
    attack = false,
    savingFactor = 1
}) {
    manager.checkConst.ability(savingThrowAbility);
    const sSpellCastAbility = manager.getCreatureSpellCastingAbility(caster);
    let nDamage = caster.dice.roll(amount);
    if (savingThrowAbility) {
        const dc = caster.getters.getSpellDifficultyClass[sSpellCastAbility];
        const { success } = target.rollSavingThrow(savingThrowAbility, dc, { threat: [
            damageType,
            manager.CONSTS.THREAT_TYPE_SPELL
        ]});
        if (success) {
            nDamage = Math.ceil(savingFactor * nDamage);
        }
    }
    if (attack) {
        const ao = manager.deliverAttack(caster, target, { virtualAttack: true });
        if (!ao.hit) {

        }
    }
    return nDamage > 0
        ? manager.createEffect(manager.CONSTS.EFFECT_DAMAGE, nDamage, { damageType })
        : null;
}

module.exports = {
    getCantripDamageDice,
    createSpellDirectDamageEffect
};
