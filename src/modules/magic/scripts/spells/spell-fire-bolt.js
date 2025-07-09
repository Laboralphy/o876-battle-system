const { getCantripDamageDice, createSpellDirectDamageEffect } = require('../helper/spell-helper');

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 */
function main ({ manager, caster, target }) {
    // compute 1d10 acid damage (+1d10 at levels 5, 11, 17)
    const nCasterLevel = manager.getCreatureLevel(caster);
    const sDamage = getCantripDamageDice(10, nCasterLevel);
    // Checks if dexterity saving throw is success
    const eDamage = createSpellDirectDamageEffect({
        manager,
        caster,
        target,
        amount: sDamage,
        damageType: manager.CONSTS.DAMAGE_TYPE_FIRE,
        attack: true
    });
    if (eDamage) {
        manager.applySpellEffectGroup('spell-fire-bolt', [eDamage], target, 0, caster);
    }
}

module.exports = main;
