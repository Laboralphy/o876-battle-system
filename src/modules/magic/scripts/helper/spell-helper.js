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

function castDirectDamageSpell ({
    spell,
    manager,
    caster,
    target,
    amount,
    damageType,
    savingThrowAbility = '',
    attack = false,
    savingFactor = 1,
    onHit = null,
}) {
    const sSpellCastAbility = caster.classTypeData.spellCastingAbility;
    let nDamage = caster.dice.roll(amount);
    if (savingThrowAbility) {
        manager.checkConst.ability(savingThrowAbility);
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
        const ao = manager.deliverSpellAttack(caster, target, {
            spell,
            damage: amount,
            damageType,
        });
        if (ao.hit) {
            if (typeof onHit === 'function') {
                onHit(ao);
            }
            ao.applyDamages();
        }
        return ao.hit;
    } else {
        if (nDamage > 0) {
            const eDamage = manager.createEffect(manager.CONSTS.EFFECT_DAMAGE, nDamage, { damageType });
            manager.applySpellEffectGroup(spell, [eDamage], target, 0, caster);
            return true;
        } else {
            return false;
        }
    }
}

module.exports = {
    getCantripDamageDice,
    castDirectDamageSpell
};
