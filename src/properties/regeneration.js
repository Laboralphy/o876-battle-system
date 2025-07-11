const CONSTS = require('../consts');

/**
 *
 * @param property {RBSProperty}
 * @param damageTypeVulnerabilities {string[]} if creature is damaged by one of this damage types, the regeneration is
 * @param threshold {number} regen is active only when current hp is lower than `threshold * maxHP`
 * shut down until damage amount is soaked down by regeneration
 */
function init ({ property, damageTypeVulnerabilities = [], threshold = 1, useConstitutionModifier = false }) {
    property.data.vulnerabilities = damageTypeVulnerabilities;
    property.data.shutdown = 0; // use internally to deals with regend stopped because of vulnerabilities
    property.data.threshold = threshold;
    property.data.useConstitutionModifier = useConstitutionModifier;
}

/**
 *
 * @param property {RBSProperty}
 * @param item {RBSItem}
 * @param creature {Creature}
 * @param effectProcessor {EffectProcessor}
 */
function mutate ({ manager, property, item, creature }) {
    if (creature.getters.isDead) {
        return;
    }
    const amount = creature.dice.roll(property.amp) +
        (property.data.useConstitutionModifier ? creature.getters.getAbilityModifiers[CONSTS.ABILITY_CONSTITUTION] : 0);
    if (property.data.shutdown === 0) {
        if (creature.hitPoints < (property.data.threshold * creature.getters.getMaxHitPoints)) {
            const eHeal = manager.effectProcessor.createEffect(CONSTS.EFFECT_HEAL, amount);
            manager.effectProcessor.applyEffect(eHeal, creature);
        }
    } else {
        property.data.shutdown = Math.max(0, property.data.shutdown - amount);
    }
}

function damaged ({ property, damageType, amount, resisted, creature, source }) {
    if (amount > 0 && property.data.vulnerabilities.includes(damageType)) {
        property.data.shutdown += amount;
    }
}

module.exports = {
    init,
    mutate,
    damaged
};
