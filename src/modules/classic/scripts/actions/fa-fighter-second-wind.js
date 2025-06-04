const {doHeal} = require('../../../../libs/helpers');

/**
 * Second wind - fighter feat
 *
 * This action heals creature 1d10 + fighter level
 * This action can be used outside combat.
 *
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 */
function main ({ manager, action, creature }) {
    doHeal(manager, creature, creature, creature.dice.roll('1d10') + creature.getters.getLevel);
}

module.exports = main;
