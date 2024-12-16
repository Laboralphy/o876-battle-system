const {aggregateModifiers} = require('../aggregator')
const CONSTS = require('../../consts')
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../props-effects-filters')
const CombatAction = require('./CombatAction')

/**
 * @class
 * This class holds a fighter state, computes attack count each tick
 */
class CombatFighterState {
    constructor () {
        /**
         * @type {number[]}
         * @private
         */
        this._plan = [0]
        /**
         * @type {Creature}
         * @private
         */
        this._creature = null
        this._lastAttackCount = 0
        this._actions = {}
        this._attackCount = 0
    }

    addAction ({
        id,
        actionType = CONSTS.COMBAT_ACTION_TYPE_ATTACK,
        onHit = '',
        cooldown = 0,
        charges = 0,
        range = Infinity
    }) {
        if (!id) {
            throw new Error(`id parameter is mandatory when defining action`)
        }
        this._actions[id] = new CombatAction({
            id,
            actionType,
            onHit,
            cooldown,
            charges,
            range
        })
    }

    get actions () {
        return this._actions
    }

    /**
     * @param value {Creature}
     */
    set creature (value) {
        this._creature = value
    }

    /**
     * @returns {Creature}
     */
    get creature () {
        return this._creature
    }

    get attackCount () {
        return this._attackCount
    }

    /**
     * @param value {number[]}
     */
    set plan (value) {
        this._plan = value
    }

    /**
     * @return {number[]}
     */
    get plan () {
        return this._plan
    }

    /**
     * @param tick
     * @returns {number}
     */
    getAttackCount (tick) {
        return this._plan[tick % this._plan.length]
    }


    getMeleeExtraAttackCount () {
        return aggregateModifiers([
                CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER,
                CONSTS.EFFECT_ATTACK_COUNT_MODIFIER
            ], this._creature.getters,
            {
                propFilter: filterMeleeAttackTypes,
                effectFilter: filterMeleeAttackTypes
            }).sum
    }

    getRangedExtraAttackCount () {
        return aggregateModifiers([
                CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER,
                CONSTS.EFFECT_ATTACK_COUNT_MODIFIER
            ], this._creature.getters,
            {
                propFilter: filterRangedAttackTypes,
                effectFilter: filterRangedAttackTypes
            }).sum
    }

    computePlan (nTurnTickCount, reverseOrder = false) {
        const oWeapon = this._creature.getters.getSelectedWeapon
        const bRanged = oWeapon
            ? oWeapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
            : false
        const nExtraAttackPerTurn = bRanged
            ? this.getRangedExtraAttackCount()
            : this.getMeleeExtraAttackCount()
        const nAttackPerTurn = 1 + nExtraAttackPerTurn
        this._attackCount = nAttackPerTurn
        if (nAttackPerTurn === this._lastAttackCount) {
            return this.plan
        }
        this._lastAttackCount = nAttackPerTurn
        const aPlan = new Array(nTurnTickCount)
        aPlan.fill(0)
        for (let i = 0; i < nAttackPerTurn; ++i) {
            const iRank = Math.floor(aPlan.length * i / nAttackPerTurn)
            const nIndex = reverseOrder
                ? nTurnTickCount - 1 - iRank
                : iRank
            ++aPlan[nIndex]
        }
        return this.plan = aPlan
    }

}

module.exports = CombatFighterState
