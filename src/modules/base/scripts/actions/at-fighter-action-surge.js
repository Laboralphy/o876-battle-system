const {doHeal} = require('../../../../libs/helpers');

/**
 * Action Surge - fighter feat
 *
 * This action will allow one extra attack immediately (should be used with cool down).
 *
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 */
function main ({ manager, action, creature }) {
    doHeal(manager, creature, creature, creature.dice.roll('1d10') + creature.getters.getLevel);
}

module.exports = main;
