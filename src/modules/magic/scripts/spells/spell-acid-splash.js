const { getCantripDamageDice, castDirectDamageSpell } = require('../helper/spell-helper');

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
        amount: sDamage,
        damageType: manager.CONSTS.DAMAGE_TYPE_ACID,
        savingThrowAbility: manager.CONSTS.ABILITY_DEXTERITY,
        savingFactor: 0
    });
}

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 * @param spellData {{}}
 */
function main ({ manager, caster, target }) {
    // what is target distance
    const nTargetDistance = manager.getCreatureDistance(caster, target);

    // get all caster's offenders
    // filter creatures by distance
    const aAdditionalOffenders = manager
        .getTargetingCreatures(caster)
        // exclude primary target
        .filter(offender => offender !== target)
        // offender => [offender, distance to primary target]
        .map((offender) => [
            offender,
            Math.abs(nTargetDistance - manager.getCreatureDistance(caster, offender))
        ])
        // sort by distance to primary target
        .sort(([, distance1], [, distance2]) => distance1 - distance2)
        .filter(([, distance]) => {
            return distance <= 5;
        })
        .map(([offender]) => offender);

    // pick the closest additional target
    const oAdditionalTarget = aAdditionalOffenders.length > 0
        ? aAdditionalOffenders[0]
        : null;

    splash(manager, caster, target);
    if (oAdditionalTarget) {
        splash(manager, caster, oAdditionalTarget);
    }
}

module.exports = main;
