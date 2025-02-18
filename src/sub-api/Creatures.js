const Abstract = require('./ServiceAbstract');
const Creature = require('../Creature');
const BoxedAction = require('./classes/BoxedAction');
const BoxedCreature = require('./classes/BoxedCreature');

class Creatures extends Abstract {
    /**
     * Returns true if the specified entity id refers to a creature, not an item
     * @param oEntity
     * @returns {boolean}
     */
    isCreature (oEntity) {
        return oEntity instanceof BoxedCreature;
    }

    /**
     * Returns a creature ability modifier
     * @param oCreature {BoxedCreature}
     * @param sAbility {string} ABILITY_*
     * @returns {number}
     */
    getAbilityModifier (oCreature, sAbility) {
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getAbilityModifiers[this.services.core.checkConst(sAbility, this.services.core.PREFIXES.ABILITY)];
    }

    /**
     * Returns a creature ability score
     * @param oCreature {BoxedCreature}
     * @param sAbility {string} ABILITY_*
     * @returns {number}
     */
    getAbilityScore (oCreature, sAbility) {
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getAbilities[this.services.core.checkConst(sAbility, this.services.core.PREFIXES.ABILITY)];
    }

    /**
     * Get a list of action identifier
     * @param oCreature {string}
     * @return {{[id: string]: BoxedAction}}
     */
    getActions (oCreature) {
        return Object.fromEntries(Object
            .entries(oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getActions)
            .map(([sAction, oAction]) => [sAction, new BoxedAction(oAction)]));
    }

    /**
     * Returns true if creature has the specified basic capability
     * @param oCreature {BoxedCreature} creature identifier
     * @param sCapability {string} CAPABILITY_*
     * @returns {boolean}
     */
    hasCapability (oCreature, sCapability) {
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getCapabilitySet
            .has(this.services.core.checkConst(sCapability, this.services.core.PREFIXES.CAPABILITY));
    }

    /**
     * Returns true if creature has the specified condition
     * @param oCreature {BoxedCreature} creature identifier
     * @param sCondition {string} CONDITION_*
     * @returns {boolean}
     */
    hasConditions (oCreature, sCondition) {
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getConditionSet
            .has(this.services.core.checkConst(sCondition, this.services.core.PREFIXES.CONDITION));
    }

    /**
     * Returns a list of conditions that affect creature
     * @param oCreature {BoxedCreature} creature identifier
     * @returns {string[]} CONDITION_* []
     */
    getConditions (oCreature) {
        return [...oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getConditionSet];
    }

    /**
     * returns the current weight of all carried items
     * @param oCreature {BoxedCreature} creature identifier
     * @returns {number}
     */
    getCarriedWeight (oCreature) {
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getEncumbrance.value;
    }

    /**
     * returns the maximum weight a creature can carry
     * @param oCreature {BoxedCreature} creature identifier
     * @returns {number}
     */
    getMaxCarryWeight (oCreature) {
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getEncumbrance.capacity;
    }

    /**
     * Retrieve equipment list
     * @param oCreature {BoxedCreature}
     * @returns {{slot: *, item: *}[]}
     */
    getEquipment (oCreature) {
        return Object.entries(oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getEquipment
        ).map(([slot, item]) => {
            return {
                slot,
                item: item.id
            };
        });
    }
}

module.exports = Creatures;
