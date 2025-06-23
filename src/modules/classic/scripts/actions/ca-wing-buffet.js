const { doDamage, getAreaOfEffectTargets} = require('../../../../libs/helpers');

/**
 * Wing buffet
 * A wing attack that deals damage to all offender.
 * If target fails saving throw it will be stunned until the end of the turn
 *
 * combat dependencies :
 * -attacker
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param CONSTS {*}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    const { range } = action;
    getAreaOfEffectTargets(manager, creature, target, range).forEach(offender => {
        const { savingThrow: success } = doDamage(manager, offender, creature, {
            amount: action.parameters.amount,
            damageType: manager.CONSTS.DAMAGE_TYPE_CRUSHING,
            offensiveAbility: manager.CONSTS.ABILITY_STRENGTH,
            defensiveAbility: manager.CONSTS.ABILITY_STRENGTH,
            extraordinary: true
        });
        if (!success) {
            const eStun = manager.createEffect(manager.CONSTS.EFFECT_STUN);
            manager.applyEffect(eStun, offender, 1, creature);
        }
    });
}


module.exports = main;
