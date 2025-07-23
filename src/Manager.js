const EntityBuilder = require('./EntityBuilder');
const EffectProcessor = require('./EffectProcessor');
const Horde = require('./Horde');
const CombatManager = require('./libs/combat/CombatManager');
const CombatActionFailure = require('./libs/combat/CombatActionFailure');
const CombatActionSuccess = require('./libs/combat/CombatActionSuccess');
const CombatActionTaken = require('./libs/combat/CombatActionTaken');
const Events = require('events');
const SCHEMAS = require('./schemas');
const SchemaValidator = require('./SchemaValidator');
const Creature = require('./Creature');
const path = require('path');
const AttackOutcome = require('./AttackOutcome');
const CONSTS = require('./consts');
const TAG_SPELL_GROUP = 'SPELL_GROUP::';

const SPECIAL_ACTION_CAST_SPELL = 'cast-spell';

const { aggregateModifiers } = require('./libs/aggregator');
const PropertyBuilder = require('./PropertyBuilder');
const baseModule = require('./modules/base');
const Evolution = require('./Evolution');
const {
    checkConstCapability,
    checkConstAbility,
    checkConstCondition,
    checkConstEffect,
    checkConstProperty,
    checkConstEquipmentSlot
} = require('./check-const');

const CombatStartEvent = require('./events/CombatStartEvent');
const CombatMoveEvent = require('./events/CombatMoveEvent');
const CombatTurnEvent = require('./events/CombatTurnEvent');
const CombatEndEvent = require('./events/CombatEndEvent');
const CombatDistanceEvent = require('./events/CombatDistanceEvent');
const CombatAttackEvent = require('./events/CombatAttackEvent');
const CreatureEffectAppliedEvent = require('./events/CreatureEffectAppliedEvent');
const CreatureEffectExpiredEvent = require('./events/CreatureEffectExpiredEvent');
const CreatureEffectImmunityEvent = require('./events/CreatureEffectImmunityEvent');
const CreatureSelectWeaponEvent = require('./events/CreatureSelectWeaponEvent');
const CreatureReviveEvent = require('./events/CreatureReviveEvent');
const CreatureSavingThrowEvent = require('./events/CreatureSavingThrowEvent');
const CreatureDamagedEvent = require('./events/CreatureDamagedEvent');
const CreatureDeathEvent = require('./events/CreatureDeathEvent');
const CreatureActionEvent = require('./events/CreatureActionEvent');
const {checkEntityCreature, checkEntityItem} = require('./check-entity');

class Manager {
    constructor () {
        this._events = new Events();
        this._horde = new Horde();
        const eb = new EntityBuilder();
        const sv = new SchemaValidator();
        sv.schemaIndex = SCHEMAS;
        sv.init();
        eb.schemaValidator = sv;
        const ep = new EffectProcessor({ horde: this._horde });
        const cm = new CombatManager();
        this._entityBuilder = eb;
        this._propertyBuilder = new PropertyBuilder();
        eb.propertyBuilder = this._propertyBuilder;
        this._effectProcessor = ep;
        this._combatManager = cm;
        this._scripts = {};
        this._time = 0;
        this._systemInstance = this;
        cm.events.on(CONSTS.EVENT_COMBAT_TURN, evt => this._combatManagerEventTurn(evt));
        cm.events.on(CONSTS.EVENT_COMBAT_START, evt => this._combatManagerEventStart(evt));
        cm.events.on(CONSTS.EVENT_COMBAT_END, evt => this._combatManagerEventEnd(evt));
        cm.events.on(CONSTS.EVENT_COMBAT_MOVE, evt => this._combatManagerEventMove(evt));
        cm.events.on(CONSTS.EVENT_COMBAT_DISTANCE, evt => this._combatManagerEventDistance(evt));
        cm.events.on(CONSTS.EVENT_COMBAT_ACTION, evt => this._combatManagerAction(evt));
        cm.events.on(CONSTS.EVENT_COMBAT_ATTACK, evt => this._combatManagerAttack(evt));
        ep.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, evt => this._effectApplied(evt));
        ep.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, evt => this._effectImmunity(evt));
        ep.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED, evt => this._effectDisposed(evt));
        this.defineModule(baseModule);
        this._evolution = null;
        this._factionsInitialized = false;
    }

    get CONSTS () {
        return CONSTS;
    }

    get data () {
        return this._entityBuilder.data;
    }

    get propertyBuilder () {
        return this._propertyBuilder;
    }

    get entityBuilder () {
        return this._entityBuilder;
    }

    /**
     * @returns {EffectProcessor}
     */
    get effectProcessor () {
        if (!this._effectProcessor) {
            throw new Error('EffectProcessor not found');
        }
        return this._effectProcessor;
    }

    get time () {
        return this._time;
    }

    /**
     * @returns {Horde}
     */
    get horde () {
        return this._horde;
    }

    get events () {
        return this._events;
    }

    get systemInstance () {
        return this._systemInstance;
    }

    set systemInstance (value) {
        return this._systemInstance = value;
    }

    /**
     * @returns {Map<string, any>}
     */
    get blueprints () {
        return this._entityBuilder.blueprints;
    }

    /**
     * return instance of combat manager
     * @returns {CombatManager}
     */
    get combatManager () {
        return this._combatManager;
    }

    // ▗▄▄▖             ▗▖     ▗▖            ▗▖ ▄▖
    // ▐▙▄ ▐▌▐▌▗▛▜▖▐▛▜▖▝▜▛▘    ▐▙▄  ▀▜▖▐▛▜▖ ▄▟▌ ▐▌ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▌  ▝▙▟▘▐▛▀▘▐▌▐▌ ▐▌     ▐▌▐▌▗▛▜▌▐▌▐▌▐▌▐▌ ▐▌ ▐▛▀▘▐▌   ▀▜▖
    // ▝▀▀▘ ▝▘  ▀▀ ▝▘▝▘  ▀▘    ▝▘▝▘ ▀▀▘▝▘▝▘ ▀▀▘ ▀▀  ▀▀ ▝▘  ▝▀▀

    /**
     * A new effect has been applied on a creatures. The manager must keep track of this effect if duration is > 0
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @param source {Creature}
     */
    _effectApplied({effect, target, source}) {
        this._events.emit(
            CONSTS.EVENT_CREATURE_EFFECT_APPLIED,
            new CreatureEffectAppliedEvent({
                system: this._systemInstance,
                effect,
                target,
                source
            }));
    }

    /**
     * an effect could not be applied to target because of effect immunity
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @private
     */
    _effectImmunity({effect, target}) {
        this._events.emit(CONSTS.EVENT_CREATURE_EFFECT_IMMUNITY, new CreatureEffectImmunityEvent({ system: this._systemInstance, effect, target }));
    }

    /**
     * An effect has expired (duration reached 0)
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @param source {Creature}
     */
    _effectDisposed({effect, target, source}) {
        this._events.emit(CONSTS.EVENT_CREATURE_EFFECT_EXPIRED, new CreatureEffectExpiredEvent({ system: this._systemInstance, effect, target }));
    }

    _combatManagerEventTurn (evt) {
        const {
            action,
            combat
        } = evt;
        this.runPropEffectScript(combat.attacker, 'combatTurn', {
            action,
            combat,
            manager: this
        });
        this._events.emit(CONSTS.EVENT_COMBAT_TURN, new CombatTurnEvent({
            system: this._systemInstance,
            combat: evt.combat
        }));
    }

    _combatManagerEventStart (evt) {
        this._events.emit(CONSTS.EVENT_COMBAT_START, new CombatStartEvent({
            system: this._systemInstance,
            combat: evt.combat
        }));
    }

    _combatManagerEventEnd (evt) {
        this._events.emit(CONSTS.EVENT_COMBAT_END, new CombatEndEvent({
            system: this._systemInstance,
            combat: evt.combat
        }));
    }

    _combatManagerEventMove (evt) {
        this._events.emit(CONSTS.EVENT_COMBAT_MOVE, new CombatMoveEvent({
            system: this._systemInstance,
            combat: evt.combat,
            speed: evt.speed
        }));
    }

    _combatManagerEventDistance (evt) {
        this._events.emit(CONSTS.EVENT_COMBAT_DISTANCE, new CombatDistanceEvent({
            system: this._systemInstance,
            combat: evt.combat,
            distance: evt.combat.distance
        }));
    }

    /**
     * Initiate a combat action.
     * Must run the script associated with this action
     * @param evt
     * @private
     */
    _combatManagerAction (evt) {
        const combat = evt.combat;
        const attacker = combat.attacker;
        const target = combat.target;
        const parameters = evt.parameters;
        // combat.selectCurrentAction(evt.action.id);
        const action = evt.action;
        // Lancement de l'action
        if (action) {
            this.executeAction(attacker, action, target);
        }
    }

    /**
     * combat.attack listener
     * @param evt
     * @private
     */
    _combatManagerAttack (evt) {
        const {
            combat,
            count,
            opportunity
        } = evt;
        const oAttacker = combat.attacker;
        const oTarget = combat.target;
        const aOffenders = this
            .getTargetingCreatures(oAttacker)
            .filter(o => o !== oTarget);
        const bCouldMultiAttack = oAttacker.getters.getPropertySet.has(CONSTS.PROPERTY_MULTI_ATTACK) && aOffenders.length > 0;
        for (let i = 0; i < count; ++i) {
            if (bCouldMultiAttack) {
                const nMultiAttackCount = Math.min(
                    aggregateModifiers([
                        CONSTS.PROPERTY_MULTI_ATTACK
                    ], oAttacker.getters).sum,
                    aOffenders.length
                );
                let iRank = Math.floor(oAttacker.dice.random() * aOffenders.length);
                for (let iMultiAttack = 0; iMultiAttack < nMultiAttackCount; ++iMultiAttack) {
                    this.deliverAttack(oAttacker, aOffenders[iRank], { applyDamage: true });
                    iRank = (iRank + 1) % aOffenders.length;
                }
            }
            this.deliverAttack(oAttacker, oTarget, {
                opportunity,
                applyDamage: true
            });
        }
    }

    /****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ******/
    /****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ******/
    /****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ****** PUBLIC API ******/

    get checkConst () {
        return {
            capability: checkConstCapability,
            ability: checkConstAbility,
            condition: checkConstCondition,
            effect: checkConstEffect,
            property: checkConstProperty,
            equipmentSlot: checkConstEquipmentSlot
        };
    }


    // ▗▄▄▖         ▗▖  ▗▖
    // ▐▙▄  ▀▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▌  ▗▛▜▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘   ▀▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀

    /**
     * Define factions
     * @param oFactions
     */
    defineFactions (oFactions) {
        const aFactions = Object
            .entries(oFactions)
            .map(([idFaction, f]) => {
                return {
                    id: idFaction,
                    ...f
                };
            });
        this.horde.factionManager.defineFactions(aFactions);
    }

    initFactions () {
        if (!this._factionsInitialized) {
            this.defineFactions(this.data['FACTIONS']);
            this._factionsInitialized = true;
        }
    }

    getCreatureFaction (oCreature) {
        return this._horde.getCreatureFaction(oCreature.id);
    }

    setCreatureFaction (oCreature, idFaction) {
        this._horde.setCreatureFaction(oCreature.id, idFaction);
    }

    // ▗▄▄▖         ▄▖      ▗▖  ▗▖
    // ▐▙▄ ▐▌▐▌▗▛▜▖ ▐▌ ▐▌▐▌▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖
    // ▐▌  ▝▙▟▘▐▌▐▌ ▐▌ ▐▌▐▌ ▐▌  ▐▌ ▐▌▐▌▐▌▐▌
    // ▝▀▀▘ ▝▘  ▀▀  ▀▀  ▀▀▘  ▀▘ ▀▀  ▀▀ ▝▘▝▘

    get evolution () {
        if (!this._evolution) {
            this._evolution = new Evolution({ data: this.data });
        }
        return this._evolution;
    }

    /**
     * Adds experience points to a creature, this will trigger EVENT_CREATURE_LEVEL_UP if creature reaches next level.
     * @param oCreature {Creature} Instance of creature whose experience needs to be increased
     * @param nXP {number} Number of experience point gained
     * @return {void}
     */
    increaseCreatureExperience (oCreature, nXP) {
        this.evolution.gainXP(oCreature, nXP);
    };

    // ▗▄▄▖  ▄▖  ▄▖         ▗▖
    // ▐▙▄  ▟▙▖ ▟▙▖▗▛▜▖▗▛▀ ▝▜▛▘▗▛▀▘
    // ▐▌   ▐▌  ▐▌ ▐▛▀▘▐▌   ▐▌  ▀▜▖
    // ▝▀▀▘ ▝▘  ▝▘  ▀▀  ▀▀   ▀▘▝▀▀

    /**
     * Creates an effect that can be applied to a creature.
     * @param sEffect {string} Effect type (constant group EFFECT_*)
     * @param amp {number|string} Effect amplitude, can be a number or a die expression (1d6, 2d8 ....)
     * @param data {Object<string, *>} a set of parameter transmitted to effect.
     * @return {RBSEffect} Instance of effect newly created
     */
    createEffect (sEffect, amp = 0, data = {}) {
        return this._effectProcessor.createEffect(sEffect, amp, data);
    }

    /**
     * Creates an effect with subtype preset to SUPERNATURAL
     * This effect is not magical and not produced by natural means of creatures.
     * It can't be removed by 'dispel magic'
     * It must be removed by specific means like 'remove curse' or 'restoration'
     * @param sEffect {string} Effect type (constant group EFFECT_*)
     * @param amp {number|string} Effect amplitude, can be a number or a die expression (1d6, 2d8 ....)
     * @param data {Object<string, *>} a set of parameter transmitted to effect.
     * @return {RBSEffect} Instance of supernatural effect newly created
     */
    createSupernaturalEffect (sEffect, amp = 0, data = {}) {
        return this.createEffect(sEffect, amp, { ...data, subtype: CONSTS.EFFECT_SUBTYPE_SUPERNATURAL });
    }

    /**
     * Creates an effect with subtype preset to EXTRAORDINARY
     * This effect is neither magical nor supernatural.
     * This effect is typically produced by creature with some extraordinary natural abilities.
     * As impressive as it may be, this effect is nevertheless natural, and cannot be dispelled by any mean.
     * Just like supernatural effect, extraordinary effects can only be removed by specialized means.
     * @param sEffect {string} Effect type (constant group EFFECT_*)
     * @param amp {number|string} Effect amplitude, can be a number or a die expression (1d6, 2d8 ....)
     * @param data {Object<string, *>} a set of parameter transmitted to effect.
     * @return {RBSEffect} Instance of extraordianry effect newly created
     */
    createExtraordinaryEffect (sEffect, amp = 0, data = {}) {
        return this.createEffect(sEffect, amp, { ...data, subtype: CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY });
    }

    /**
     * Returns a list of effects applied on the specified creature
     * @param oCreature {Creature} instance of creature
     * @returns {RBSEffect[]} list of effects applied on creature
     */
    getEffects (oCreature) {
        return oCreature
            .getters
            .getEffects;
    }

    /**
     * Get effect duration
     * @param oEffect {RBSEffect} instance of effect
     * @returns {number} duration (turns)
     */
    getEffectDuration (oEffect) {
        return oEffect.duration;
    }

    /**
     * Get effect type
     * @param oEffect {RBSEffect} instance of effect
     * @returns {string} effect type EFFECT_*
     */
    getEffectType (oEffect) {
        return oEffect.type;
    }

    /**
     * Returns true if effect is extraordinary
     * @see createExtraordinaryEffect()
     * @param oEffect {RBSEffect} instance of effect
     * @returns {boolean} true = effect is indeed an extraordinary effect
     */
    isEffectExtraordinary (oEffect) {
        return oEffect.subtype === CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY;
    }

    /**
     * Returns true if effect is supernatural
     * @see createExtraordinaryEffect()
     * @param oEffect {RBSEffect}
     * @returns {boolean}
     */
    isEffectSupernatural (oEffect) {
        return oEffect.subtype === CONSTS.EFFECT_SUBTYPE_SUPERNATURAL;
    }

    /**
     * Returns the creature identifier who created this effect
     * @param oEffect {RBSEffect} effect
     * @returns {Creature} instance of creature that has created the effect
     */
    getEffectCreator (oEffect) {
        const idCreature = oEffect.source;
        const ent = this._horde.creatures;
        if (ent.has(idCreature)) {
            return ent.get(idCreature);
        } else {
            return null;
        }
    }

    /**
     * Returns the creature whose effect is applied on
     * @param oEffect {RBSEffect} effect
     * @returns {Creature} instance of creature whose effect is applied on
     */
    getEffectTarget (oEffect) {
        const idCreature = oEffect.target;
        const ent = this._horde.creatures;
        if (ent.has(idCreature)) {
            return ent.get(idCreature);
        } else {
            return null;
        }
    }

    /**
     * Gather several effects in a "spell effect". These spells are siblings, removing one effect removes all effects
     * @param idSpell {string} spell identifier
     * @param target {Creature} identifier of target creature
     * @param duration {number} duration of all effects
     * @param source {Creature} identifier of source creature
     * @param aEffects {RBSEffect[]} list of all effects
     */
    applySpellEffectGroup (idSpell, aEffects, target, duration = 0, source = undefined) {
        return this
            .effectProcessor
            .applyEffectGroup(
                aEffects,
                TAG_SPELL_GROUP + idSpell,
                target,
                duration,
                source
            );
    }

    /**
     * Removes an effect from the creature it is applied on
     * @param effect {RBSEffect} instance of effect to be removed
     */
    dispellEffect (effect) {
        const oCreature = this.getEffectTarget(effect);
        const oAppliedEffect = oCreature.getters.getEffectRegistry[effect.id];
        this.effectProcessor.removeEffect(oAppliedEffect);
    }

    /**
     * Find all effect of a certain type applied on a given creature
     * @param oCreature {Creature}
     * @param sType {string}
     * @returns {RBSEffect[]}
     */
    findEffects (oCreature, sType) {
        this.checkConst.effect(sType);
        return oCreature.getters.getEffects.filter(effect => effect.type === sType);
    }

    /**
     * Applies an effect to a creature
     * @param oEffect {RBSEffect} instance of effec tto be applied
     * @param oTarget {Creature} instance of creature to apply effect on
     * @param duration {number} duration of effect application
     * @param oSource {Creature|null} instance of creature who created the effect
     * @returns {RBSEffect} instance of applied effect
     */
    applyEffect (oEffect, oTarget, duration = 0, oSource = null) {
        if (duration > 0) {
            oEffect.depletionDelay = this._time % this.combatManager.defaultTickCount;
        }
        return this._effectProcessor.applyEffect(oEffect, oTarget, duration, oSource);
    }


    //  ▄▄         ▗▖       ▗▖
    // ▐▌▝▘▗▛▜▖▐▙▟▙▐▙▄  ▀▜▖▝▜▛▘▗▛▀▘
    // ▐▌▗▖▐▌▐▌▐▛▛█▐▌▐▌▗▛▜▌ ▐▌  ▀▜▖
    //  ▀▀  ▀▀ ▝▘ ▀▝▀▀  ▀▀▘  ▀▘▝▀▀


    /**
     * Starts a combat between two creatures
     * @param oAttacker {Creature} instance of attacking creature
     * @param oTarget {Creature} instance of targetted creature
     * @returns {Combat} instance of combat
     */
    startCombat (oAttacker, oTarget) {
        return this._combatManager.startCombat(oAttacker, oTarget);
    }

    /**
     * Ends a combat.
     * @param oAttacker {Creature} stops a creature from attacking its target
     * @param bBothSide {boolean} makes target creature stops combat as well
     */
    endCombat  (oAttacker, bBothSide = false) {
        const cm = this.combatManager;
        cm.endCombat(oAttacker, bBothSide);
    }

    createAttackOutcome () {
        return new AttackOutcome({ manager: this });
    }

    deliverSpellAttack (attacker, target, {
        spell,
        damage,
        damageType
    }) {
        const oAttackOutcome = this.createAttackOutcome();
        oAttackOutcome.attacker = attacker;
        oAttackOutcome.target = target;
        oAttackOutcome.computeSpellParameters({
            spell,
            damage,
            damageType
        });
        oAttackOutcome.computeDefenseParameters();
        oAttackOutcome.attack();
        this.runPropEffectScript(attacker, 'attack', {
            attack: oAttackOutcome,
            manager: this
        });
        if (oAttackOutcome.hit) {
            oAttackOutcome.createDamageEffects();
            this.runPropEffectScript(target, 'attacked', {
                attack: oAttackOutcome,
                manager: this
            });
        }
        this._events.emit(CONSTS.EVENT_COMBAT_ATTACK, new CombatAttackEvent({
            system: this._systemInstance,
            attack: oAttackOutcome
        }));
        if (oAttackOutcome.hit) {
            oAttackOutcome.applyDamages();
        }
        return oAttackOutcome;
    }

    /**
     * Makes an attacker attacking another creature using currently wielding weapon.
     * Target will fight back unless it is an opportunity attack
     * @param attacker {Creature} instance of attacker
     * @param target {Creature} instance of target
     * @param opportunity {boolean} this is an attack of opportunity, this will not make target, fighting back
     * @param additionalWeaponDamage {number|string} will apply a damage bonus on this attack
     * @param additionalAttackBonus {number|string} will apply an attack bonus on this attack
     * @param applyDamage {boolean} if true then damage will apply
     * @return {AttackOutcome}
     */
    deliverAttack (attacker, target, {
        opportunity = false,
        additionalWeaponDamage = 0,
        additionalAttackBonus = 0
    } = {}) {
        const oAttackOutcome = this.createAttackOutcome();
        oAttackOutcome.attacker = attacker;
        oAttackOutcome.opportunity = opportunity;
        oAttackOutcome.target = target;
        oAttackOutcome.computeAttackParameters();
        oAttackOutcome.computeDefenseParameters();
        oAttackOutcome.rush = additionalWeaponDamage !== 0;
        oAttackOutcome.attack(attacker.dice.roll(additionalAttackBonus));
        this.runPropEffectScript(attacker, 'attack', {
            attack: oAttackOutcome,
            manager: this
        });
        if (oAttackOutcome.hit) {
            if (oAttackOutcome.rush) {
                const sWeaponDamageType = oAttackOutcome.weapon.blueprint.damageType;
                const nAmount = attacker.dice.roll(additionalWeaponDamage) + attacker.getters.getAbilityModifiers[CONSTS.ABILITY_STRENGTH];
                oAttackOutcome.rollDamages(nAmount, sWeaponDamageType);
            }
            oAttackOutcome.createDamageEffects();
            this.runPropEffectScript(target, 'attacked', {
                attack: oAttackOutcome,
                manager: this
            });
        }
        this._events.emit(CONSTS.EVENT_COMBAT_ATTACK, new CombatAttackEvent({
            system: this._systemInstance,
            attack: oAttackOutcome
        }));
        if (oAttackOutcome.hit) {
            oAttackOutcome.applyDamages();
        }
        return oAttackOutcome;
    }

    /**
     * Processes all registered combats
     */
    processCombats () {
        this._combatManager.processCombats();
    }

    /**
     * Returns creature's current target, if in combat
     * Returns null if not in combat
     * @param oCreature {Creature}
     * @returns {Creature|null}
     */
    getCombatTarget (oCreature) {
        const oCombat = this.getCreatureCombat(oCreature);
        return oCombat ? oCombat.target : null;
    }

    /**
     * return combat instance of a creature, if involved
     * @param oCreature {Creature}
     * @returns {Combat|null}
     */
    getCreatureCombat (oCreature) {
        return this
            .combatManager
            .getCombat(oCreature);
    }

    /**
     * return true if creature is involved in a combat
     * @param oCreature {Creature}
     * @returns {boolean}
     */
    isCreatureFighting (oCreature) {
        return this.getCreatureCombat(oCreature) !== null;
    }

    /**
     * Makes a creature approaching it's target by a certain distance
     * @param oCreature {Creature}
     * @param [nSpeed] {number} number of units of displacement toward target (default is creature speed)
     */
    approachTarget (oCreature, nSpeed = undefined) {
        const oCombat = this.getCreatureCombat(oCreature);
        if (oCombat) {
            oCombat.approachTarget(nSpeed);
        }
    }

    /**
     * Sames as approach but retreat from target instead of approaching
     * @param oCreature {Creature}
     * @param [nSpeed] {number} default is creature natural speed
     */
    retreatFromTarget (oCreature, nSpeed = undefined) {
        const oCombat = this.getCreatureCombat(oCreature);
        if (oCombat) {
            oCombat.retreatFromTarget(nSpeed);
        }
    }

    /**
     * Return the number of currently active combats
     * @return {number}
     */
    getCombatCount () {
        this
            .combatManager
            .combats
            .length;
    }

    /**
     * Selects a new action during fight. After the action finished, creature goes back to weapon fighting
     * @param oCreature {Creature}
     * @param idAction {string}
     */
    selectAction (oCreature, idAction) {
        const oCombat = this.getCreatureCombat(oCreature);
        if (oCombat) {
            oCombat.selectAction(idAction);
        }
    }

    /**
     * Returns the creature current action
     * @param oCreature {Creature}
     * @returns {CombatActionTaken|null}
     */
    getSelectedAction (oCreature) {
        const oCombat = this.getCreatureCombat(oCreature);
        if (oCombat) {
            return oCombat._currentAction;
        } else {
            return null;
        }
    }

    /**
     * Returns all creatures targeting the specified creature.
     * @param oCreature {Creature}
     * @param nRange {number} maximum distance from the specified creature
     * @returns {Creature[]}
     */
    getTargetingCreatures (oCreature, nRange = Infinity) {
        return this.combatManager.getTargetingCreatures(oCreature, nRange);
    }

    /**
     * @param oSubject {Creature}
     * @return {Creature[]}
     */
    getHostileCreatures (oSubject) {
        return this._horde.getSubjectHostileCreatures(oSubject);
    }

    /**
     * @param oSubject {Creature}
     * @returns {Creature[]}
     */
    getFriendlyCreatures (oSubject) {
        return this._horde.getSubjectFriendlyCreatures(oSubject);
    }

    //  ▗▖      ▗▖  ▗▖
    // ▗▛▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▙▟▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘▝▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀

    /**
     * Execute an action when not involved in a combat
     * @param oCreature {Creature}
     * @param oAction {RBSAction}
     * @param oTarget {Creature|null}
     * @param parameters {{}} action parameters
     */
    executeAction (oCreature, oAction, oTarget = null, parameters = {}) {
        const oActionEvent = new CreatureActionEvent({
            system: this._systemInstance,
            creature: oCreature,
            target: oTarget,
            action: oAction
        });
        this._events.emit(CONSTS.EVENT_CREATURE_ACTION, oActionEvent);
        if (oActionEvent.isScriptEnabled) {
            this.runScript(oAction.script, {
                manager: this,
                creature: oCreature,
                target: oTarget,
                action: oAction
            });
        }
        const bIsActionCoolingDown = oAction.cooldown > 0;
        if (bIsActionCoolingDown) {
            this._horde.setCreatureActive(oCreature);
        }
    }

    /**
     *
     * @param oCreature
     * @param sSpell
     * @param oTarget
     * @param freeCast {boolean} if true, and sAction is a spell id, the spell is cast without consuming spell slot
     * @param potion {boolean} if true, and sAction is a spell, the spell is free cast on caster. / should be a non offensive spell
     * @param grenade {boolean} if true, and sAction is a spell, the spell is free cast on target. / should be an offensive spell
     * @private
     * @returns {RBSAction}
     */
    _createSpellAction (oCreature, sSpell, oTarget = null, {
        freeCast = false,
        potion = false,
        grenade = false
    } = {}) {
        if (oTarget === null) {
            oTarget = oCreature;
        }
        const oSpellData = this.getSpellData(sSpell);
        return {
            id: SPECIAL_ACTION_CAST_SPELL,
            requirements: null,
            limited: false,
            actionType: CONSTS.COMBAT_ACTION_TYPE_SPELL,
            cooldown: 0,
            charges: Infinity,
            recharging: false,
            range: oSpellData.range,
            script: () => this.castSpell(
                oSpellData.id,
                oCreature,
                oTarget,
                {
                    freeCast,
                    potion,
                    grenade
                }
            ),
            parameters: {
                spell: oSpellData,
                freeCast,
                potion,
                grenade
            },
            ready: true,
            bonus: false,
            hostile: oSpellData.hostile
        };
    }

    /**
     * Run an action
     * @param oCreature {Creature}
     * @param sAction {string}
     * @param oTarget {Creature}
     * @param freeCast {boolean} if true, and sAction is a spell id, the spell is cast without consuming spell slot
     * @param potion {boolean} if true, and sAction is a spell, the spell is free cast on caster. / should be a non offensive spell
     * @param grenade {boolean} if true, and sAction is a spell, the spell is free cast on target. / should be an offensive spell
     * @return {CombatActionOutcome}
     */
    doAction (oCreature, sAction, oTarget = null, {
        freeCast = false,
        potion = false,
        grenade = false
    } = {}) {
        // check if creature is in combat
        const oCombat = this.combatManager.getCombat(oCreature);
        const bIsSpell = this.getSpellData(sAction);
        // if in combat, and same target as combat target, then use combat action mechanism
        if (oCombat) {
            const oAction = bIsSpell
                ? this._createSpellAction(oCreature, sAction, oTarget, {
                    freeCast,
                    potion,
                    grenade
                })
                : sAction;
            if (oTarget === null || oCombat.target === oTarget) {
                // no target or same target in combat : use combat action mechanism
                return oCombat.selectAction(oAction);
            } else {
                // different target, disengage from combat
                const combat = this.combatManager.startCombat(oCreature, oTarget);
                return combat.selectAction(oAction);
            }
        } else {
            const oAction = bIsSpell
                ? this._createSpellAction(oCreature, sAction, oTarget, {
                    freeCast,
                    potion,
                    grenade
                })
                : oCreature.getters.getActions[sAction];
            // Check if action can be cast
            if (!oAction.ready) {
                // Action fails if not ready
                return new CombatActionFailure(CONSTS.ACTION_FAILURE_REASON_NOT_READY);
            }
            if (oAction.hostile) {
                // Hostile action are only cast during combat
                const combat = this.combatManager.startCombat(oCreature, oTarget);
                return combat.selectAction(oAction);
            } else {
                // non hostile action : go ahead
                this.executeAction(oCreature, oAction, oTarget);
                oCreature.mutations.useAction({ idAction: oAction.id });
                return new CombatActionSuccess();
            }
        }
    }

    // ▗▖ ▄      ▗▖     ▄▖
    // ▐█▟█▗▛▜▖ ▄▟▌▐▌▐▌ ▐▌ ▗▛▜▖▗▛▀▘
    // ▐▌▘█▐▌▐▌▐▌▐▌▐▌▐▌ ▐▌ ▐▛▀▘ ▀▜▖
    // ▝▘ ▀ ▀▀  ▀▀▘ ▀▀▘ ▀▀  ▀▀ ▝▀▀

    /**
     * Adds a module
     * @param blueprints
     * @param scripts
     * @param data
     */
    defineModule ({
        blueprints = {},
        scripts = {},
        data = {}
    }) {
        this._entityBuilder.blueprints = blueprints;
        Object
            .entries(scripts)
            .forEach(([id, script]) => {
                if (id === 'init') {
                    script({manager: this});
                } else {
                    this._scripts[id] = script;
                }
            });
        this._entityBuilder.addData(data);
    }

    /**
     * Loads a module
     * @param sModuleId {string}
     */
    loadModule (sModuleId) {
        return this.defineModule(require(path.resolve(__dirname, 'modules', sModuleId)));
    }


    // ▗▄▄▖     ▗▖  ▗▖  ▗▖  ▗▖
    // ▐▙▄ ▐▛▜▖▝▜▛▘ ▄▖ ▝▜▛▘ ▄▖ ▗▛▜▖▗▛▀▘
    // ▐▌  ▐▌▐▌ ▐▌  ▐▌  ▐▌  ▐▌ ▐▛▀▘ ▀▜▖
    // ▝▀▀▘▝▘▝▘  ▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▀▀

    /**
     * Creates a new Entity
     * @param resref {string}
     * @param id {string}
     * @returns {Creature|RBSItem}
     */
    createEntity (resref, id = '') {
        const oEntity = this._entityBuilder.createEntity(resref, id);
        if (oEntity instanceof Creature) {
            for (let i = 1; i <= oEntity.getters.getUnmodifiedLevel; ++i) {
                this.evolution.setupLevel(this, oEntity, i);
            }
            this._horde.linkCreature(oEntity);
            oEntity.events.on(CONSTS.EVENT_CREATURE_SELECT_WEAPON, evt => {
                this._events.emit(CONSTS.EVENT_CREATURE_SELECT_WEAPON, new CreatureSelectWeaponEvent({
                    system: this._systemInstance,
                    creature: oEntity
                }));
            });
            oEntity.events.on(CONSTS.EVENT_CREATURE_REVIVE, evt => {
                this._events.emit(CONSTS.EVENT_CREATURE_REVIVE, new CreatureReviveEvent({
                    system: this._systemInstance,
                    creature: oEntity
                }));
            });
            oEntity.events.on(CONSTS.EVENT_CREATURE_SAVING_THROW, evt => {
                this._events.emit(CONSTS.EVENT_CREATURE_SAVING_THROW, new CreatureSavingThrowEvent({
                    system: this._systemInstance,
                    creature: oEntity,
                    roll: evt.roll,
                    dc: evt.dc,
                    success: evt.success,
                    bonus: evt.bonus,
                    ability: evt.ability
                }));
            });
            oEntity.events.on(CONSTS.EVENT_CREATURE_DAMAGED, evt => {
                const {
                    source,
                    amount,
                    resisted,
                    damageType
                } = evt;
                this._events.emit(CONSTS.EVENT_CREATURE_DAMAGED, new CreatureDamagedEvent({
                    system: this._systemInstance,
                    creature: oEntity,
                    source,
                    amount,
                    resisted,
                    damageType
                }));
                this.runPropEffectScript(oEntity, 'damaged', {
                    damageType,
                    amount,
                    resisted,
                    manager: this,
                    creature: oEntity,
                    source
                });
            });
            oEntity.events.on(CONSTS.EVENT_CREATURE_DEATH, evt => {
                this._events.emit(CONSTS.EVENT_CREATURE_DEATH, new CreatureDeathEvent({
                    system: this._systemInstance,
                    creature: oEntity,
                    killer: evt.killer
                }));
            });
            oEntity.events.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM, evt => {
                this._events.emit(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                    system: this._systemInstance,
                    creature: oEntity,
                    ...evt
                });
                if (this._horde.isCreatureActive(oEntity)) {
                    this._horde.setCreatureActive(oEntity);
                }
            });
            oEntity.events.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM, evt => this._events.emit(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                system: this._systemInstance,
                creature: oEntity,
                ...evt
            }));
            oEntity.events.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, evt => this._events.emit(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, {
                system: this._systemInstance,
                creature: oEntity,
                ...evt
            }));
            if (this._horde.isCreatureActive(oEntity)) {
                this._horde.setCreatureActive(oEntity);
            }
            oEntity.events.on(CONSTS.EVENT_CREATURE_LEVEL_UP, evt => {
                this.evolution.levelUp(this, oEntity);
                this._events.emit(CONSTS.EVENT_CREATURE_LEVEL_UP, {
                    ...evt,
                    system: this._systemInstance,
                    creature: oEntity
                });
            });
        }
        return oEntity;
    }

    /**
     * Destroy an entity
     * @param oEntity
     */
    destroyEntity (oEntity) {
        if (oEntity instanceof Creature) {
            this._combatManager.removeFighter(oEntity);
            this._horde.unlinkCreature(oEntity);
        }
    }

    processEntities () {
        this
            ._horde
            .activeCreatures
            .map(creature => {
                creature.mutations.rechargeActions();
                creature.mutations.rechargeSpellSlots();
                creature.getters.getActiveProperties.forEach(property => {
                    this.runPropertyScript(creature, 'mutate', {});
                });
                return creature.getters.getEffects;
            })
            .flat()
            .forEach(effect => {
                this._effectProcessor.processEffect(effect);
            });
        this._horde.shrinkActiveCreatureRegistry();
    }

    /**
     * Will remove dead effects (effects with duration <= 0 && depletionDelay <= 0)
     */
    processDeadEffects () {
        this
            ._horde
            .activeCreatures
            .forEach(creature => {
                const cm = creature.mutations;
                const cg = creature.getters;
                cm.depleteEffects();
                cg.getDeadEffects.forEach(effect => {
                    cm.removeEffect({ effect });
                });
            });

    }

    /**
     * Returns the distance between two entities
     * - Creature not in combat is at defaultDistance
     * - Creature in combat is at combat.distance
     * @param oCreature1 {Creature}
     * @param oCreature2 {Creature}
     * @return {number}
     */
    getCreatureDistance (oCreature1, oCreature2) {
        if (oCreature2 === oCreature1) {
            return 0;
        }
        const cm = this.combatManager;
        if (cm.isCreatureFighting(oCreature1, oCreature2)) {
            return cm.getCombat(oCreature1).distance;
        }
        if (cm.isCreatureFighting(oCreature2, oCreature1)) {
            return cm.getCombat(oCreature2).distance;
        }
        // creatures are not fighting each other
        return cm.defaultDistance;
    }

    /**
     * Returns a creature level
     * @param oCreature {Creature}
     * @return {number}
     */
    getCreatureLevel (oCreature) {
        return oCreature.getters.getLevel;
    }

    //  ▄▄          ▗▖      ▗▖
    // ▝▙▄ ▗▛▀ ▐▛▜▖ ▄▖ ▐▛▜▖▝▜▛▘▗▛▀▘
    //   ▐▌▐▌  ▐▌   ▐▌ ▐▙▟▘ ▐▌  ▀▜▖
    //  ▀▀  ▀▀ ▝▘   ▀▀ ▐▌    ▀▘▝▀▀

    runPropertyScript(oCreature, sScript, oParams) {
        const pb = this._entityBuilder.propertyBuilder;
        const gsp = oCreature.getters.getSlotProperties;
        const eq = oCreature.getters.getEquipment;
        const oParamAndManager = { ...oParams, manager: this };
        for (const [slot, aProps] of Object.entries(gsp)) {
            const aProps = gsp[slot];
            const oItem = eq[slot];
            aProps.forEach(prop => {
                pb.invokePropertyMethod(prop, sScript, oItem, oCreature, oParamAndManager);
            });
        }
        oCreature.getters.getInnateProperties.forEach(prop => {
            pb.invokePropertyMethod(prop, sScript, null, oCreature, oParamAndManager);
        });
    }

    /**
     * This function will run any script associated with current effects or properties
     * @param oCreature {Creature}
     * @param sScript {string}
     * @param oParams {{}}
     */
    runPropEffectScript(oCreature, sScript, oParams) {
        const ep = this._effectProcessor;
        const h = this._horde;
        for (const effect of oCreature.getters.getEffects) {
            const source = h.getCreature(effect.source);
            ep.invokeEffectMethod(effect, sScript, oCreature, source, oParams);
        }
        this.runPropertyScript(oCreature, sScript, oParams);
    }

    /**
     * Runs a registered script
     * @param script {string|function}
     * @param params {{}}
     */
    runScript (script, ...params) {
        if (typeof script === 'function') {
            script(...params);
        } else if (script in this._scripts) {
            this._scripts[script](...params);
        } else {
            throw new Error(`script ${script} not found.`);
        }
    }


    //  ▄▄
    // ▐▌▝▘▗▛▜▖▐▛▜▖▗▛▜▖
    // ▐▌▗▖▐▌▐▌▐▌  ▐▛▀▘
    //  ▀▀  ▀▀ ▝▘   ▀▀

    process () {
        if ((this._time % this._combatManager.defaultTickCount) === 0) {
            // Processing entities each turn begin
            this.processEntities();
        }
        this.processCombats();
        this.processDeadEffects();
        ++this._time;
    }

    /**
     * Returns parameter if is a Creature
     * @param oEntity {Creature|RBSItem|null}
     * @returns {Creature}
     */
    isCreature (oEntity) {
        return checkEntityCreature(oEntity);
    }

    /**
     * Returns parameter if is a RBSItem
     * @param oEntity {Creature|RBSItem|null}
     * @returns {RBSItem}
     */
    isItem (oEntity) {
        return checkEntityItem(oEntity);
    }


    // ▗▖ ▄         ▗▖          ▟▜▖     ▄▄          ▄▖  ▄▖                  ▗▖  ▗▖
    // ▐█▟█ ▀▜▖▗▛▜▌ ▄▖ ▗▛▀      ▟▛     ▝▙▄ ▐▛▜▖▗▛▜▖ ▐▌  ▐▌     ▗▛▀  ▀▜▖▗▛▀▘▝▜▛▘ ▄▖ ▐▛▜▖▗▛▜▌
    // ▐▌▘█▗▛▜▌▝▙▟▌ ▐▌ ▐▌      ▐▌▜▛      ▐▌▐▙▟▘▐▛▀▘ ▐▌  ▐▌     ▐▌  ▗▛▜▌ ▀▜▖ ▐▌  ▐▌ ▐▌▐▌▝▙▟▌
    // ▝▘ ▀ ▀▀▘▗▄▟▘ ▀▀  ▀▀      ▀▘▀     ▀▀ ▐▌   ▀▀  ▀▀  ▀▀      ▀▀  ▀▀▘▝▀▀   ▀▘ ▀▀ ▝▘▝▘▗▄▟▘

    /**
     * @typedef RBSSpellData {object}
     * @property [id] {string}
     * @property school {string}
     * @property level {number}
     * @property description {string}
     * @property range {number}
     * @property hostile {boolean}
     * @property target {string}
     * @property script {string}
     *
     * Retrieve spell associated data
     * @param sSpellId {string}
     * @return {RBSSpellData}
     */
    getSpellData (sSpellId) {
        const sSpellDataConstName = 'SPELL_' + sSpellId.toUpperCase().replace(/-/g, '_');
        const oSpellDataRegistry = this.data['SPELLS'];
        if (!oSpellDataRegistry) {
            return null;
        }
        const oSpellData = this.data['SPELLS'][sSpellDataConstName];
        if (!oSpellData) {
            return null;
        }
        return {
            id: sSpellId,
            ...oSpellData
        };
    }

    /**
     * Casts a spell
     * @param sSpellId {string} spell identifier
     * @param caster {Creature} creature casting the spell
     * @param target {Creature} spell primary target
     * @param parameters {{}}
     * @returns {{success: boolean, reason: string}}
     */
    castSpell (sSpellId, caster, target = null, parameters = {}) {
        const {
            freeCast = false,
            grenade = false,
            potion = false
        } = parameters;
        const sd = this.getSpellData(sSpellId);
        if (!sd) {
            // Spell not found : error
            throw new Error(`ERR_CAST_SPELL_NOT_FOUND: ${sSpellId}`);
        }
        // check if spell can be cast
        const ssl = caster.getters.getSpellSlots[sd.level];
        if (!ssl.ready && !freeCast) {
            return {
                success: false,
                reason: CONSTS.ACTION_FAILURE_REASON_NOT_READY
            };
        }
        // force target to caster if spell is self cast only
        target = sd.target === CONSTS.SPELL_CAST_TARGET_TYPE_SELF
            ? caster
            : (target ?? caster);

        const cc = caster.getters.getCapabilitySet;
        if (!potion && !grenade) {
            if (!cc.has(CONSTS.CAPABILITY_CAST_SELF) && target === caster) {
                // Cannot cast spell because targeting self is disabled at the time
                return {
                    success: false,
                    reason: CONSTS.ACTION_FAILURE_REASON_CAPABILITY
                };
            }
            if (!cc.has(CONSTS.CAPABILITY_CAST_TARGET) && target !== caster) {
                // Cannot cast spell because targeting a creature is disabled at the time
                return {
                    success: false,
                    reason: CONSTS.ACTION_FAILURE_REASON_CAPABILITY
                };
            }
        }
        const nDistance = this.getCreatureDistance(caster, target);
        if (sd.target === CONSTS.SPELL_CAST_TARGET_TYPE_HOSTILE) {
            if (sd.range < nDistance) {
                // spell casting out of range
                return {
                    success: false,
                    reason: CONSTS.ACTION_FAILURE_REASON_RANGE
                };
            }
        }
        if (sd.hostile && !this.combatManager.isCreatureFighting(target)) {
            this.startCombat(caster, target);
        }
        this.runScript(sd.script, {
            manager: this,
            caster,
            target,
            spell: this.getSpellData(sSpellId),
            ...parameters
        });
        return {
            success: true,
            reason: ''
        };
    }
}

module.exports = Manager;
