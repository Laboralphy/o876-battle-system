const Events = require('events')
const { getUniqueId } = require('../unique-id')
const CombatFighterState = require('./CombatFighterState')
const CONSTS = require("../../consts");

const NATURAL_SLOTS = new Set([
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3
])

class Combat {
    constructor ({ distance = 0, tickCount }) {
        this._id = getUniqueId()
        /**
         * The state of attacking creature
         * @type {CombatFighterState}
         * @private
         */
        this._attackerState = null
        /**
         * Instance of the targetted creature
         * @type {Creature}
         * @private
         */
        this._target = null
        /**
         * Number of elapsed combat turn
         * @type {number}
         * @private
         */
        this._turn = 0
        /**
         * Index of the tick
         * @type {number}
         * @private
         */
        this._tick = 0
        this._tickCount = tickCount
        /**
         *
         * @type {module:events.EventEmitter | module:events.EventEmitter<DefaultEventMap>}
         * @private
         */
        this._events = new Events()
        this._distance = distance
        /**
         * @type {string}
         * @private
         */
        this._nextAction = ''
        this._currentAction = ''
    }

    get id () {
        return this._id
    }

    /**
     * return the turn index (elapsed turn count)
     * @returns {number}
     */
    get turn () {
        return this._turn
    }

    /**
     * set the turn index
     * @param value {number}
     */
    set turn (value) {
        this._turn = value
    }

    /**
     * return current tick index
     * @returns {number}
     */
    get tick () {
        return this._tick
    }

    /**
     * Set the current tick index in combat turn
     * @param value {number}
     */
    set tick (value) {
        this._tick = value
    }

    /**
     * returns nimber of ticks in a combat turn
     * @return {number}
     */
    get tickCount () {
        return this._tickCount
    }

    /**
     * Define how many ticks in a combat turn (default 6)
     * @param value {number}
     */
    set tickCount (value) {
        this._tickCount = Math.max(1, value)
    }

    get events () {
        return this._events
    }

    /**
     * Return attacking creature state instance
     * @returns {CombatFighterState}
     */
    get attackerState () {
        return this._attackerState
    }

    /**
     * return attacking creature instance
     * @return {Creature}
     */
    get attacker () {
        return this._attackerState.creature
    }

    /**
     * Return defending creature instance
     * @returns {Creature}
     */
    get target () {
        return this._target
    }

    /**
     * Returns a default payload template to be sent by events
     * @returns {{ combat: Combat }}
     */
    get eventDefaultPayload () {
        return {
            combat: this
        }
    }

    /**
     * Define new distance between attacker and target
     * @param value {number}
     */
    set distance (value) {
        const nOldDistance = this._distance
        if (nOldDistance !== value) {
            this._distance = Math.max(0, value)
            this._events.emit(CONSTS.EVENT_COMBAT_DISTANCE, {
                ...this.eventDefaultPayload,
                distance: this._distance,
                previousDistance: nOldDistance
            })
        }
    }

    /**
     * @returns {RBSAction | null}
     */
    get currentAction () {
        if (this._currentAction === '') {
            return null
        }
        if (this._currentAction in this._attackerState.actions) {
            return this._attackerState.actions[this._currentAction]
        }
        const aActionList = Object.keys(this._attackerState.actions).join(', ')
        throw new Error(`this action ${this._currentAction} does not exists in action list ${aActionList}`)
    }

    /**
     * Select a new action
     * @param value {string}
     */
    selectCurrentAction (value) {
        console.log('selectAction', this.attacker.id, value)
        if (value === '') {
            this._currentAction = ''
        } else if (value in this._attackerState.actions) {
            this._currentAction = value
        } else {
            throw new Error(`Action ${value} is unknown for this creature - allowed values are : ` + Object.keys(this._attackerState.actions).join(', '))
        }
    }

    notifyTargetApproach (distance) {
        this._distance = distance
    }

    /**
     * returns distance between attacker and target
     * @returns {number}
     */
    get distance () {
        return this._distance
    }

    /**
     * Define combat creatures
     * @param attacker {Creature}
     * @param target {Creature}
     */
    setFighters (attacker, target) {
        // TODO compute initiative here
        this._attackerState = new CombatFighterState()
        this._attackerState.creature = attacker
        this._target = target
    }

    /**
     * Advance one tick
     */
    nextTick () {
        ++this._tick
        const ttc = this._tickCount
        if (this._tick >= ttc) {
            this._tick = 0
            ++this._turn
        }
    }

    /**
     * trigger a combat action.
     * The system must repsond to this event in order to make a creature attack or take action
     * @param bPartingShot {boolean} si true alors attaque d'opportunité
     */
    playFighterAction (bPartingShot = false) {
        const attackerState = this._attackerState
        // If no current action then we are attacking during this turn
        if (this._tick === 0) {
            console.log('TICK 0', this.attacker.id, this.currentAction?.id)
            const action = this.currentAction
            if (action) {
                if (action.ready) {
                    console.log('emit event combat action', action.id)
                    this._events.emit(CONSTS.EVENT_COMBAT_ACTION, {
                        ...this.eventDefaultPayload,
                        action: action
                    })
                    attackerState.useAction(action.id)
                    this.selectCurrentAction('')
                    return
                } else {
                    console.log('playFighterAction', this.attacker.id, 'action', action.id, 'not ready')
                }
            } else {
                console.log('playFighterAction', this.attacker.id, 'no action selected')
            }
        }
        const nAttackCount = bPartingShot ? 1 : attackerState.getAttackCount(this._tick)
        if (bPartingShot || nAttackCount > 0) {
            this._events.emit(CONSTS.EVENT_COMBAT_ATTACK, {
                ...this.eventDefaultPayload,
                count: nAttackCount,
                opportunity: bPartingShot // if true, then no retaliation (start combat back)
            })
        }
    }

    advance () {
        let bHasMoved = false
        if (this._tick === 0) {
            this.selectMostSuitableAction() // this will select current action for this turn
            // can be attack with weapon, or casting spell, or using spell like ability
            // Start of turn
            // attack-types planning
            this._attackerState.computePlan(this._tickCount, true)
            // if target is in weapon range
            if (!this.isTargetInRange()) {
                this.approachTarget()
                bHasMoved = true
            }
        }
        if (!bHasMoved && this.isTargetInRange()) {
            this.playFighterAction()
        }
        this._events.emit(CONSTS.EVENT_COMBAT_TICK_END, {
            ...this.eventDefaultPayload
        })
        this.nextTick()
        if (this._tick === 0) {
            // start of next turn
            this.selectCurrentAction(this._nextAction)
            this.nextAction = ''
        }
    }

    /**
     * Returns true for each slot the target is in range
     * @returns {{[slot: string]: boolean}}
     */
    getTargetInCreatureWeaponRange () {
        const d = this._distance
        const gwr = this.attacker.getters.getWeaponRanges
        return {
            [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: d <= gwr[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
            [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: d <= gwr[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: d <= gwr[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1],
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: d <= gwr[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2],
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: d <= gwr[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]
        }
    }

    /**
     * Return the selected weapon range
     * @returns {number}
     */
    getSelectedWeaponRange () {
        const g = this.attacker.getters
        const m = g.getSelectedOffensiveSlot
        return g.getWeaponRanges[m]
    }

    /**
     * Return true if target is within selected weapon range
     * @returns {boolean}
     */
    isTargetInSelectedWeaponRange () {
        return this._distance <= this.getSelectedWeaponRange()
    }

    /**
     * Return true if target is within action range
     * @returns {boolean}
     */
    isTargetInRange () {
        if (this.currentAction) {
            return this._distance <= this.currentAction.range
        } else {
            return this.isTargetInSelectedWeaponRange()
        }
    }

    /**
     * Return the most suitable offensive equipment slot according to distance, ammo ...
     * @return {string}
     */
    getMostSuitableSlot () {
        const oAttacker = this.attacker
        if (oAttacker.getters.isRangedWeaponLoaded) {
            return CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
        }

        const bHasMeleeWeapon = oAttacker.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] !== null
        const aSuitableSlots = Object.entries(this
            .getTargetInCreatureWeaponRange())
            .filter(([slot, bInRange]) => bInRange && NATURAL_SLOTS.has(slot))
            .map(([slot]) => slot)
        // Only if equipped with melee weapon, or not having any natural weapons
        if (bHasMeleeWeapon || aSuitableSlots.length === 0) {
            aSuitableSlots.push(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        }
        return aSuitableSlots[Math.floor(this.attacker.dice.random() * aSuitableSlots.length)]
    }

    selectMostSuitableWeapon () {
        this.attacker.selectOffensiveSlot(this.getMostSuitableSlot())
    }

    selectMostSuitableAction () {
        const attacker = this.attacker
        const distance = this.distance
        const aAvailableActions = Object
            .values(attacker.getters.getActions)
            .filter(action => action.ready && action.range <= distance)
        const sSelectAction = aAvailableActions.length > 0
            ? aAvailableActions[Math.floor(attacker.dice.random() * aAvailableActions.length)].id
            : ''
        this.selectCurrentAction(sSelectAction)
        this._events.emit(CONSTS.EVENT_COMBAT_TURN, {
            ...this.eventDefaultPayload,
            action: action => {
                this.selectCurrentAction(action)
            }
        })
        if (!this.currentAction) {
            this.selectMostSuitableWeapon()
        }
    }

    /**
     * This action is used when a creature has no ranged capabilities and is trying to move toward its target
     */
    approachTarget () {
        const nRunSpeed = this.attacker.getters.getSpeed
        const previousDistance = this.distance
        let nNewDistance = Math.max(this.getSelectedWeaponRange(), this.distance - nRunSpeed)
        this._events.emit(CONSTS.EVENT_COMBAT_MOVE, {
            ...this.eventDefaultPayload,
            speed: nRunSpeed,
            previousDistance,
            distance: d => {
                nNewDistance = parseFloat(d) || 0
            }
        })
        this.distance = nNewDistance
    }

    /**
     * @param value {String}
     */
    set nextAction (value) {
        if ((value === '') || (value in this._attackerState.actions)) {
            this._nextAction = value
        } else {
            throw new Error(`Unknown action ${value}`)
        }
    }

    /**
     * @returns {string}
     */
    get nextAction () {
        return this._nextAction
    }
}

module.exports = Combat
