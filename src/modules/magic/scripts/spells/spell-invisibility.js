/*
A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible
as long as it is on the target’s person. The spell ends for a target that attacks or casts a spell.
*/

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 * @param spell {RBSSpellData}
 * @param power {number}
 * @param additionalTargets {Creature[]}
 */
function main ({ manager, caster, target, spell, power, additionalTargets }) {
    const aTargets = [target, ...additionalTargets.slice(0, power)];
    const cs = manager.createConcentrationSpell(spell.id, caster, manager.convertTimeToTurns(1));
    aTargets.forEach(t => {
        cs.applyEffects([
            manager.createEffect(manager.CONSTS.EFFECT_INVISIBILITY)
        ], t);
    });
    cs.commit();
}

module.exports = main;
