const CONSTS = require('../consts');

/**
 *
 * @param property {RBSProperty}
 * @param damageTypeVulnerabilities {string[]} if creature is damaged by one of this damage types, the regeneration is
 * shut down until damage amount is soaked down by regeneration
 */
function init ({ property, damageTypeVulnerabilities = [] }) {
    property.data.vulnerabilities = damageTypeVulnerabilities;
    property.data.shutdown = 0;
}

/**
 *
 * @param property {RBSProperty}
 * @param item {RBSItem}
 * @param creature {Creature}
 * @param manager {Manager}
 */
function mutate ({ property, item, creature, manager }) {
    if (creature.getters.isDead) {
        return;
    }
    const amount = creature.dice.roll(property.amp);
    if (property.data.shutdown === 0) {
        if (creature.hitPoints < creature.getters.getMaxHitPoints) {
            const effectProcessor = manager.effectProcessor;
            const eHeal = effectProcessor.createEffect(CONSTS.EFFECT_HEAL, amount);
            effectProcessor.applyEffect(eHeal, creature);
        }
    } else {
        property.data.shutdown = Math.max(0, property.data.shutdown - amount);
    }
}

function damaged ({ property, damageType, amount, resisted, manager, creature, source }) {
    if (amount > 0 && property.data.vulnerabilities.includes(damageType)) {
        property.data.shutdown += amount;
    }
}

module.exports = {
    init,
    mutate,
    damaged
};
