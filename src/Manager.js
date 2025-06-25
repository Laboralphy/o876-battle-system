const EntityBuilder = require('./EntityBuilder');
const EffectProcessor = require('./EffectProcessor');
const Horde = require('./Horde');
const CombatManager = require('./libs/combat/CombatManager');
const CombatActionFailure = require('./libs/combat/CombatActionFailure');
const CombatActionSuccess = require('./libs/combat/CombatActionSuccess');
const Events = require('events');
const SCHEMAS = require('./schemas');
const SchemaValidator = require('./SchemaValidator');
const Creature = require('./Creature');
const path = require('path');
const AttackOutcome = require('./AttackOutcome');
const CONSTS = require('./consts');
const { aggregateModifiers } = require('./libs/aggregator');
const PropertyBuilder = require('./PropertyBuilder');
const baseModule = require('./modules/base');
const Evolution = require('./Evolution');

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
        if(!this._effectProcessor) throw new Error('EffectProcessor not found');
        return this._effectProcessor;
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
     * return instance of combat manager
     * @returns {CombatManager}
     */
    get combatManager () {
        return this._combatManager;
    }

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
     * Execute an action when not involved in a combat
     * @param oCreature {Creature}
     * @param oAction {RBSAction}
     * @param oTarget {Creature|null}
     */
    executeAction (oCreature, oAction, oTarget = null) {
        const oActionEvent = new CreatureActionEvent({
            system: this._systemInstance,
            creature: oCreature,
            target: oTarget,
            action: oAction
        });
        this._events.emit(CONSTS.EVENT_CREATURE_ACTION, oActionEvent);
        this.runScript(oAction.script, {
            manager: this,
            action: oAction,
            creature: oCreature,
            target: oTarget
        });
        const bIsActionCoolingDown = oAction.cooldownTimer > 0;
        if (bIsActionCoolingDown) {
            this._horde.setCreatureActive(oCreature);
        }
        oCreature.mutations.useAction({ action: oAction.id });
    }

    /**
     * Run an action
     * @param oCreature {Creature}
     * @param sAction {string}
     * @param oTarget {Creature}
     * @return {CombatActionOutcome}
     */
    doAction (oCreature, sAction, oTarget = null) {
        // check if creature is in combat
        const oCombat = this.combatManager.getCombat(oCreature);
        // if in combat, and same target as combat target, then use combat action mechanism
        if (oCombat) {
            if (oTarget === null || oCombat.target === oTarget) {
                // no target or same target in combat : use combat action mechanism
                return oCombat.selectAction(sAction);
            } else {
                // different target, disengage from combat
                const combat = this.combatManager.startCombat(oCreature, oTarget);
                return combat.selectAction(sAction);
            }
        } else {
            const oAction = oCreature.getters.getActions[sAction];
            // Check if action can be cast
            if (!oAction.ready) {
                // Action fails if not ready
                return new CombatActionFailure(CONSTS.ACTION_FAILURE_REASON_NOT_READY);
            }
            if (oAction.hostile) {
                // Hostile action are only cast during combat
                const combat = this.combatManager.startCombat(oCreature, oTarget);
                return combat.selectAction(sAction);
            } else {
                // non hostile action : go ahead
                this.executeAction(oCreature, oAction, oTarget);
                return new CombatActionSuccess();
            }
        }
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
            .combatManager
            .getOffenders(oAttacker)
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
                    this.deliverAttack(oAttacker, aOffenders[iRank]);
                    iRank = (iRank + 1) % aOffenders.length;
                }
            }
            this.deliverAttack(oAttacker, oTarget, { opportunity });
        }
    }

    /**
     * Do an attack between attacker and target
     * @param attacker {Creature}
     * @param target {Creature}
     * @param opportunity {boolean}
     * @param additionalWeaponDamage {number|string}
     */
    deliverAttack (attacker, target, {
        opportunity = false,
        additionalWeaponDamage = 0
    } = {}) {
        const oAttackOutcome = new AttackOutcome({ manager: this });
        oAttackOutcome.attacker = attacker;
        oAttackOutcome.opportunity = opportunity;
        oAttackOutcome.target = target;
        oAttackOutcome.computeAttackParameters();
        oAttackOutcome.computeDefenseParameters();
        oAttackOutcome.rush = additionalWeaponDamage !== 0;
        oAttackOutcome.attack();
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
                this._scripts[id] = script;
            });
        this._entityBuilder.addData(data);
    }

    runScript (sScript, ...params) {
        if (sScript in this._scripts) {
            this._scripts[sScript](...params);
        } else {
            throw new Error(`script ${sScript} not found.`);
        }
    }

    /**
     * @returns {Map<string, any>}
     */
    get blueprints () {
        return this._entityBuilder.blueprints;
    }

    /**
     * Loads a module
     * @param sModuleId {string}
     */
    loadModule (sModuleId) {
        this.defineModule(require(path.resolve(__dirname, 'modules', sModuleId)));
    }

    /**
     * Creates a new Entity
     * @param resref {string}
     * @param id {string}
     * @returns {Creature|RBSItem}
     */
    createEntity (resref, id = '') {
        const oEntity = this._entityBuilder.createEntity(resref, id);
        if (oEntity instanceof Creature) {
            for (let i = 0; i < oEntity.getters.getUnmodifiedLevel; ++i) {
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

    processCombats () {
        this._combatManager.processCombats();
    }

    process () {
        if ((this._time % this._combatManager.defaultTickCount) === 0) {
            // Processing entities each turn begin
            this.processEntities();
        }
        this.processCombats();
        ++this._time;
    }

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
     * Starts a combat between c1 & c2
     * @param c1 {Creature}
     * @param c2 {Creature}
     * @returns {Combat}
     */
    startCombat (c1, c2) {
        return this._combatManager.startCombat(c1, c2);
    }

    /**
     * Creates an effect
     * @param sEffect {string}
     * @param amp {number|string}
     * @param data {Object<string, *>}
     */
    createEffect (sEffect, amp = 0, data = {}) {
        return this._effectProcessor.createEffect(sEffect, amp, data);
    }

    /**
     * Create an effect with subtype preset to SUPERNATURAL
     * This effect is not magical and not produced by natural means of creatures.
     * It can't be removed by 'dispel magic'
     * It must be removed by specific means like 'remove curse' or 'restoration'
     * @param sEffect {string}
     * @param amp {number|string}
     * @param data {Object<string, *>}
     * @return {RBSEffect}
     */
    createSupernaturalEffect (sEffect, amp = 0, data = {}) {
        return this.createEffect(sEffect, amp, { ...data, subtype: CONSTS.EFFECT_SUBTYPE_SUPERNATURAL });
    }

    /**
     * Create an effect with subtype preset to EXTRAORDINARY
     * This effect is neither magical nor supernatural.
     * This effect is typically produced by creature with some extraordinary natural abilities.
     * As impressive as it may be, this effect is nevertheless natural, and cannot be dispelled by any mean.
     * Just like supernatural effect, extraordinary effects can only be removed by specialized means.
     * @param sEffect {string}
     * @param amp {number|string}
     * @param data {Object<string, *>}
     * @return {RBSEffect}
     */
    createExtraordinaryEffect (sEffect, amp = 0, data = {}) {
        return this.createEffect(sEffect, amp, { ...data, subtype: CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY });
    }

    /**
     * Applies an effect to a creature
     * @param oEffect {RBSEffect}
     * @param oTarget {Creature}
     * @param duration {number}
     * @param oSource {Creature|null}
     * @returns {RBSEffect}
     */
    applyEffect (oEffect, oTarget, duration = 0, oSource = null) {
        return this._effectProcessor.applyEffect(oEffect, oTarget, duration, oSource);
    }

    get evolution () {
        if (!this._evolution) {
            this._evolution = new Evolution({ data: this.data });
        }
        return this._evolution;
    }

    increaseCreatureExperience (oCreature, nXP) {
        this.evolution.gainXP(oCreature, nXP);
    };
}

module.exports = Manager;
