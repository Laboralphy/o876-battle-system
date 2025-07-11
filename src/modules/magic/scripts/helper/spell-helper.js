const {CONSTS} = require('../../../../../index');

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

function _castDirectDamageSpellSavingThrow ({
    spell,
    manager,
    caster,
    target,
    damage,
    damageType,
    savingThrowAbility = '',
    damageMitigation = 0,
    threat = []
}) {
    const sSpellCastAbility = caster.classTypeData.spellCastingAbility;
    let nDamage = caster.dice.roll(damage);
    manager.checkConst.ability(savingThrowAbility);
    const dc = caster.getters.getSpellDifficultyClass[sSpellCastAbility];
    const { success } = target.rollSavingThrow(savingThrowAbility, dc, { threat: [
        damageType,
        manager.CONSTS.THREAT_TYPE_SPELL,
        ...threat
    ]});
    if (success) {
        nDamage = Math.ceil(damageMitigation * nDamage);
    }
    if (nDamage > 0) {
        const eDamage = manager.createEffect(manager.CONSTS.EFFECT_DAMAGE, nDamage, { damageType });
        manager.applySpellEffectGroup(spell, [eDamage], target, 0, caster);
        return true;
    } else {
        return false;
    }
}

function _castDirectDamageSpellRangedAttack ({
    spell,
    manager,
    caster,
    target,
    damage,
    damageType
}) {
    const nDamage = caster.dice.roll(damage);
    const ao = manager.deliverSpellAttack(caster, target, {
        spell,
        damage,
        damageType,
    });
    return ao.hit;
}

function castDirectDamageSpell ({
    spell,
    manager,
    caster,
    target,
    damage,
    damageType,
    savingThrowAbility = '',
    threat = [],
    attack = false,
    damageMitigation = 0
}) {
    if (savingThrowAbility) {
        return _castDirectDamageSpellSavingThrow({
            spell,
            manager,
            caster,
            target,
            damage,
            damageType,
            savingThrowAbility,
            threat,
            damageMitigation
        });
    } else if (attack) {
        return _castDirectDamageSpellRangedAttack({
            spell,
            manager,
            caster,
            target,
            damage,
            damageType
        });
    } else {
        throw new Error('either `savingThrowAbility` or `attack: true` must be specified');
    }
}

module.exports = {
    getCantripDamageDice,
    castDirectDamageSpell
};
