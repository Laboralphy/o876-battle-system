const { getCantripDamageDice, castDirectDamageSpell } = require('../helper/spell-helper');

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 * @param spell {{}}
 */
function main ({ manager, caster, target, spell }) {
    // compute 1d8 withering damage (+1d8 at levels 5, 11, 17)
    const nCasterLevel = manager.getCreatureLevel(caster);
    const sDamage = getCantripDamageDice(10, nCasterLevel);
    // Checks if dexterity saving throw is success
    castDirectDamageSpell({
        spell: spell.id,
        manager,
        caster,
        target,
        amount: sDamage,
        damageType: manager.CONSTS.DAMAGE_TYPE_WITHERING,
        attack: true,
        onHit: attackOutcome => {
            attackOutcome.pushEffect(manager.createEffect(manager.CONSTS.EFFECT_HEALING_FACTOR, 0, {}));
        }
    });
}

module.exports = main;
