const Events = require('events')
const { getUniqueId } = require('../unique-id')
const CombatFighterState = require('./CombatFighterState')
const CONSTS = require("../../consts");

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
        this._defender = null
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
    get defender () {
        return this._defender
    }

    /**
     * Returns a default payload template to be sent by events
     * @returns {{attacker: (Creature), combat: Combat, turn: number, tick: number, target: Creature}}
     */
    get eventDefaultPayload () {
        return {
            combat: this,
            turn: this._turn,
            tick: this._tick,
            attacker: this._attackerState.creature,
            target: this._defender
        }
    }

    /**
     * Define new distance between attacker and defender
     * @param value {number}
     */
    set distance (value) {
        const nOldDistance = this._distance
        if (nOldDistance !== value) {
            this._distance = Math.max(0, value)
            this._events.emit('combat.distance', {
                ...this.eventDefaultPayload,
                distance: this._distance,
                previousDistance: nOldDistance
            })
        }
    }

    /**
     * @returns {CombatAction}
     */
    get currentAction () {
        return this._attackerState.actions[this._currentAction]
    }

    notifyTargetApproach (distance) {
        this._distance = distance
    }

    /**
     * returns distance between attacker and defender
     * @returns {number}
     */
    get distance () {
        return this._distance
    }

    /**
     * Define combat creatures
     * @param attacker {Creature}
     * @param defender {Creature}
     */
    setFighters (attacker, defender) {
        // TODO compute initiative here
        this._attackerState = new CombatFighterState()
        this._attackerState.creature = attacker
        this._defender = defender
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
            const action = this.currentAction
            if (action) {
                if (action.ready) {
                    this._events.emit('combat.action', {
                        ...this.eventDefaultPayload,
                        action: action
                    })
                    this._currentAction = ''
                    return
                }
            }
        }
        const nAttackCount = bPartingShot ? 1 : attackerState.getAttackCount(this._tick)
        if (bPartingShot || nAttackCount > 0) {
            this._events.emit('combat.attack', {
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
        if (!bHasMoved) {
            this.playFighterAction()
        }
        this._events.emit('combat.tick.end', {
            ...this.eventDefaultPayload
        })
        this.nextTick()
        if (this._tick === 0) {
            // start of next turn
            if (this._currentAction === '') {
                this._currentAction = this._nextAction
                this._nextAction = ''
            }
        }
    }

    /**
     * Returns true if target is in melee weapon range
     * @returns {boolean}
     */
    isTargetInMeleeWeaponRange () {
        const g = this.attacker.getters
        return this._distance <= g.getWeaponRanges[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
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
        if (this.isTargetInMeleeWeaponRange()) {
            return CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
        }
        if (this.attacker.getters.isRangedWeaponLoaded) {
            return CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
        }
        return CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
    }

    selectMostSuitableWeapon () {
        this.attacker.selectOffensiveSlot(this.getMostSuitableSlot())
    }

    selectMostSuitableAction () {
        this._events.emit('combat.turn', {
            ...this.eventDefaultPayload,
            action: action => {
                this._currentAction = action
            }
        })
        if (this._currentAction === '') {
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
        this._events.emit('combat.move', {
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
