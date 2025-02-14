const Abstract = require('./Abstract')
const Creature = require("../Creature");

class Creatures extends Abstract {
    constructor(services) {
        super(services)
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
        return oCreature.getters.getAbilityModifiers[this._services.core.checkConst(sAbility, this._services.core.PREFIXES.ABILITY)]
    }

    /**
     * Returns a creature ability score
     * @param idCreature {string}
     * @param sAbility {string} ABILITY_*
     * @returns {number}
     */
    getAbilityScore (idCreature, sAbility) {
        const oCreature = this.getCreature(idCreature)
        return oCreature.getters.getAbilities[this._services.core.checkConst(sAbility, this._services.core.PREFIXES.ABILITY)]
    }

    /**
     * Get a list of action identifier
     * @param idCreature {string}
     * @return {string[]}
     */
    getActions (idCreature) {
        return Object
            .entries(this.getCreature(idCreature).getters.getActions)
            .map(([sAction, {
                id,
                cooldown,
                charges,
                range,
                ready
            }]) => [sAction, {
                id,
                cooldown,
                charges,
                range,
                ready
            }])
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
            .has(this._services.checkConst(sCapability, this._services.core.PREFIXES.CAPABILITY))
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
            .has(this._services.checkConst(sCondition, this._services.core.PREFIXES.CONDITION))
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
}

module.exports = Creatures