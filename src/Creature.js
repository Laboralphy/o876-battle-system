const { getUniqueId } = require('./libs/unique-id');
const { buildStore } = require('./store');
const CONSTS = require('./consts');
const Events = require('events');
const Dice = require('./libs/dice');
const { checkConst } = require('./libs/check-const');

class Creature {
    constructor ({ blueprint = null, id = null } = {}) {
        this._store = buildStore();
        if (blueprint) {
            this.blueprint = blueprint;
        } else {
            this._blueprint = null;
        }
        if (id) {
            this.mutations.setId({ value: id });
        } else {
            this.mutations.setId({ value: getUniqueId() });
        }
        this._events = new Events;
        this._dice = new Dice();
    }

    get data () {
        return this._store.externals;
    }

    /**
     * @returns {Dice}
     */
    get dice () {
        return this._dice;
    }

    get events () {
        return this._events;
    }

    /**
     * return store getters
     * @returns {RBSStoreGetters}
     */
    get getters () {
        return this._store.getters;
    }

    /**
     * return store mutations
     * @returns {RBSStoreMutations}
     */
    get mutations () {
        return this._store.mutations;
    }

    /**
     * Returns creature id
     * @returns {string}
     */
    get id () {
        return this.getters.getId;
    }

    /**
     * Sets creature id
     * @param value {string}
     */
    set id (value) {
        this.mutations.setId({ id: value });
    }

    set blueprint (blueprint) {
        const m = this.mutations;
        m.setLevel({ value: blueprint.specie });
        m.setRace({ value: blueprint.race || CONSTS.RACE_UNKNOWN });
        m.setGender({ value: blueprint.gender || CONSTS.GENDER_NONE });
        m.setNaturalArmorClass({ value: blueprint.ac || 0 });
        m.setSpeed({ value: blueprint.speed });
        m.setClassType({ value: blueprint.classType });
        m.setHitDie({ value: blueprint.hd });
        m.setLevel({ value: blueprint.level });
        blueprint.proficiencies.forEach(value => m.addProficiency({ value }));
        if ('abilities' in blueprint) {
            m.setAbilityValue({ ability: CONSTS.ABILITY_STRENGTH, value: blueprint.abilities.strength });
            m.setAbilityValue({ ability: CONSTS.ABILITY_DEXTERITY, value: blueprint.abilities.dexterity });
            m.setAbilityValue({ ability: CONSTS.ABILITY_CONSTITUTION, value: blueprint.abilities.constitution });
            m.setAbilityValue({ ability: CONSTS.ABILITY_INTELLIGENCE, value: blueprint.abilities.intelligence });
            m.setAbilityValue({ ability: CONSTS.ABILITY_WISDOM, value: blueprint.abilities.wisdom });
            m.setAbilityValue({ ability: CONSTS.ABILITY_CHARISMA, value: blueprint.abilities.charisma });
        }
        m.setHitPoints({ value: this.getters.getMaxHitPoints });
        this._blueprint = blueprint;
    }

    get blueprint () {
        return this._blueprint;
    }

    equipItem (oItem) {
        const r = this.mutations.equipItem({ item: oItem });
        const {
            previousItem,
            newItem,
            slot,
            cursed
        } = r;
        if (cursed) {
            this._events.emit(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, {
                item: oItem,
                cursedItem: previousItem,
                slot
            });
        } else {
            if (previousItem) {
                this._events.emit(CONSTS.EVENT_CREATURE_REMOVE_ITEM, {
                    item: previousItem,
                    slot
                });
            }
            this._events.emit(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                item: newItem,
                slot
            });
        }
        return r;
    }

    /**
     * get the slot of an equipped item or '' if not equipped
     * @param oItem {RBSItem}
     */
    getItemSlot (oItem) {
        const idItem = oItem.id;
        const eq = this.getters.getEquipment;
        const aSlots = oItem.blueprint.equipmentSlots;
        const sSlot = aSlots.find(s => eq[s].id === idItem);
        return sSlot ?? '';
    }

    /**
     * Removes an equipped item from equipment
     * @param oItem {RBSItem}
     */
    removeItem (oItem) {
        const sSlot = this.getItemSlot(oItem);
        if (sSlot) {
            this.mutations.equipItem({ item: oItem, slot: sSlot });
        }
    }

    /**
     * select an offensive slot
     * @param sSlot {string}
     */
    selectOffensiveSlot (sSlot) {
        const sPrevSlot = this.getters.getSelectedOffensiveSlot;
        if (sSlot !== sPrevSlot) {
            this.mutations.selectOffensiveSlot({ value: sSlot });
            this._events.emit(CONSTS.EVENT_CREATURE_SELECT_WEAPON, {
                slot: sSlot,
                previousSlot: sPrevSlot
            });
        }
    }

    /**
     * Returns true if this creature can detect its target
     * @param oTarget {Creature}
     * @return {string} CREATURE_VISIBILITY_*
     */
    getCreatureVisibility (oTarget) {
        if (oTarget === this) {
            return CONSTS.CREATURE_VISIBILITY_VISIBLE;
        }
        const mg = this.getters;
        const tg = oTarget.getters;
        const myConditions = mg.getConditionSet;
        const myEffects = mg.getEffectSet;
        const myProps = mg.getPropertySet;
        const targetEffects = tg.getEffectSet;
        const targetProps = tg.getPropertySet;
        if (myConditions.has(CONSTS.CONDITION_BLINDED)) {
            return CONSTS.CREATURE_VISIBILITY_BLINDED;
        }
        if (targetEffects.has(CONSTS.EFFECT_INVISIBILITY) && !myEffects.has(CONSTS.EFFECT_SEE_INVISIBILITY)) {
            return CONSTS.CREATURE_VISIBILITY_INVISIBLE;
        }
        if (targetEffects.has(CONSTS.EFFECT_STEALTH)) {
            return CONSTS.CREATURE_VISIBILITY_HIDDEN;
        }
        const bInDarkness = mg.getEnvironment[CONSTS.ENVIRONMENT_DARKNESS];
        if (bInDarkness && !myEffects.has(CONSTS.EFFECT_DARKVISION) && !myProps.has(CONSTS.PROPERTY_DARKVISION)) {
            // if environment is dark, then one of the two opponent must have a source light
            return (
                myProps.has(CONSTS.PROPERTY_LIGHT) ||
                targetProps.has(CONSTS.PROPERTY_LIGHT) ||
                myEffects.has(CONSTS.EFFECT_LIGHT) ||
                targetEffects.has(CONSTS.EFFECT_LIGHT)
            )
                ? CONSTS.CREATURE_VISIBILITY_VISIBLE
                : CONSTS.CREATURE_VISIBILITY_DARKNESS;
        }
        return CONSTS.CREATURE_VISIBILITY_VISIBLE;
    }

    /**
     * Revive a dead creature
     */
    revive () {
        if (this.getters.isDead) {
            this._events.emit(CONSTS.EVENT_CREATURE_REVIVE);
            this.mutations.setHitPoints({ value: this.getters.getVariables['REVIVE_HIT_POINTS'] });
        }
    }

    get hitPoints () {
        return this.getters.getHitPoints;
    }

    set hitPoints (hp) {
        const nCurrHP = this.getters.getHitPoints;
        if (this.getters.isDead) {
            return;
        }
        const nMaxHP = this.getters.getMaxHitPoints;
        hp = Math.max(0, Math.min(hp, nMaxHP));
        if (hp === nCurrHP) {
            return;
        }
        this.mutations.setHitPoints({ value: hp });
    }

    /**
     * Check saving throw
     * @param sAbility
     * @param dc
     * @returns {{success: boolean, bonus: number, roll: number, ability: string, dc: number}}
     */
    rollSavingThrow (sAbility, dc) {
        const roll = this._dice.roll('1d20');
        const bonus = this.getters.getSavingThrowBonus[sAbility];
        const success = roll === this.getters.getVariables['ROLL_FUMBLE_VALUE']
            ? false
            : roll === this.getters.getVariables['ROLL_CRITICAL_SUCCESS_VALUE']
                ? true
                : (roll + bonus >= dc);
        const result = {
            roll,
            dc,
            success,
            bonus,
            ability: sAbility
        };
        this._events.emit(CONSTS.EVENT_CREATURE_SAVING_THROW, result);
        return result;
    }

    /**
     * Checks an ability for a non-skill task
     * @param sAbility {string}
     * @param dc {number}
     * @returns {{ability: string, roll: number, bonus: number, success: boolean}}
     */
    checkAbility (sAbility, dc) {
        checkConst(sAbility);
        const nModifier = this.getters.getAbilityModifiers[sAbility];
        const nRoll = this._dice.roll('1d20');
        const result = {
            ability: sAbility,
            roll: nRoll,
            bonus: nModifier,
            success: (nRoll + nModifier) >= dc
        };
        this.events.emit(CONSTS.EVENT_CREATURE_ABILITY_CHECK, result);
        return result;
    }

    /**
     * Checks a skill
     * @param sSkill {string}
     * @param dc {number}
     * @returns {{bonus: number, success: boolean, skill: string, roll: number, dc: number}}
     */
    checkSkill (sSkill, dc = 0) {
        const sv = this.getters.getSkillValues;
        if (!(sSkill in sv)) {
            throw new Error(`Invalid skill ${sSkill}`);
        }
        const bonus = sv[sSkill];
        const roll = this._dice.roll('1d20');
        const result = {
            skill: sSkill,
            roll: roll,
            bonus,
            dc,
            success: roll + bonus >= dc
        };
        this.events.emit(CONSTS.EVENT_CREATURE_SKILL_CHECK, result);
        return result;
    }
}

module.exports = Creature;
