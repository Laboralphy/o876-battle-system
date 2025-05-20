const { getUniqueId } = require('./libs/unique-id');
const { buildStore } = require('./store');
const CONSTS = require('./consts');
const Events = require('events');
const Dice = require('./libs/dice');
const { checkConst } = require('./libs/check-const');
const { computeSavingThrowAdvantages } = require('./advantages');

class Creature {
    constructor ({ blueprint = null, id = null, data = undefined } = {}) {
        this._store = buildStore({ externals: data });
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

    get store () {
        return this._store;
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
        m.setSpecie({ value: blueprint.specie });
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

    /**
     * get current hit points
     * @returns {number}
     */
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
     * Roll a D20 and return the result
     * however if the roll is advantaged (nRollBias > 0) then roll twice and return greatest
     * if roll is disadvantaged (nRollBias < 0) then roll twice and return lowest
     * @param nRollBias {number} 0 = non-advantaged, >0 = advantaged, <0 = disadvantaged
     * @returns {number}
     * @private
     */
    _rollD20 (nRollBias = 0) {
        if (nRollBias === 0) {
            return this._dice.roll('1d20');
        } else {
            return Math[nRollBias > 0 ? 'max' : 'min'](this._rollD20(), this._rollD20());
        }
    }

    /**
     * @typedef SavingThrowOutcome {object}
     * @property creature {Creature} creature throwing the save
     * @property roll {number}
     * @property dc {number}
     * @property success {boolean}
     * @property bonus {number}
     * @property ability {string}
     * @property threat {string}
     * @property rollBias {RollBias}
     *
     * Check saving throw
     * @param sAbility {string}
     * @param dc {number}
     * @param threat {string|string[]|null} THREAT_*
     * @returns {SavingThrowOutcome}
     */
    rollSavingThrow (sAbility, dc, threat = null) {
        const stb = this.getters.getSavingThrowBonus;
        let nThreatBonus = 0;
        if (Array.isArray(threat)) {
            nThreatBonus = threat
                .map(t => stb[t] ?? 0)
                .reduce((prev, curr) => prev + curr, 0);
        } else if (typeof threat === 'string') {
            nThreatBonus = stb[threat] ?? 0;
        }
        const bonus = stb[sAbility] + nThreatBonus;
        const result = {
            creature: this,
            roll: 0,
            dc,
            success: false,
            bonus,
            ability: sAbility,
            threat,
            rollBias: {
                result: 0,
                advantages: new Set(),
                disadvantage: new Set()
            }
        };
        result.rollBias = computeSavingThrowAdvantages(result);
        const roll = this._rollD20(result.rollBias.result);
        result.roll = roll;
        result.success = roll === this.getters.getVariables['ROLL_FUMBLE_VALUE']
            ? false
            : roll === this.getters.getVariables['ROLL_CRITICAL_SUCCESS_VALUE']
                ? true
                : (roll + bonus >= dc);
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
        const nRoll = this._rollD20();
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
        const roll = this._rollD20();
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

    /**
     * Increases creature level
     */
    levelUp () {
        this.mutations.setLevel({ value: this.getters.getUnmodifiedLevel });
        this.events.emit(CONSTS.EVENT_CREATURE_LEVEL_UP);
    }
}

module.exports = Creature;
