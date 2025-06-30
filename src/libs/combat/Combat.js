const CombatActionSuccess = require('./CombatActionSuccess');
const CombatActionFailure = require('./CombatActionFailure');
const Events = require('events');
const { getUniqueId } = require('../unique-id');
const CombatFighterState = require('./CombatFighterState');
const CombatActionTaken = require('./CombatActionTaken');
const CONSTS = require('../../consts');

const MAX_COMBAT_DISTANCE = 60;

class Combat {
    constructor ({ distance = 0, tickCount }) {
        this._id = getUniqueId();
        /**
         * The state of attacking creature
         * @type {CombatFighterState}
         * @private
         */
        this._attackerState = null;
        /**
         * Instance of the targetted creature
         * @type {Creature}
         * @private
         */
        this._target = null;
        /**
         * Number of elapsed combat turn
         * @type {number}
         * @private
         */
        this._turn = 0;
        /**
         * Index of the tick
         * @type {number}
         * @private
         */
        this._tick = 0;
        this._tickCount = tickCount;
        /**
         *
         * @type {module:events.EventEmitter | module:events.EventEmitter<DefaultEventMap>}
         * @private
         */
        this._events = new Events();
        this._distance = distance;
        /**
         * @type {CombatActionTaken}
         * @private
         */
        this._nextAction = null; // will be used next turn instead of attacks
        /**
         * @type {CombatActionTaken}
         * @private
         */
        this._currentAction = null;
    }

    get id () {
        return this._id;
    }

    /**
     * return the turn index (elapsed turn count)
     * @returns {number}
     */
    get turn () {
        return this._turn;
    }

    /**
     * set the turn index
     * @param value {number}
     */
    set turn (value) {
        this._turn = value;
    }

    /**
     * return current tick index
     * @returns {number}
     */
    get tick () {
        return this._tick;
    }

    /**
     * Set the current tick index in combat turn
     * @param value {number}
     */
    set tick (value) {
        this._tick = value;
    }

    /**
     * returns nimber of ticks in a combat turn
     * @return {number}
     */
    get tickCount () {
        return this._tickCount;
    }

    /**
     * Define how many ticks in a combat turn (default 6)
     * @param value {number}
     */
    set tickCount (value) {
        this._tickCount = Math.max(1, value);
    }

    get events () {
        return this._events;
    }

    /**
     * Return attacking creature state instance
     * @returns {CombatFighterState}
     */
    get attackerState () {
        return this._attackerState;
    }

    /**
     * return attacking creature instance
     * @return {Creature}
     */
    get attacker () {
        return this._attackerState.creature;
    }

    /**
     * Return defending creature instance
     * @returns {Creature}
     */
    get target () {
        return this._target;
    }

    /**
     * Returns a default payload template to be sent by events
     * @returns {{ combat: Combat }}
     */
    get eventDefaultPayload () {
        return {
            combat: this
        };
    }

    /**
     * Define new distance between attacker and target
     * @param value {number}
     */
    set distance (value) {
        if (isNaN(value)) {
            const sGivenType = typeof value;
            throw new TypeError(`combat distance must be a number. ${sGivenType} given (${value}).`);
        }
        const nOldDistance = this._distance;
        if (nOldDistance !== value) {
            this._distance = Math.max(0, Math.min(MAX_COMBAT_DISTANCE, value));
            this._events.emit(CONSTS.EVENT_COMBAT_DISTANCE, {
                ...this.eventDefaultPayload,
                distance: this._distance,
                previousDistance: nOldDistance
            });
        }
    }

    /**
     * @returns {RBSAction | null}
     */
    get currentAction () {
        return this._currentAction?.action ?? null;
    }

    /**
     * @returns {RBSAction | null}
     */
    get nextTurnAction () {
        return this._nextAction?.action ?? null;
    }

    /**
     *
     * @param idAction {string}
     * @param parameters {{}}
     * @returns {CombatActionOutcome}
     */
    selectAction (idAction, parameters = {}) {
        if (idAction === '') {
            this._currentAction = null;
            return new CombatActionSuccess();
        }
        const oAction = new CombatActionTaken({
            creature: this.attacker,
            action: idAction,
            target: this.target,
            ...parameters
        });
        if (!oAction.action.ready) {
            return new CombatActionFailure(CONSTS.ACTION_FAILURE_REASON_NOT_READY);
        }
        if (oAction.action.range < this.distance) {
            return new CombatActionFailure(CONSTS.ACTION_FAILURE_REASON_RANGE);
        }
        if (oAction.action.bonus) {
            if (this._attackerState.hasBonusAction()) {
                // We can play bonus action immediately
                return this.playActionNow(oAction.action, parameters);
            } else {
                // We cannot play bonus action at the moment
                return new CombatActionFailure(CONSTS.ACTION_FAILURE_REASON_PENDING_ACTION);
            }
        } else {
            if (this._currentAction || this._attackerState.hasTakenAction()) {
                // Already used an action this turn
                this._nextAction = oAction;
            } else {
                // did not take action this turn : replacing current action
                this._currentAction = oAction;
            }
            return new CombatActionSuccess();
        }
    }

    notifyTargetApproach (distance) {
        this._distance = distance;
    }

    /**
     * returns distance between attacker and target
     * @returns {number}
     */
    get distance () {
        return this._distance;
    }

    /**
     * Define combat creatures
     * @param attacker {Creature}
     * @param target {Creature}
     */
    setFighters (attacker, target) {
        // TODO compute initiative here
        this._attackerState = new CombatFighterState();
        this._attackerState.creature = attacker;
        this._target = target;
    }

    /**
     * Advance one tick
     */
    nextTick () {
        ++this._tick;
        const ttc = this._tickCount;
        if (this._tick >= ttc) {
            this._tick = 0;
            ++this._turn;
        }
    }

    /**
     * Immediately play an action
     * @param action {RBSAction}
     * @param parameters {{}}
     * @return {CombatActionOutcome}
     */
    playActionNow (action, parameters = {}) {
        const attackerState = this._attackerState;
        const bCanAct = (!action.hostile && this.attacker.getters.getCapabilitySet.has(CONSTS.CAPABILITY_ACT)) ||
            (action.hostile && this.attacker.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT));
        const bActionReady = action.ready;
        const bActionInRange = action.range >= this.distance;
        const bCanDoBonusAction = (action.bonus ? attackerState.hasBonusAction() : true);
        const bCanUseAction = bCanAct && bActionReady && bActionInRange && bCanDoBonusAction;
        const bAtkCharmer = this._isTargetCharming() && action.hostile;
        if (bCanUseAction && !bAtkCharmer) {
            this._events.emit(CONSTS.EVENT_COMBAT_ACTION, {
                ...this.eventDefaultPayload,
                action: action,
                target: this.target,
                parameters
            });
            if (action.bonus) {
                attackerState.useBonusAction(action.id);
            } else {
                attackerState.useAction(action.id);
                attackerState.takeAction();
                this._currentAction = null;
            }
            return new CombatActionSuccess();
        } else {
            let reason = '';
            if (bAtkCharmer) {
                reason = CONSTS.ACTION_FAILURE_REASON_CHARMED;
            } else if (!bActionReady) {
                reason = CONSTS.ACTION_FAILURE_REASON_NOT_READY;
            } else if (!bActionInRange) {
                reason = CONSTS.ACTION_FAILURE_REASON_RANGE;
            } else if (!bCanAct) {
                reason = CONSTS.ACTION_FAILURE_REASON_CAPABILITY;
            } else if (!bCanDoBonusAction) {
                reason = CONSTS.ACTION_FAILURE_REASON_PENDING_ACTION;
            }
            return new CombatActionFailure(reason);
        }
    }

    /**
     * Strike target with weapon, unless attacker is charmed by target
     * @param nAttackCount {number}
     * @param bPartingShot {boolean}
     * @returns {CombatActionOutcome}
     */
    strikeWithSelectedWeapon (nAttackCount, bPartingShot = false) {
        if (isNaN(nAttackCount)) {
            throw new TypeError('First parameters AttackCount must be a number');
        }
        if (this.attacker.getters.getSelectedWeapon) {
            if (!this.attacker.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT)) {
                return new CombatActionFailure(CONSTS.ATTACK_FAILURE_CONDITION);
            } else if (this._isTargetCharming()) {
                return new CombatActionFailure(CONSTS.ATTACK_FAILURE_CHARMED);
            } else  {
                this._events.emit(CONSTS.EVENT_COMBAT_ATTACK, {
                    ...this.eventDefaultPayload,
                    count: nAttackCount,
                    opportunity: bPartingShot // if true, then no retaliation (start combat back)
                });
                return new CombatActionSuccess();
            }
        } else {
            // neither action nor weapon equipped
            return new CombatActionFailure(CONSTS.ATTACK_FAILURE_UNARMED);
        }
    }

    /**
     * trigger a combat action.
     * The system must respond to this event in order to make a creature attack or take action
     * @param bPartingShot {boolean} si true alors attaque d'opportunité
     * @return {CombatActionOutcome}
     */
    playFighterAction (bPartingShot = false) {
        const attackerState = this._attackerState;
        // If no current action then we are attacking during this turn
        const nAttackCount = bPartingShot ? 1 : attackerState.getAttackCount(this._tick);
        if (bPartingShot || nAttackCount > 0) {
            const actionTaken = this._currentAction;
            if (actionTaken && !bPartingShot) {
                return this.playActionNow(actionTaken.action, actionTaken.parameters);
            } else {
                return this.strikeWithSelectedWeapon(nAttackCount, bPartingShot);
            }
        } else {
            return new CombatActionFailure(CONSTS.ATTACK_FAILURE_DID_NOT_ATTACK);
        }
    }

    advance () {
        let bHasMoved = false;
        if (this._tick === 0) {
            this.selectMostSuitableAction(); // this will select current action for this turn
            // can be attack with weapon, or casting spell, or using spell like ability
            // Start of turn
            // attack-types planning
            this._attackerState.computePlan(this._tickCount, true);
            // if target is in weapon range
            if (!this.isTargetInRange()) {
                this.approachTarget();
                bHasMoved = true;
            }
        }
        if (!bHasMoved && this.isTargetInRange()) {
            const outcome = this.playFighterAction();
            if (outcome.failure && outcome.reason !== CONSTS.ATTACK_FAILURE_DID_NOT_ATTACK) {
                this._events.emit(CONSTS.EVENT_COMBAT_ACTION_FAILURE, {
                    ...this.eventDefaultPayload,
                    reason: outcome.reason
                });
            }
        }
        this._events.emit(CONSTS.EVENT_COMBAT_TICK_END, {
            ...this.eventDefaultPayload
        });
        this.nextTick();
        if (this._tick === 0) {
            // start of next turn
            this._currentAction = this._nextAction;
            this._nextAction = null;
        }
    }

    /**
     * Returns true for each slot the target is in range
     * @returns {Object<string, boolean>}
     */
    getTargetInCreatureWeaponRange () {
        const d = this._distance;
        const gwr = this.attacker.getters.getWeaponRanges;
        return {
            [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: d <= gwr[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
            [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: d <= gwr[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: d <= gwr[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1],
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: d <= gwr[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2],
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: d <= gwr[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]
        };
    }

    /**
     * Return the selected weapon range
     * @returns {number}
     */
    getSelectedWeaponRange () {
        const g = this.attacker.getters;
        const m = g.getSelectedOffensiveSlot;
        return g.getWeaponRanges[m];
    }

    /**
     * Return true if target is within selected weapon range
     * @returns {boolean}
     */
    isTargetInSelectedWeaponRange () {
        return this._distance <= this.getSelectedWeaponRange();
    }

    /**
     * Return true if target is within action range
     * @returns {boolean}
     */
    isTargetInRange () {
        if (this._currentAction) {
            return this._distance <= this._currentAction.action.range;
        } else {
            return this.isTargetInSelectedWeaponRange();
        }
    }

    /**
     * Return the most suitable offensive equipment slot according to distance, ammo ...
     * @return {string}
     */
    getMostSuitableSlot () {
        const oAttacker = this.attacker;
        const distance = this.distance;
        const eq = oAttacker.getters.getEquipment;
        const aSlotRanges = Object
            .entries(
                oAttacker
                    .getters
                    .getWeaponRanges
            )
            .map(([slot, range]) => ({
                range,
                slot,
                weaponAttr: eq[slot] ? new Set(eq[slot].blueprint.attributes) : new Set()
            }))
            .filter(({ range, weaponAttr }) => {
                const nRangeMax = range;
                const nRangeMin = weaponAttr.has(CONSTS.WEAPON_ATTRIBUTE_RANGED)
                    ? oAttacker.getters.getVariables['WEAPON_RANGED_MINIMUM_RANGE']
                    : 0;
                // distance of target must be between nRangeMin and nRangeMax
                // or else this weapon cannot be used
                return nRangeMin <= distance && distance <= nRangeMax;
            });
        if (aSlotRanges.length > 0) {
            return aSlotRanges[Math.floor(this.attacker.dice.random() * aSlotRanges.length)].slot;
        } else {
            return '';
        }
    }

    selectMostSuitableWeapon () {
        const slot = this.getMostSuitableSlot();
        if (slot) {
            this.attacker.selectOffensiveSlot(this.getMostSuitableSlot());
        }
    }

    selectMostSuitableAction () {
        const attacker = this.attacker;
        const distance = this.distance;
        const aAvailableActions = Object
            .values(attacker.getters.getActions)
            .filter(action => action.ready && action.range >= distance);
        const sSelectAction = aAvailableActions.length > 0
            ? aAvailableActions[Math.floor(attacker.dice.random() * aAvailableActions.length)].id
            : '';
        this.selectAction(sSelectAction);
        this._events.emit(CONSTS.EVENT_COMBAT_TURN, {
            ...this.eventDefaultPayload,
            action: action => this.selectAction(action)
        });
        if (!this._currentAction) {
            this.selectMostSuitableWeapon();
        }
    }

    _isTargetApplyingEffect (sEffectType) {
        const oFearEffects = this.attacker.getters.getEffectRegistry[sEffectType];
        if (oFearEffects) {
            const idTarget = this.target.id;
            for (const oEffect of oFearEffects) {
                if (oEffect.source === idTarget) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns true if the this.target has applied a EFFECT_FEAR on this.attacker
     * @private
     * @return {boolean}
     */
    _isTargetFrightening () {
        return this.attacker.getters.getConditionSet.has(CONSTS.CONDITION_FRIGHTENED) &&
            this._isTargetApplyingEffect(CONSTS.EFFECT_FEAR);
    }

    /**
     * Returns true if the current target has applied a EFFECT_CHARM on this.attacker
     * This could prevent this.attacker from attacking this.target
     * @private
     * @return {boolean}
     */
    _isTargetCharming () {
        return this.attacker.getters.getConditionSet.has(CONSTS.CONDITION_CHARMED) &&
            this._isTargetApplyingEffect(CONSTS.EFFECT_CHARM);
    }

    /**
     * This action is used when a creature has no ranged capabilities and is trying to move toward its target
     * @param [nUseSpeed] {number} if undefined, the creature normal speed will apply
     */
    approachTarget (nUseSpeed = undefined) {
        if (this._isTargetFrightening() && nUseSpeed > 0) {
            // cannot approach a particular target when frightened by this target
            // Can retreat
            return;
        }
        if (this.attacker.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE) &&
            this.attacker.getters.getCapabilitySet.has(CONSTS.CAPABILITY_SEE) &&
            this.attacker.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT)
        ) {
            const nRunSpeed = nUseSpeed ?? this.attacker.getters.getSpeed;
            const previousDistance = this.distance;
            const nMeleeRange = this.attacker.getters.getVariables['WEAPON_MELEE_MINIMUM_RANGE'];
            const nMinRange = Math.max(this.getSelectedWeaponRange(), nMeleeRange);
            let nNewDistance = Math.max(nMinRange, this.distance - nRunSpeed);
            this._events.emit(CONSTS.EVENT_COMBAT_MOVE, {
                ...this.eventDefaultPayload,
                speed: nRunSpeed,
                previousDistance,
                distance: d => {
                    nNewDistance = parseFloat(d) || 0;
                }
            });
            // if current distance is at melee range and new distance is not at melee range,
            // then an opportunity attack may be done, if reaction is available this turn.
            if (previousDistance <= nMinRange && nNewDistance > nMinRange && !this.attackerState.hasTakenAction()) {
                this.playFighterAction(true);
                this.attackerState.takeReaction();
            }
            this.distance = Math.max(0, Math.min(MAX_COMBAT_DISTANCE, nNewDistance));
        }
    }

    retreatFromTarget (nUseSpeed = undefined) {
        const nRunSpeed = nUseSpeed ?? this.attacker.getters.getSpeed;
        this.approachTarget(-nRunSpeed);
    }
}

module.exports = Combat;
