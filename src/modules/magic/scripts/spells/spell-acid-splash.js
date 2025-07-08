const { getCantripDamageDice, createSpellDirectDamageEffect } = require('../helper/spell-helper');

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 */
function main ({ manager, caster, target }) {
    // compute 1d6 acid damage (+1d6 at levels 5, 11, 17)
    const nCasterLevel = manager.getCreatureLevel(caster);
    const sDamage = getCantripDamageDice(6, nCasterLevel);
    // Checks if dexterity saving throw is success
    const eDamage = createSpellDirectDamageEffect({
        manager,
        caster,
        target,
        amount: sDamage,
        damageType: manager.CONSTS.DAMAGE_TYPE_ACID,
        savingThrowAbility: manager.CONSTS.ABILITY_DEXTERITY,
        savingFactor: 0
    });
    if (eDamage) {
        manager.applySpellEffectGroup('spell-acid-splash', [eDamage], target, 0, caster);
    }
}

module.exports = main;
