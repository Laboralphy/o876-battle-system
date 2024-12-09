const CONSTS = require('./consts')
const DATA = require('./data')
const Events = require('events')
const {aggregateModifiers} = require("./libs/aggregator")
const {filterRangedAttackTypes, filterMeleeAttackTypes} = require("./libs/props-effects-filters")

/**
 * @class
 */
class AttackOutcome {
    constructor () {
        this._events = new Events()

        /// ATTACK PRESETS /// /// ATTACK PRESETS /// /// ATTACK PRESETS /// /// ATTACK PRESETS ///
        /// ATTACK PRESETS /// /// ATTACK PRESETS /// /// ATTACK PRESETS /// /// ATTACK PRESETS ///
        /// ATTACK PRESETS /// /// ATTACK PRESETS /// /// ATTACK PRESETS /// /// ATTACK PRESETS ///

        /// ENTITIES ///

        /**
         * attacking creature
         * @type {Creature}
         */
        this._attacker = null
        /**
         * targeted creature
         * @type {Creature}
         */
        this._target = null
        /**
         * Weapon used during attack
         * @type {RBSItem | null}
         */
        this._weapon = null // weapon involved in attack
        /**
         * Ammo used during attack (if any)
         * @type {RBSItem | null}
         */
        this._ammo = null
        /**
         * target armor class during this attack
         * @type {number}
         */

        /// NUMERIC VALUES ///

        this._ac = 0
        /**
         * attack bonus
         * @type {number}
         */
        this._attackBonus = 0
        /**
         * distance between target and attacker
         * @type {number}
         */
        this._distance = 0
        /**
         * weapon range
         * @type {number}
         */
        this._range = 0

        /// BOOLEAN INDICATORS ///

        /**
         * This attack is made from behind, a rogue may have damage bonus
         * @type {boolean}
         */
        this._sneakable = false

        /**
         * this was an attack of opportunity
         * @type {boolean}
         */
        this._opportunity = false

        /**
         * Specifies that we want to auto select weapon before attacking
         * @type {boolean}
         * @private
         */
        this._autoSelect = false


        /// NON BOOLEANS INDICATORS ///

        /**
         * target visibility during this attack
         * @type {string}
         */
        this._visibility = CONSTS.CREATURE_VISIBILITY_VISIBLE

        /// ATTACK OUTCOME /// /// ATTACK OUTCOME /// /// ATTACK OUTCOME /// /// ATTACK OUTCOME ///
        /// ATTACK OUTCOME /// /// ATTACK OUTCOME /// /// ATTACK OUTCOME /// /// ATTACK OUTCOME ///
        /// ATTACK OUTCOME /// /// ATTACK OUTCOME /// /// ATTACK OUTCOME /// /// ATTACK OUTCOME ///


        /**
         * Weapon ranged or melee
         * @type {string}
         */
        this._attackType = CONSTS.ATTACK_TYPE_ANY
        /**
         * auto hit and extra damage
         * @type {boolean}
         */
        this._critical = false
        /**
         * target hit by attack
         * @type {boolean}
         */
        this._hit = false
        /**
         * attack roll
         * @type {number}
         */
        this._roll = 0
        this._action = null // action involved in attack
        /**
         * the attack killed the target
         * @type {boolean}
         */
        this._lethal = false
        /**
         * could not attack
         * @type {boolean}
         */
        this._failed = false
        /**
         * reason why attack failed (out of range, condition, etc...)
         * @type {string}
         */
        this._failure = CONSTS.ATTACK_FAILURE_NO_ACTION
        /**
         * Damage dealt during the attack
         * @type {{amount: number, types: {[damageType: string]: { amount: number, resisted: number }}}}
         */
        this._damages = {
            amount: 0, // amount of damage if attack hit
            types: {} // amount of damage taken and resisted by type
        }

    }

    set distance(value) {
        this._distance = value
    }

    set attacker(value) {
        this._attacker = value
    }

    set target(value) {
        this._target = value
    }

    set opportunity(value) {
        this._opportunity = value
    }

    set autoSelect(value) {
        this._autoSelect = value
    }

    get events () {
        return this._events
    }

    get ac() {
        return this._ac
    }

    get attackBonus() {
        return this._attackBonus
    }

    get critical() {
        return this._critical
    }

    get distance() {
        return this._distance
    }

    get hit() {
        return this._hit
    }

    get range() {
        return this._range
    }

    get roll() {
        return this._roll
    }

    get attacker() {
        return this._attacker
    }

    get target() {
        return this._target
    }

    get weapon() {
        return this._weapon
    }

    get ammo() {
        return this._ammo
    }

    get action() {
        return this._action
    }

    get lethal() {
        return this._lethal
    }

    get failed() {
        return this._failed
    }

    get failure() {
        return this._failure
    }

    get sneakable() {
        return this._sneakable
    }

    get visibility() {
        return this._visibility
    }

    get opportunity() {
        return this._opportunity
    }

    get damages() {
        return this._damages
    }

    get autoSelect () {
        return this._autoSelect
    }

    /**
     * Returns the specified weapon range
     * @param weapon {RBSItem}
     * @returns {number}
     */
    getWeaponRange (weapon) {
        if (!weapon) {
            return DATA['WEAPON_RANGES']['WEAPON_RANGE_MELEE'].range
        }
        if (weapon.blueprint.attributes.includes[CONSTS.WEAPON_ATTRIBUTE_REACH]) {
            return DATA['WEAPON_RANGES']['WEAPON_RANGE_REACH'].range
        } else if (weapon.blueprint.attributes.includes[CONSTS.WEAPON_ATTRIBUTE_RANGED]) {
            return DATA['WEAPON_RANGES']['WEAPON_RANGE_RANGED'].range
        } else {
            return DATA['WEAPON_RANGES']['WEAPON_RANGE_MELEE'].range
        }
    }

    /**
     * Returns true if target is in melee range
     * @returns {boolean}
     */
    isTargetInMeleeRange () {
        const oMeleeWeapon = this._attacker.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        return this._distance <= this.getWeaponRange(oMeleeWeapon)
    }

    /**
     * Returns true if target is in selected weapon range
     * @returns {boolean}
     */
    isTargetInSelectedWeaponRange () {
        return this._distance <= this.getWeaponRange(this._attacker.getters.getSelectedWeapon)
    }

    getAttackType () {
        return this._attacker.getters.getSelectedWeaponAttributeSet.has(CONSTS.WEAPON_ATTRIBUTE_RANGED)
            ? CONSTS.ATTACK_TYPE_RANGED
            : CONSTS.ATTACK_TYPE_MELEE
    }

    /**
     * Completes attack variables
     */
    computeAttackParameters () {
        const oAttacker = this._attacker
        const ag = oAttacker.getters
        const w = ag.getSelectedWeapon
        const wa = ag.getSelectedWeaponAttributeSet
        this._weapon = w
        let n = 0
        if (wa.has(CONSTS.WEAPON_ATTRIBUTE_RANGED) && ag.isRangedWeaponLoaded) {
            this._ammo = ag.getEquipment[CONSTS.EQUIPMENT_SLOT_AMMO]
            n += 1
        } else {
            this._ammo = null
        }
        if (wa.has(CONSTS.WEAPON_ATTRIBUTE_IGNORE_ARMOR)) {
            n += 10
        }
        switch (n) {
            case 0: {
                this._attackType = CONSTS.ATTACK_TYPE_MELEE
                break
            }
            case 1: {
                this._attackType = CONSTS.ATTACK_TYPE_RANGED
                break
            }
            case 10: {
                this._attackType = CONSTS.ATTACK_TYPE_MELEE_TOUCH
                break
            }
            case 11: {
                this._attackType = CONSTS.ATTACK_TYPE_RANGED_TOUCH
                break
            }
            default: {
                throw new Error('failed to select attack type')
            }
        }
        this._range = this.getWeaponRange(w)
        this._attackBonus = ag.getAttackBonus
    }

    computeDefenseParameters () {
        const oTarget = this._target
        this._ac = oTarget.getters.getArmorClass[this.getAttackType()]
    }

    /**
     * Return the most suitable offensive equipment slot according to distance, ammo ...
     * @return {string}
     */
    getMostSuitableSlot () {
        if (this.isTargetInMeleeRange()) {
            return CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
        }
        if (this._attacker.getters.isRangedWeaponLoaded) {
            return CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
        }
        return CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
    }

    selectMostSuitableWeapon () {
        this._attacker.selectOffensiveSlot(this.getMostSuitableSlot())
    }

    fail (sReason) {
        this._failed = true
        this._failure = sReason
    }

    rollDamages (xAmount, sDamageType) {
        const oDamageType = this.damages.types
        if (!(sDamageType in oDamageType)) {
            oDamageType[sDamageType] = {
                amount: 0,
                resisted: 0
            }
        }
        oDamageType[sDamageType].amount += this._attacker.dice.roll(xAmount)
    }

    /**
     * Proceed to an attack against target, using melee or ranged weapon
     */
    attack () {
        if (!this._attacker.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT)) {
            // Cannot fight at the moment
            this.fail(CONSTS.ATTACK_FAILURE_CONDITION)
            return false
        }
        if (this._attacker.getCreatureVisibility(this._target) === CONSTS.CREATURE_VISIBILITY_INVISIBLE) {
            // Cannot see target
            this.fail(CONSTS.ATTACK_FAILURE_VISIBILITY)
            return false
        }
        if (this._autoSelect) {
            this.selectMostSuitableWeapon()
        }
        // compute target defense
        this.computeAttackParameters()
        this.computeDefenseParameters()
        if (!this.isTargetInSelectedWeaponRange()) {
            // not in range, attack failed, must rush toward target
            this.fail(CONSTS.ATTACK_FAILURE_TARGET_UNREACHABLE)
            return false
        }
        // rolling attack
        const oAttacker = this._attacker
        const oTarget = this._target
        const nRoll = oAttacker.dice.roll('1d20')
        const bCritical = nRoll === 20
        const bHit = bCritical || (nRoll + this._attackBonus) >= this._ac

        this._roll = nRoll
        this._critical = bCritical
        this._hit = bHit

        // Resolve damages
        if (this._weapon) {
            this.rollDamages(this._weapon.blueprint.damages, CONSTS.DAMAGE_TYPE_PHYSICAL)
        }
        if (this._ammo) {
            this.rollDamages(this._ammo.blueprint.damages, CONSTS.DAMAGE_TYPE_PHYSICAL)
        }

        let pFilter = null

        switch (this._attackType) {
            case CONSTS.ATTACK_TYPE_MELEE:
            case CONSTS.ATTACK_TYPE_MELEE_TOUCH: {
                pFilter = filterMeleeAttackTypes
                break
            }

            case CONSTS.ATTACK_TYPE_RANGED:
            case CONSTS.ATTACK_TYPE_RANGED_TOUCH: {
                pFilter = filterRangedAttackTypes
                break
            }

            default: {
                throw new Error('Attack type is invalid')
            }
        }

        aggregateModifiers([
            CONSTS.PROPERTY_DAMAGE_MODIFIER,
            CONSTS.EFFECT_DAMAGE_MODIFIER
        ], oAttacker.getters, {
            propAmpMapper: prop => oAttacker.dice.roll(prop.amp),
            effectAmpMapper: effect => oAttacker.dice.roll(effect.amp),
            propForEach: prop => {
                this.rollDamages(prop.amp, prop.data.damageType)
            },
            effectForEach: effect => {
                this.rollDamages(effect.amp, effect.data.damageType)
            }
        })

    }
}

module.exports = AttackOutcome