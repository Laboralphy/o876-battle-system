const CONSTS = require('../consts');

/**
 * @param spell {string}
 * @param effect {RBSEffect}
 * @param effects {{id: string, target: string}[]} list of effects applied to other creature
 * and that should be ended as well
 */
function init ({ effect, spell, effects = [] }) {
    if (effects.length === 0) {
        throw new Error('Malformed concentration effect : need at least one effect');
    }
    if (effects.some(e => !e.id || !e.target)) {
        throw new Error('Malformed concentration effect : some effect have no id/target');
    }
    effect.data.spell = spell;
    effect.data.effects = effects;
}

/**
 * Try to shutdown effect that are not applied on creature
 * @param effect {RBSEffect}
 * @param effectProcessor {EffectProcessor}
 */
function dispose ({ effect, effectProcessor }) {
    effect.data.effects.forEach(({ id, target }) => {
        const oTarget = effectProcessor.horde.getCreature(target);
        if (oTarget) {
            const oEffect =  oTarget.getters.getEffectRegistry[id];
            if (oEffect) {
                effectProcessor.removeEffect(oEffect);
            }
        }
    });
}

/**
 *
 * @param effect {RBSEffect}
 * @param effectProcessor {EffectProcessor}
 * @param amount {number}
 * @param creature {Creature}
 */
function damaged ({ effect, effectProcessor, amount, creature }) {
    // compute difficulty
    const dc = Math.max(10, Math.floor(amount / 2));
    // roll saving throw
    const st = creature.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, dc);
    if (!st.success) {
        // break concentration
        effectProcessor.removeEffect(effect);
    }
}

/**
 * If another concentration spell is on, dispel it
 * @param effect {RBSEffect}
 * @param effectProcessor {EffectProcessor}
 * @param target {Creature}
 */
function apply ({ effect, effectProcessor, target }) {
    target
        .getters
        .getEffects
        .filter(eff => eff.type === CONSTS.EFFECT_CONCENTRATION)
        .forEach(eff => {
            effectProcessor.removeEffect(eff);
        });
}

module.exports = {
    init,
    dispose,
    damaged,
    apply
};
