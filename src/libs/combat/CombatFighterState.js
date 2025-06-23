const {aggregateModifiers} = require('../aggregator');
const CONSTS = require('../../consts');
const { filterMeleeAttackTypes, filterRangedAttackTypes } = require('../props-effects-filters');

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
        this._plan = [0];
        /**
         * @type {Creature}
         * @private
         */
        this._creature = null;
        this._lastAttackCount = 0;
        this._attackCount = 0;
        this._bonusActionCount = 1;
        this._bonusActionDone = 0;
        /**
         * @type {boolean}
         * @private
         */
        this._actionTaken = false;
        this._reactionTaken = false;
    }

    /**
     * Return all actions
     * @returns {Object<string, RBSAction >}
     */
    get actions () {
        return this._creature.getters.getActions;
    }

    /**
     * @param value {Creature}
     */
    set creature (value) {
        this._creature = value;
    }

    /**
     * @returns {Creature}
     */
    get creature () {
        return this._creature;
    }

    get attackCount () {
        return this._attackCount;
    }

    /**
     * @param value {number[]}
     */
    set plan (value) {
        this._plan = value;
    }

    /**
     * @return {number[]}
     */
    get plan () {
        return this._plan;
    }

    useAction (id) {
        this._creature.mutations.useAction({ action: id });
    }

    useBonusAction (id) {
        this.useAction(id);
        ++this._bonusActionDone;
    }

    takeAction () {
        this._actionTaken = true;
    }

    takeReaction () {
        this._reactionTaken = true;
    }

    /**
     * @param tick
     * @returns {number}
     */
    getAttackCount (tick) {
        return this._plan[tick % this._plan.length];
    }

    getMeleeExtraAttackCount () {
        return aggregateModifiers([
            CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER,
            CONSTS.EFFECT_ATTACK_COUNT_MODIFIER
        ], this._creature.getters,
        {
            propFilter: filterMeleeAttackTypes,
            effectFilter: filterMeleeAttackTypes
        }).sum;
    }

    getRangedExtraAttackCount () {
        return aggregateModifiers([
            CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER,
            CONSTS.EFFECT_ATTACK_COUNT_MODIFIER
        ], this._creature.getters,
        {
            propFilter: filterRangedAttackTypes,
            effectFilter: filterRangedAttackTypes
        }).sum;
    }

    /**
     * returns true if creature has bonus action available
     * @returns {boolean}
     */
    hasBonusAction () {
        return this._bonusActionDone < this._bonusActionCount;
    }

    /**
     * returns true if any action has been taken this turn
     * if creature did nothing this turn (action or attack) returns false
     * @return {boolean}
     */
    hasTakenAction () {
        return this._actionTaken;
    }

    hasTakenReaction () {
        return this._reactionTaken;
    }

    computePlan (nTurnTickCount, reverseOrder = false) {
        // resiting action counters
        this._actionTaken = false;
        this._reactionTaken = false;
        this._bonusActionDone = 0;
        const oWeapon = this._creature.getters.getSelectedWeapon;
        const bRanged = oWeapon
            ? oWeapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
            : false;
        const nExtraAttackPerTurn = bRanged
            ? this.getRangedExtraAttackCount()
            : this.getMeleeExtraAttackCount();
        const nAttackPerTurn = Math.max(1, 1 + nExtraAttackPerTurn);
        this._attackCount = nAttackPerTurn;
        if (nAttackPerTurn === this._lastAttackCount) {
            return this.plan;
        }
        this._lastAttackCount = nAttackPerTurn;
        const aPlan = new Array(nTurnTickCount);
        aPlan.fill(0);
        for (let i = 0; i < nAttackPerTurn; ++i) {
            const iRank = Math.floor(aPlan.length * i / nAttackPerTurn);
            const nIndex = reverseOrder
                ? nTurnTickCount - 1 - iRank
                : iRank;
            ++aPlan[nIndex];
        }
        return this.plan = aPlan;
    }

}

module.exports = CombatFighterState;
