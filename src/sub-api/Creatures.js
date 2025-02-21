const Abstract = require('./ServiceAbstract');
const BoxedCreature = require('./classes/BoxedCreature');
const BoxedItem = require('./classes/BoxedItem');
const CONSTS = require('../consts');

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
     * Throws an error if specified parameter is not a BoxedCreature
     * @param oEntity {BoxedCreature}
     */
    checkCreature (oEntity) {
        if (!this.isCreature(oEntity)) {
            throw new TypeError('BoxedCreature instance expected');
        }
    }

    /**
     * Returns a creature ability modifier
     * @param oCreature {BoxedCreature}
     * @param sAbility {string} ABILITY_*
     * @returns {number}
     */
    getAbilityModifier (oCreature, sAbility) {
        this.checkCreature(oCreature);
        this.services.core.checkConstAbility(sAbility);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getAbilityModifiers[this.services.core.checkConstAbility(sAbility)];
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
            .getAbilities[this.services.core.checkConstAbility(sAbility)];
    }

    /**
     * Get a list of action identifier
     * @param oCreature {BoxedCreature}
     * @return {{[id: string]: {id: string, cooldown: number, charges: number, maxCharges: number, range: number, ready: boolean}}}
     */
    getActions (oCreature) {
        this.checkCreature(oCreature);
        return Object.fromEntries(Object
            .entries(oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getActions)
            .map(([sAction, oAction]) => [sAction, {
                id: oAction.id,
                cooldown: oAction.cooldown,
                charges: oAction.charges,
                maxCharges: oAction.maxCharges,
                range: oAction.range,
                ready: oAction.ready
            }]));
    }

    /**
     * Returns true if creature has the specified basic capability
     * @param oCreature {BoxedCreature} creature identifier
     * @param sCapability {string} CAPABILITY_*
     * @returns {boolean}
     */
    hasCapability (oCreature, sCapability) {
        this.checkCreature(oCreature);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getCapabilitySet
            .has(this.services.core.checkConstCapability(sCapability));
    }

    /**
     * Returns true if creature has the specified condition
     * @param oCreature {BoxedCreature} creature identifier
     * @param sCondition {string} CONDITION_*
     * @returns {boolean}
     */
    hasConditions (oCreature, sCondition) {
        this.checkCreature(oCreature);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getConditionSet
            .has(this.services.core.checkConstCondition(sCondition));
    }

    /**
     * Returns a list of conditions that affect creature
     * @param oCreature {BoxedCreature} creature identifier
     * @returns {string[]} CONDITION_* []
     */
    getConditions (oCreature) {
        this.checkCreature(oCreature);
        return [...oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getConditionSet];
    }

    /**
     * returns the current weight of all carried items
     * @param oCreature {BoxedCreature} creature identifier
     * @returns {number}
     */
    getEquipmentWeight (oCreature) {
        this.checkCreature(oCreature);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getEncumbrance.value;
    }

    /**
     * returns the maximum weight a creature can carry
     * @param oCreature {BoxedCreature} creature identifier
     * @returns {number}
     */
    getMaxEquipmentWeight (oCreature) {
        this.checkCreature(oCreature);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getEncumbrance.capacity;
    }

    /**
     * Retrieve equipment at specified slot ; returns null if no equipped item
     * @param oCreature {BoxedCreature}
     * @param sSlot {string} EQUIPMENT_SLOT_*
     * @returns {BoxedItem|null}
     */
    getEquipment (oCreature, sSlot) {
        this.checkCreature(oCreature);
        this.services.core.checkConstEquipmentSlot(sSlot);
        const eq = oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getEquipment;
        if (eq[sSlot]) {
            return new BoxedItem(eq[sSlot]);
        } else {
            return null;
        }
    }

    /**
     * Equip an item into a creature
     * @param oCreature {BoxedCreature}
     * @param oItem {BoxedItem}
     * @param sSlot {string}
     */
    equipItem (oCreature, oItem, sSlot = '') {
        this.checkCreature(oCreature);
        if (sSlot !== '') {
            this.services.core.checkConstEquipmentSlot(sSlot);
        }
        this.services.items.checkItem(oItem);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].equipItem(oItem, sSlot);
    }

    /**
     * Get current creature hit points.
     * @param oCreature {BoxedCreature}
     * @returns {number}
     */
    getHitPoints (oCreature) {
        this.checkCreature(oCreature);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].hitPoints;
    }

    /**
     * Set current creature hit points
     * @param oCreature {BoxedCreature}
     * @param nHP {number}
     */
    setHitPoints (oCreature, nHP) {
        this.checkCreature(oCreature);
        oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].hitPoints = nHP;
    }

    /**
     * Get creature maximum hit points
     * @param oCreature {BoxedCreature}
     * @returns {number}
     */
    getMaxHitPoints (oCreature) {
        this.checkCreature(oCreature);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getMaxHitPoints;
    }

    /**
     * Checks if a creature manages to overcome a task difficulty involving the specified ability
     * @param oCreature {BoxedCreature} creature
     * @param sAbility {string} ability involved
     * @param dc {number} task difficulty
     * @returns {boolean}
     */
    checkAbility (oCreature, sAbility, dc) {
        this.checkCreature(oCreature);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].checkAbility(sAbility, dc).success;
    }

    /**
     * Checks if a creature manages to overcome a task difficulty involving the specified skill
     * @param oCreature {BoxedCreature} creature
     * @param sSkill {string} skill involved
     * @param dc {number} task difficulty
     * @returns {boolean}
     */
    checkSkill (oCreature, sSkill, dc) {
        this.checkCreature(oCreature);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].checkSkill(sSkill, dc).success;
    }

    /**
     * If a creature is dead, revive it
     * @param oCreature {BoxedCreature}
     */
    revive (oCreature) {
        this.checkCreature(oCreature);
        oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].revive();
    }

    /**
     * Checks if a creature can see another creature
     * @param oCreature {BoxedCreature}
     * @param oTarget {BoxedCreature}
     * @returns {boolean}
     */
    isCreatureVisible (oCreature, oTarget) {
        this.checkCreature(oCreature);
        this.checkCreature(oTarget);
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getCreatureVisibility(oTarget[BoxedCreature.SYMBOL_BOXED_OBJECT]) === CONSTS.CREATURE_VISIBILITY_VISIBLE;
    }
}

module.exports = Creatures;
