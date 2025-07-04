const { doDamage } = require('../../../../libs/helpers');

/**
 * Draining Kiss
 * Will do damage to a stunned creature, the damage dealt will heal the source,
 * This is a supernatural effect.
 *
 * combat dependencies :
 * - attacker
 * - target
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param action.parameters.amount {number|string} amount of damage done by the attack
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    if (target.getters.getEffectSet.has(manager.CONSTS.EFFECT_STUN)) {
        const { effect } = doDamage(manager, target, creature, {
            amount: creature.dice.roll(action.parameters.amount) + creature.getters.getAbilityModifiers[manager.CONSTS.ABILITY_CHARISMA],
            damageType: manager.CONSTS.DAMAGE_TYPE_PSYCHIC,
            offensiveAbility: manager.CONSTS.ABILITY_CHARISMA,
            defensiveAbility: manager.CONSTS.ABILITY_CONSTITUTION,
            extraordinary: true
        });
        if (effect.data.appliedAmount > 0) {
            const eHeal = manager.createSupernaturalEffect(manager.CONSTS.EFFECT_HEAL, effect.data.appliedAmount);
            manager.applyEffect(eHeal, creature);
        }
    }
}

module.exports = main;
