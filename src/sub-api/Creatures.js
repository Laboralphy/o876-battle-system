const Abstract = require('./ServiceAbstract');
const BoxedCreature = require('./classes/BoxedCreature');
const BoxedItem = require('./classes/BoxedItem');
const CONSTS = require('../consts');

class Creatures extends Abstract {
    /**
     * Returns true if the specified entity id refers to a creature
     * @param oEntity {*} An object
     * @returns {boolean} true if specified object is a creature
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
     * Returns a creature ability modifier.
     * An ability modifier is a number added to any roll involving this ability.
     * For example, a melee attack involving strength, will use strength modifier to increase attack roll.
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
     * Returns a creature ability score.
     * The score is the actual value of the ability. Not to be mistaken with ability modifier.
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
     * Get a list of actions available to the specified creature.
     * For each action, an object is return which properties are describe below
     *
     * @typedef CreatureActionDescription {object}
     * @property id {string} action identifier
     * @property ready {boolean} if true, this action is available, else action is unavailable.
     * @property cooldown {number} when action is unavailable, this property is the number of turn to wait before this action becomes available.
     * @property charges {number} number of charges left for this action. this value should increase at a regular rate (influenced by cooldown)
     * @property maxCharges {number} maximum number of charges for this actions
     * @property range {number} range of this action
     *
     * @param oCreature {BoxedCreature}
     * @return {Object<string, CreatureActionDescription>}
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
     * Returns true if creature has the specified basic capability.
     * A basic capability is one of this value :
     * - CAPABIlITY_ACT creature is able to take actions
     * - CAPABIlITY_SEE creature is able to detect other creature by sight
     * - CAPABIlITY_MOVE creature is able to move
     * - CAPABIlITY_FIGHT creature is able to take hostile action with weapon
     * - CAPABIlITY_CAST_TARGET creature is able to cast spell on others creatures
     * - CAPABIlITY_CAST_SELF creature is able to cast spell on self
     *
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
     * Returns true if creature has the specified condition.
     * Refer to CONDITION_* constant group for a complete list of conditions.
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
     * Returns a list of conditions that affect the specified creature
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

    /**
     *
     * @param oCreature {BoxedCreature}
     * @param sAction {string}
     * @param oTarget {BoxedCreature | null}
     */
    doAction (oCreature, sAction, oTarget = null) {
        this.checkCreature(oCreature);
        if (oTarget) {
            this.checkCreature(oTarget);
        }
        // check if creature is in combat
        const oCombat = this.services.combats.getCreatureCombat(oCreature);
        // if in combat, and same target as combat target, then use combat action mechanism
        if (oCombat) {
            if (oTarget === null || oCombat.target === oTarget[BoxedCreature.SYMBOL_BOXED_OBJECT]) {
                // same target in combat : use combat action mechanism
                this.services.combats.selectAction(oCreature, sAction);
                return;
            } else {
                // different target, disengage from combat
                this.services.combats.endCombat(oCreature, false);
            }
        }
        const oAction = oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getActions[sAction];
        this.executeActionScript(
            oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT],
            oAction,
            oTarget[BoxedCreature.SYMBOL_BOXED_OBJECT]
        );
    }
}

module.exports = Creatures;
