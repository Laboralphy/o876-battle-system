const Events = require('events')
const { getUniqueId } = require('../unique-id')
const CombatFighterState = require('./CombatFighterState')

class Combat {
    constructor () {
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
        this._tickCount = 6
        this._events = new Events()
        this._distance = 0
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
        const nAttackCount = bPartingShot ? 1 : attackerState.getAttackCount(this._tick)
        if (nAttackCount > 0) {
            this._events.emit('combat.action', {
                ...this.eventDefaultPayload,
                count: nAttackCount,
                opportunity: bPartingShot // if true, then no retaliation (start combat back)
            })
        }
    }

    advance () {
        if (this._tick === 0) {
            const atkr = this.attacker
            this.selectMostSuitableAction()
            // Start of turn
            // attack-types planning
            this._events.emit('combat.turn', {
                ...this.eventDefaultPayload,
                action: action => {
                    let oDecidedAction = null
                    if (typeof action === 'string') {
                        const oCreatureActions = this.attackerActions
                        if (action in oCreatureActions) {
                            oDecidedAction = oCreatureActions[action]
                        } else {
                            throw new Error('unknown action : ' + action)
                        }
                    } else {
                        oDecidedAction = action
                        // this._attacker.nextAction = action
                    }
                    if (atkr.isActionCoolingDown(atkr.nextAction, this._turn)) {
                        // nope : selected action is cooling down
                        return
                    }
                    atkr.nextAction = oDecidedAction
                }
            })
            if (atkr.nextAction) {
                const nAttackCount = aggregateModifiers([
                    CONSTS.EFFECT_ATTACK_COUNT_MODIFIER,
                    CONSTS.ITEM_PROPERTY_ATTACK_COUNT_MODIFIER
                ], this._attacker.creature.getters).sum + atkr.nextAction.count
                if (nAttackCount > 0) {
                    atkr.plan = Combat.computePlanning(nAttackCount, this._tickCount, true)
                } else {
                    const nRound = 1 - nAttackCount
                    if (this._turn % nRound === 0) {
                        atkr.plan = Combat.computePlanning(1, this._tickCount, true)
                    } else {
                        atkr.plan = Combat.computePlanning(0, this._tickCount, true)
                    }
                }
            } else {
                this.approachTarget()
            }
        }
        this.playFighterAction()
        this._events.emit('combat.tick.end', {
            ...this.defaultPayload
        })
        this.nextTick()
    }

}

module.exports = Combat