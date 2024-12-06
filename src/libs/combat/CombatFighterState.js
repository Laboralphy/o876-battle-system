const {aggregateModifiers} = require('../aggregator')
const CONSTS = require('../../consts')
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../props-effects-filters')

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

    computeMeleePlan () {
        const nExtraAttacks = aggregateModifiers([
                CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER,
                CONSTS.EFFECT_ATTACK_COUNT_MODIFIER
            ], this._creature.getters,
            {
                propFilter: filterMeleeAttackTypes,
                effectFilter: filterMeleeAttackTypes
            }).sum
    }

    computeRangedPlan () {
        const nExtraAttacks = aggregateModifiers([
                CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER,
                CONSTS.EFFECT_ATTACK_COUNT_MODIFIER
            ], this._creature.getters,
            {
                propFilter: filterRangedAttackTypes,
                effectFilter: filterRangedAttackTypes
            }).sum
    }

    static computePlanning (nAttackPerTurn, nTurnTickCount, reverseOrder = false) {
    }

    computePlan (nTurnTickCount, reverseOrder = false) {
        const oWeapon = this._creature.getters.getSelectedWeapon
        let nAttackPerTurn = 1
        if (oWeapon) {
            if (oWeapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {

            }
        } else {
            // pas d'arme
        }
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