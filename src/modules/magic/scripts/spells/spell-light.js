/*
A small orb of light appears above caster's head
 */

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 * @param spell {RBSSpellData}
 */
function main ({ manager, caster, target, spell }) {
    const eLight = manager.createEffect(manager.CONSTS.EFFECT_LIGHT);
    manager.applySpellEffectGroup(spell.id, [eLight], caster, manager.convertTimeToTurns(1));
}

module.exports = main;
