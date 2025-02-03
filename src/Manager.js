const EntityBuilder = require('./EntityBuilder')
const EffectProcessor = require('./EffectProcessor')
const Horde = require('./Horde')
const CombatManager = require('./libs/combat/CombatManager')
const Events = require('events')
const SCHEMAS = require('./schemas')
const SchemaValidator = require('./SchemaValidator')
const Creature = require('./Creature')
const { deepMerge, deepClone } = require('@laboralphy/object-fusion')
const path = require('path')
const AttackOutcome = require('./AttackOutcome')
const CONSTS = require('./consts')
const { loadData } = require('./store')

class Manager {
    constructor () {
        this._events = new Events()
        this._horde = new Horde()
        const eb = new EntityBuilder()
        const sv = new SchemaValidator()
        sv.schemaIndex = SCHEMAS
        sv.init()
        eb.schemaValidator = sv
        const ep = new EffectProcessor({ horde: this._horde })
        const cm = new CombatManager()
        this._entityBuilder = eb
        this._effectProcessor = ep
        this._combatManager = cm
        this._scripts = {}
        this._time = 0
        cm.events.on(CONSTS.EVENT_COMBAT_TURN, evt => this._combatManagerTurn(evt))
        cm.events.on(CONSTS.EVENT_COMBAT_START, evt => this._events.emit(CONSTS.EVENT_COMBAT_START, evt))
        cm.events.on(CONSTS.EVENT_COMBAT_END, evt => this._events.emit(CONSTS.EVENT_COMBAT_END, evt))
        cm.events.on(CONSTS.EVENT_COMBAT_MOVE, evt => this._events.emit(CONSTS.EVENT_COMBAT_MOVE, evt))
        cm.events.on(CONSTS.EVENT_COMBAT_DISTANCE, evt => this._events.emit(CONSTS.EVENT_COMBAT_DISTANCE, evt))
        cm.events.on(CONSTS.EVENT_COMBAT_ACTION, evt => this._combatManagerAction(evt))
        cm.events.on(CONSTS.EVENT_COMBAT_ATTACK, evt => this._combatManagerAttack(evt))
        ep.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, evt => this._effectApplied(evt))
        ep.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, evt => this._effectImmunity(evt))
        ep.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED, evt => this._effectDisposed(evt))
    }

    get CONSTS () {
        return CONSTS
    }

    /**
     * @returns {EffectProcessor}
     */
    get effectProcessor () {
        return this._effectProcessor
    }

    /**
     * @returns {Horde}
     */
    get horde () {
        return this._horde
    }

    get events () {
        return this._events
    }

    /**
     * return instance of combat manager
     * @returns {CombatManager}
     */
    get combatManager () {
        return this._combatManager
    }

    /**
     * A new effect has been applied on a creatures. The manager must keep track of this effect if duration is > 0
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @param source {Creature}
     */
    _effectApplied({effect, target, source}) {
        this._events.emit(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, { manager: this, effect, creature: target, source })
    }

    /**
     * an effect could not be applied to target because of effect immunity
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @private
     */
    _effectImmunity({effect, target}) {
        this._events.emit(CONSTS.EVENT_CREATURE_EFFECT_IMMUNITY, { manager: this, effect, creature: target })
    }

    /**
     * An effect has expired (duration reached 0)
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @param source {Creature}
     */
    _effectDisposed({effect, target, source}) {
        this._events.emit(CONSTS.EVENT_CREATURE_EFFECT_DISPOSED, {manager: this, effect, creature: target, source})
    }

    _combatManagerTurn (evt) {
        const {
            action,
            combat
        } = evt
        this.runPropEffectScript(combat.attacker, 'combatTurn', evt)
        this._events.emit(CONSTS.EVENT_COMBAT_TURN, evt)
    }

    /**
     * Initiate a combat action.
     * Must run the script associated with this action
     * @param evt
     * @private
     */
    _combatManagerAction (evt) {
        this._events.emit(CONSTS.EVENT_COMBAT_ACTION, evt)
        const {
            action,
            combat,
            attacker
        } = evt
        // Lancement de l'action
        if (!action) {
            throw new Error(`combat action is null or undefined`)
        }
        this.runScript(action.script, { manager: this, combat, action })
        const bIsActionCoolingDown = action.cooldownTimer > 0
        if (bIsActionCoolingDown) {
            this._horde.setCreatureActive(attacker)
        }
    }

    /**
     * Do an attack between attacker and target
     * @param attacker
     * @param target
     */
    deliverAttack (attacker, target) {
        const oAttackOutcome = new AttackOutcome({ effectProcessor: this._effectProcessor })
        oAttackOutcome.attacker = attacker
        oAttackOutcome.target = target
        oAttackOutcome.computeAttackParameters()
        oAttackOutcome.computeDefenseParameters()
        oAttackOutcome.attack()
        if (oAttackOutcome.hit) {
            oAttackOutcome.createDamageEffects()
            this.runPropEffectScript(attacker, 'attack', {
                attack: oAttackOutcome,
                manager: this
            })
            this.runPropEffectScript(target, 'attacked', {
                attack: oAttackOutcome,
                manager: this
            })
        }
        this._events.emit(CONSTS.EVENT_COMBAT_ATTACK, {
            attack: oAttackOutcome,
        })
        if (oAttackOutcome.hit) {
            oAttackOutcome.applyDamages()
            Object.entries(oAttackOutcome.damages.types).forEach(([damageType, { amount, resisted }]) => {
                this.runPropEffectScript(target, 'damaged', {
                    damageType,
                    amount,
                    resisted,
                    manager: this,
                    creature: oAttackOutcome.target,
                    source: oAttackOutcome.attacker
                })
            })
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
        } = evt
        for (let i = 0; i < count; ++i) {
            this.deliverAttack(combat.attacker, combat.target)
        }
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
        this._entityBuilder.blueprints = blueprints
        Object
            .entries(scripts)
            .forEach(([id, script]) => {
                this._scripts[id] = script
            })
        loadData(data)
    }

    runScript (sScript, ...params) {
        if (sScript in this._scripts) {
            this._scripts[sScript](...params)
        } else {
            throw new Error(`script ${sScript} not found.`)
        }
    }

    get blueprints () {
        return this._entityBuilder.blueprints
    }

    /**
     * Loads a module
     * @param sModuleId {string}
     */
    loadModule (sModuleId) {
        this.defineModule(require(path.resolve(__dirname, 'modules', sModuleId)))
    }

    /**
     * Creates a new Entity
     * @param resref {string}
     * @param id {string}
     * @returns {Creature|RBSItem}
     */
    createEntity (resref, id) {
        const oEntity = this._entityBuilder.createEntity(resref, id)
        if (oEntity instanceof Creature) {
            this._horde.linkCreature(oEntity)
            oEntity.events.on(CONSTS.EVENT_CREATURE_SELECT_WEAPON, evt => this._events.emit(CONSTS.EVENT_CREATURE_SELECT_WEAPON, { creature: oEntity, ...evt }))
            oEntity.events.on(CONSTS.EVENT_CREATURE_REVIVE, evt => this._events.emit(CONSTS.EVENT_CREATURE_REVIVE, { creature: oEntity, ...evt }))
            oEntity.events.on(CONSTS.EVENT_CREATURE_SAVING_THROW, evt => this._events.emit(CONSTS.EVENT_CREATURE_SAVING_THROW, { creature: oEntity, ...evt }))
            oEntity.events.on(CONSTS.EVENT_CREATURE_DAMAGED, evt => this._events.emit(CONSTS.EVENT_CREATURE_DAMAGED, { creature: oEntity, ...evt }))
            oEntity.events.on(CONSTS.EVENT_CREATURE_DEATH, evt => this._events.emit(CONSTS.EVENT_CREATURE_DEATH, { creature: oEntity, ...evt }))
        }
        return oEntity
    }

    /**
     * Destroy an entity
     * @param oEntity
     */
    destroyEntity (oEntity) {
        if (oEntity instanceof Creature) {
            this._combatManager.removeFighter(oEntity)
            this._horde.unlinkCreature(oEntity)
        }
    }

    processEntities () {
        this
            ._horde
            .activeCreatures
            .map(creature => {
                creature.mutations.rechargeActions()
                return creature.getters.getEffects
            })
            .flat()
            .forEach(effect => {
                this._effectProcessor.processEffect(effect)
            })
        this._horde.shrinkActiveCreatureRegistry()
    }

    processCombats () {
        this._combatManager.processCombats()
    }

    process () {
        if ((this._time % this._combatManager.defaultTickCount) === 0) {
            // Processing entities each turn begin
            this.processEntities()
        }
        this.processCombats()
        ++this._time
    }

    /**
     * This function will run any script associated with current effects or properties
     * @param oCreature {Creature}
     * @param sScript {string}
     * @param oParams {{}}
     */
    runPropEffectScript(oCreature, sScript, oParams) {
        const ep = this._effectProcessor
        const h = this._horde
        for (const effect of oCreature.getters.getEffects) {
            const source = h.creatures[effect.source]
            ep.invokeEffectMethod(effect, sScript, oCreature, source, oParams)
        }
        const pb = this._entityBuilder.propertyBuilder
        const gsp = oCreature.getters.getSlotProperties
        const eq = oCreature.getters.getEquipment
        for (const [slot, aProps] of Object.entries(gsp)) {
            const aProps = gsp[slot]
            const oItem = eq[slot]
            aProps.forEach(prop => {
                pb.invokePropertyMethod(prop, sScript, oItem, oCreature, oParams)
            })
        }
        oCreature.getters.getInnateProperties.forEach(prop => {
            pb.invokePropertyMethod(prop, sScript, null, oCreature, oParams)
        })
    }

    /**
     * Starts a commbat beetween c1 & c2
     * @param c1 {Creature}
     * @param c2 {Creature}
     * @returns {Combat}
     */
    startCombat (c1, c2) {
        return this._combatManager.startCombat(c1, c2)
    }

    /**
     * Creates an effect
     * @param sEffect {string}
     * @param amp {number}
     * @param data {{}}
     */
    createEffect (sEffect, amp = 0, data = {}) {
        return this._effectProcessor.createEffect(sEffect, amp, data)
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
        return this._effectProcessor.applyEffect(oEffect, oTarget, duration, oSource)
    }
}

module.exports = Manager
