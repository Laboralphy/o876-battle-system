const CONSTS = require('../consts')

/**
 *
 * @param property {RBSProperty}
 * @param item {RBSItem}
 * @param creature {Creature}
 * @param manager {Manager}
 */
function mutate ({ property, item, creature, manager }) {
    const effectProcessor = manager.effectProcessor
    const eHeal = effectProcessor.createEffect(CONSTS.EFFECT_HEAL, creature.dice.roll(property.amp))
    effectProcessor.applyEffect(eHeal, creature)
}

module.exports = {
    mutate
}