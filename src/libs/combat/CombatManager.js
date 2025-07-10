const Combat = require('./Combat');
const Events = require('events');
const CONSTS = require('../../consts');
const {getWeaponRange} = require('../helpers');

class CombatManager {
    constructor () {
        this._fighters = {};
        this._events = new Events();
        this._defaultDistance = 0;
        this._defaultTickCount = 6;
    }

    /**
     * @returns {module:events.EventEmitter | module:events.EventEmitter<DefaultEventMap>}
     */
    get events () {
        return this._events;
    }

    /**
     * return the default distance when creating a combat
     * @returns {number}
     */
    get defaultDistance () {
        return this._defaultDistance;
    }

    set defaultDistance (value) {
        this._defaultDistance = value;
    }

    get defaultTickCount () {
        return this._defaultTickCount;
    }

    set defaultTickCount (value) {
        this._defaultTickCount = value;
    }

    /**
     * Returns a list of combats
     * @returns {Combat[]}
     */
    get combats () {
        return Object.values(this._fighters);
    }

    get combatRegistry () {
        return this._fighters;
    }

    /**
     * Adds this instance to given object. Returns a new version of object with this instance insert in property 'combatManager'
     * @param oObject {*}
     * @returns {*&{combatManager: CombatManager}}
     * @private
     */
    _addManagerToObject (oObject) {
        return {
            ...oObject,
            combatManager: this
        };
    }


    /**
     * Sends a combat action event.
     * @param ev
     * @private
     */
    _sendCombatActionEvent (ev) {
        const { combat, target, action, parameters } = ev;
        this._events.emit(CONSTS.EVENT_COMBAT_ACTION, this._addManagerToObject(ev));
        if (action.hostile && !this.isCreatureFighting(combat.target)) {
            this.startCombat(combat.target, combat.attacker, combat.distance);
        }
    }

    /**
     * Sends a combat attack event.
     * @param opportunity {boolean}
     * @param combat {Combat}
     * @param count {number}
     * @private
     */
    _sendCombatAttackEvent ({ opportunity, combat, count  }) {
        this._events.emit(CONSTS.EVENT_COMBAT_ATTACK, this._addManagerToObject({ opportunity, combat, count  }));
        if (!opportunity && !this.isCreatureFighting(combat.target)) {
            this.startCombat(combat.target, combat.attacker, combat.distance);
        }
    }

    /**
     * Creates a new combat and plugs events
     * @param oCreature {Creature}
     * @param oTarget {Creature}
     * @param nStartingDistance {number}
     * @returns {Combat}
     * @private
     */
    _createCombat (oCreature, oTarget, nStartingDistance = null) {
        const combat = new Combat({
            distance: this._defaultDistance,
            tickCount: this._defaultTickCount
        });
        combat.events.on(CONSTS.EVENT_COMBAT_TURN, ev => this._events.emit(CONSTS.EVENT_COMBAT_TURN, this._addManagerToObject(ev)));
        combat.events.on(CONSTS.EVENT_COMBAT_TICK_END, ev => this._events.emit(CONSTS.EVENT_COMBAT_TICK_END, this._addManagerToObject(ev)));
        combat.events.on(CONSTS.EVENT_COMBAT_ACTION, ev => this._sendCombatActionEvent(ev));
        combat.events.on(CONSTS.EVENT_COMBAT_ATTACK, ev => this._sendCombatAttackEvent(ev));
        combat.events.on(CONSTS.EVENT_COMBAT_SCRIPT, ev => this._events.emit(CONSTS.EVENT_COMBAT_SCRIPT, this._addManagerToObject(ev)));
        combat.events.on(CONSTS.EVENT_COMBAT_OFFENSIVE_SLOT, ev => this._events.emit(CONSTS.EVENT_COMBAT_OFFENSIVE_SLOT, this._addManagerToObject(ev)));
        combat.events.on(CONSTS.EVENT_COMBAT_DISTANCE, ev => {
            const { combat } = ev;
            const { attacker, target: target, distance } = combat;
            this._events.emit(CONSTS.EVENT_COMBAT_DISTANCE, this._addManagerToObject(ev));
            if (this.isCreatureFighting(target, attacker)) {
                // also change target distance with attacker if different
                const oTargetCombat = this.getCombat(oTarget);
                if (oTargetCombat && oTargetCombat.distance !== distance) {
                    oTargetCombat.notifyTargetApproach(distance);
                }
            }
        });
        combat.events.on(CONSTS.EVENT_COMBAT_MOVE, ev => {
            this._events.emit(CONSTS.EVENT_COMBAT_MOVE, this._addManagerToObject(ev));
        });
        combat.setFighters(oCreature, oTarget);
        combat.distance = nStartingDistance === null ? this.defaultDistance : nStartingDistance;
        return combat;
    }

    /**
     * Processing all registered combats
     */
    processCombats () {
        this.combats
            .forEach(combat => {
                const oAttacker = combat.attacker;
                if (oAttacker.getters.isDead || combat.target.getters.isDead) {
                    this.endCombat(oAttacker, true);
                } else {
                    combat.advance();
                }
            });
    }

    /**
     * Return true if Creature is involved in a combat (optionnaly with a specific target creature)
     * @param oCreature {Creature}
     * @param oTarget {Creature}
     * @returns {boolean}
     */
    isCreatureFighting (oCreature, oTarget = null) {
        return oTarget
            ? this.isCreatureFighting(oCreature) && this._fighters[oCreature.id].target === oTarget
            : oCreature.id in this._fighters;
    }

    /**
     * Returns all creature attacking specified creature
     * @param oCreature {Creature}
     * @param nRange {number} maximum range
     * @return {Creature[]}
     */
    getTargetingCreatures (oCreature, nRange = Infinity) {
        return this.combats
            .filter(combat => combat.target === oCreature && combat.distance <= nRange)
            .map(combat => combat.attacker);
    }

    isCreatureAttacked (oCreature) {
        return this
            .combats
            .some(combat => combat.target === oCreature);
    }

    /**
     * This creature is being removed from the game
     * All combats involved are to be ended.
     * Call this method when a creature is leaving the game or combat.
     * @param oCreature {Creature}
     */
    removeFighter (oCreature) {
        if (this.isCreatureAttacked(oCreature)) {
            this
                .getTargetingCreatures(oCreature)
                .forEach(creature => {
                    this.endCombat(creature, true);
                });
        }
        this.endCombat(oCreature);
    }

    /**
     * Will end combat where creature is involved.
     * Call this when you want to technically stop a combat, but all involved creature remain registered
     * @param oCreature {Creature}
     * @param bBothSides {boolean} if true and if this is a one-to-one combat : ends both combats
     */
    endCombat (oCreature, bBothSides = false) {
        if (this.isCreatureFighting(oCreature)) {
            const oCombat = this._fighters[oCreature.id];
            const oTarget = oCombat.target;
            this._events.emit(CONSTS.EVENT_COMBAT_END, this._addManagerToObject({
                ...oCombat.eventDefaultPayload,
                victory: !oCreature.getters.isDead && oTarget.getters.isDead,
                defeat: oCreature.getters.isDead && !oTarget.getters.isDead
            }));
            delete this._fighters[oCreature.id];
            if (bBothSides && this.isCreatureFighting(oTarget, oCreature)) {
                this.endCombat(oTarget);
            }
            oCombat._events.removeAllListeners();
        }
    }

    /**
     * A creature is fleeing from combat. Opponent is allowed to attack once during a parting shot
     * @param oCoward {Creature}
     */
    fleeCombat (oCoward) {
        this.endCombat(oCoward);
        this
            .getTargetingCreatures(oCoward)
            .forEach(offender => {
                const combat = this.getCombat(offender);
                combat.playFighterAction(true);
                this.endCombat(offender);
            });
    }

    /**
     * starts a new combat with creature.
     * if creature already in combat : switch to new combat, discard old combat
     * @param oCreature {Creature}
     * @param oTarget {Creature}
     * @param nStartingDistance {number}
     * @return {Combat}
     */
    startCombat (oCreature, oTarget, nStartingDistance = null) {
        if (this.isCreatureFighting(oCreature, oTarget)) {
            // Already engaged in combat with this target : nothing change
            return this.getCombat(oCreature);
        }
        if (this.isCreatureFighting(oCreature)) {
            // Already in combat with another target, unilaterally quit combat and change target
            this.endCombat(oCreature);
        }
        const oCombat = this._fighters[oCreature.id] = this._createCombat(oCreature, oTarget, nStartingDistance);
        oCombat.selectMostSuitableWeapon();
        if (!this.isCreatureFighting(oTarget) && oTarget.getCreatureVisibility(oCreature) === CONSTS.CREATURE_VISIBILITY_VISIBLE) {
            const oAtkCombat = this.getCombat(oCreature);
            if (oAtkCombat && nStartingDistance === null) {
                nStartingDistance = oAtkCombat.distance;
            }
            this._fighters[oTarget.id] = this._createCombat(oTarget, oCreature, nStartingDistance);
        }
        this._events.emit(CONSTS.EVENT_COMBAT_START, this._addManagerToObject({
            combat: oCombat
        }));
        return oCombat;
    }

    /**
     * Get the instance of combat associated with that creature. Returns null if no combat is bound to this creature
     * @param oCreature {Creature}
     * @returns {Combat|null}
     */
    getCombat (oCreature) {
        if (this.isCreatureFighting(oCreature)) {
            return this._fighters[oCreature.id];
        } else {
            return null;
        }
    }
}

module.exports = CombatManager;
