const EntityBuilder = require('./EntityBuilder')
const EffectProcessor = require('./EffectProcessor')
const Horde = require('./Horde')
const CombatManager = require('./libs/combat/CombatManager')
const Events = require('events')
const SCHEMAS = require('./schemas')
const SchemaValidator = require('./SchemaValidator')
const Creature = require('./Creature')
const { deepMerge, deepClone } = require('@laboralphy/object-fusion')
const DATA = require('./data')
const path = require('path')

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
        this._data = deepClone(DATA)
        cm.events.on('combat.action', evt => this._combatManagerAction(evt))
        ep.events.on('effect-applied', ev => this._effectApplied(ev))
        ep.events.on('effect-immunity', ev => this._effectImmunity(ev))
        ep.events.on('effect-disposed', ev => this._effectDisposed(ev))
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
     * A new effect has been applied on a creatures. The manager must keep track of this effect if duration is > 0
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @param source {Creature}
     */
    _effectApplied({effect, target, source}) {
        this._events.emit('creature.effect.applied', {manager: this, effect, target, source})
    }

    /**
     * an effect could not be applied to target because of effect immunity
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @private
     */
    _effectImmunity({effect, target}) {
        this._events.emit('creature.effect.immunity', {manager: this, effect, target})
    }

    /**
     * An effect has expired (duration reached 0)
     * @param effect {RBSEffect}
     * @param target {Creature}
     * @param source {Creature}
     */
    _effectDisposed({effect, target, source}) {
        this._events.emit('creature.effect.disposed', {manager: this, effect, target, source})
    }

    _combatManagerAction (evt) {
        const bIsActionCoolingDown = evt.action.cooldownTimer > 0
        const bIsActionChargeDepleted = evt.action.dailyCharges > 0 && evt.action.charges === 0
        if (bIsActionCoolingDown || bIsActionChargeDepleted) {
            this._horde.setCreatureActive(evt.attacker)
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
        deepMerge(this._data, data)
    }

    /**
     * Loads a module
     * @param sModuleId {string}
     */
    loadModule (sModuleId) {
        this.defineModule(require(path.join('modules' + sModuleId)))
    }

    createEntity (resref, id) {
        const oEntity = this._entityBuilder.createEntity(resref, id)
        if (oEntity instanceof Creature) {
            this._horde.linkCreature(oEntity)
        }
        return oEntity
    }

    destroyEntity (oEntity) {
        if (oEntity instanceof Creature) {
            this._horde.unlinkCreature(oEntity)
        }
    }

    processEntities () {
        this
            ._horde
            .activeCreatures
            .map(creature => {
                creature.mutations.coolActionsDown()
                return creature.getters.getEffects
            })
            .flat()
            .forEach(effect => {
                this._effectProcessor.processEffect(effect)
            })
        this._combatManager.processCombats()
        this._horde.shrinkActiveCreatureRegistry()
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
        for (const slot of gsp) {
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
}

module.exports = Manager
