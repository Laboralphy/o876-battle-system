const { getCantripDamageDice, castDirectDamageSpell } = require('../helper/spell-helper');
const {getAreaOfEffectTargets} = require('../../../../libs/helpers');

/*
You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other.
A target must succeed on a Dexterity saving throw or take 1d6 acid damage.

This spell’s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).
 */

/**
 * Splashes a target with acid damage
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 */
function splash (manager, caster, target) {
    const nCasterLevel = manager.getCreatureLevel(caster);
    const sDamage = getCantripDamageDice(6, nCasterLevel);
    // Checks if dexterity saving throw is success
    castDirectDamageSpell({
        manager,
        caster,
        target,
        damage: sDamage,
        damageType: manager.CONSTS.DAMAGE_TYPE_ACID,
        savingThrowAbility: manager.CONSTS.ABILITY_DEXTERITY,
        damageMitigation: 0
    });
}

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 * @param spell {RBSSpellData}
 */
function main ({ manager, caster, target, spell }) {
    // get all caster's offenders
    // filter creatures by distance
    const aAdditionalOffenders = getAreaOfEffectTargets(manager, caster, target, spell.range, 2);
    const oAdditionalTarget = aAdditionalOffenders[1] ?? null;
    splash(manager, caster, target);
    if (oAdditionalTarget) {
        splash(manager, caster, oAdditionalTarget);
    }
}

module.exports = main;
