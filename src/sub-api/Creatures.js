const Abstract = require('./ServiceAbstract')
const Creature = require("../Creature");
const BoxedAction = require('./classes/BoxedAction');

class Creatures extends Abstract {
    /**
     * Returns true if the specified entity id refers to a creature, not an item
     * @param idEntity
     * @returns {boolean}
     */
    isCreature (idEntity) {
        return this.services.core.getEntity(idEntity) instanceof Creature
    }

    /**
     * Returns a Creature. Not an item
     * @param id {string} creature id
     * @return {Creature}
     */
    getCreature (id) {
        const oEntity = this.getEntity(id)
        if (oEntity instanceof Creature) {
            return oEntity
        } else {
            throw new TypeError(`entity ${id} is not a creature`)
        }
    }

    /**
     * Returns a creature ability modifier
     * @param idCreature {string}
     * @param sAbility {string} ABILITY_*
     * @returns {number}
     */
    getAbilityModifier (idCreature, sAbility) {
        const oCreature = this.getCreature(idCreature)
        return oCreature.getters.getAbilityModifiers[this.services.core.checkConst(sAbility, this.services.core.PREFIXES.ABILITY)]
    }

    /**
     * Returns a creature ability score
     * @param idCreature {string}
     * @param sAbility {string} ABILITY_*
     * @returns {number}
     */
    getAbilityScore (idCreature, sAbility) {
        const oCreature = this.getCreature(idCreature)
        return oCreature.getters.getAbilities[this.services.core.checkConst(sAbility, this.services.core.PREFIXES.ABILITY)]
    }

    /**
     * Get a list of action identifier
     * @param idCreature {string}
     * @return {{[id: string]: BoxedAction}}
     */
    getActions (idCreature) {
        return Object.fromEntries(Object
            .entries(this.getCreature(idCreature).getters.getActions)
            .map(([sAction, oAction]) => [sAction, new BoxedAction(oAction)]))
    }

    /**
     * Returns true if creature has the specified basic capability
     * @param idCreature {string} creature identifier
     * @param sCapability {string} CAPABILITY_*
     * @returns {boolean}
     */
    hasCapability (idCreature, sCapability) {
        return this
            .getCreature(idCreature)
            .getters
            .getCapabilitySet
            .has(this.services.core.checkConst(sCapability, this.services.core.PREFIXES.CAPABILITY))
    }

    /**
     * Returns true if creature has the specified condition
     * @param idCreature {string} creature identifier
     * @param sCondition {string} CONDITION_*
     * @returns {boolean}
     */
    hasConditions (idCreature, sCondition) {
        return this
            .getCreature(idCreature)
            .getters
            .getConditionSet
            .has(this.services.core.checkConst(sCondition, this.services.core.PREFIXES.CONDITION))
    }

    /**
     * Returns a list of conditions that affect creature
     * @param idCreature {string} creature identifier
     * @returns {string[]} CONDITION_* []
     */
    getConditions (idCreature) {
        return [...this.getCreature(idCreature).getters.getConditionSet]
    }

    /**
     * returns the current weight of all carried items
     * @param idCreature {string} creature identifier
     * @returns {number}
     */
    getCarriedWeight (idCreature) {
        return this.getCreature(idCreature).getters.getEncumbrance.value
    }

    /**
     * returns the maximum weight a creature can carry
     * @param idCreature {string} creature identifier
     * @returns {number}
     */
    getMaxCarryWeight (idCreature) {
        return this.getCreature(idCreature).getters.getEncumbrance.capacity
    }

    /**
     * Retrieve equipment list
     * @param idCreature
     * @returns {{slot: *, item: *}[]}
     */
    getEquipment (idCreature) {
        return Object.entries(this
            .getCreature(idCreature)
            .getters
            .getEquipment
        ).map(([slot, item]) => {
            return {
                slot,
                item: item.id
            }
        })
    }
}

module.exports = Creatures