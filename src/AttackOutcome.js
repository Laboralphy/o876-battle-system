const CONSTS = require('./consts')
const Events = require('events')
const { aggregateModifiers } = require('./libs/aggregator')
const { getAttackAdvantages } = require('./advantages/attack-roll')

/**
 * @class
 */
class AttackOutcome {
    /**
     *
     * @param effectProcessor {EffectProcessor}
     */
    constructor ({ effectProcessor = null } = {}) {
        this._events = new Events()
        this._effectProcessor = effectProcessor

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
         * This reflects the use of sneak attack.
         * The value is the number of sneak attack rank
         * 0 = no rank
         *
         * @type {number}
         */
        this._sneak = 0

        /**
         * this was an attack of opportunity
         * @type {boolean}
         */
        this._opportunity = false


        /// NON BOOLEANS INDICATORS ///

        /**
         * target visibility during this attack
         * @type {string}
         */
        this._visibility = CONSTS.CREATURE_VISIBILITY_VISIBLE

        /**
         * Offensive ability
         */
        this._ability = ''

        /**
         * @type {{result: number, advantages: Set<string>, disadvantages: Set<string>}}
         * @private
         */
        this._rollBias = {
            advantages: new Set(),
            disadvantages: new Set(),
            result: 0
        }

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
         * Auto miss
         */
        this._fumble = false
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
         * @type {{amount: number, types: {[damageType: string]: { amount: number, resisted: number }}, effects: RBSEffect[]}}
         */
        this._damages = {
            amount: 0, // amount of damage if attack hit
            types: {}, // amount of damage taken and resisted by type
            effects: []
        }

    }

    get ability() {
        return this._ability;
    }

    get attackType() {
        return this._attackType;
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

    get events () {
        return this._events
    }

    get ac() {
        return this._ac
    }

    get rollBias () {
        return this._rollBias
    }

    get attackBonus() {
        return this._attackBonus
    }

    get critical() {
        return this._critical
    }

    get fumble () {
        return this._fumble
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

    get sneak() {
        return this._sneak
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

    get effectProcessor () {
        return this._effectProcessor
    }

    /**
     * Returns true if target is in selected weapon range
     * @returns {boolean}
     */
    isTargetInSelectedWeaponRange () {
        const g = this._attacker.getters
        const slot = g.getSelectedOffensiveSlot
        return this._distance <= g.getWeaponRanges[slot]
    }

    /**
     * Return the attack type
     * @returns {string}
     */
    getAttackType () {
        return this._weapon && this._weapon.blueprint.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
            ? CONSTS.ATTACK_TYPE_RANGED
            : CONSTS.ATTACK_TYPE_MELEE
    }

    getDamageType () {
        return this._weapon
            ? this._weapon.blueprint.damageType
            : CONSTS.DAMAGE_TYPE_CRUSHING
    }

    getWeaponBaseDamageAmount () {
        if (this._weapon) {
            return this._weapon.blueprint.damages
        } else {
            return this._attacker.getters.getVariables['BASE_UNHARMED_DAMAGES']
        }
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
        this._ability = ag.getAttackAbility[ag.getSelectedOffensiveSlot]
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
        const sSelectedSlot = ag.getSelectedOffensiveSlot
        this._range = ag.getWeaponRanges[sSelectedSlot]
        this._attackBonus = ag.getAttackBonus[sSelectedSlot]
        this._visibility = this._target.getCreatureVisibility(this._attacker)
    }

    computeDefenseParameters () {
        const oTarget = this._target
        const oArmorClasses = oTarget.getters.getArmorClass
        this._ac = oArmorClasses[this.getAttackType()] +
            oArmorClasses[this.getDamageType()]
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
        if (this._visibility === CONSTS.CREATURE_VISIBILITY_INVISIBLE) {
            // Cannot see target
            this.fail(CONSTS.ATTACK_FAILURE_VISIBILITY)
            return false
        }

        if (this._visibility === CONSTS.CREATURE_VISIBILITY_HIDDEN) {
            // roll check steal vs investigation
            const rAtk = this._attacker.checkSkill('SKILL_STEALTH', 0)
            const dc = rAtk.roll + rAtk.bonus
            if (!this._target.checkSkill('SKILL_PERCEPTION', dc).success) {
                this._visibility = CONSTS.CREATURE_VISIBILITY_VISIBLE
            }
        }

        // compute target defense
        this.computeAttackParameters()
        this.computeDefenseParameters()

        if (!this.isTargetInSelectedWeaponRange()) {
            // not in range, attack failed, must rush toward target
            this.fail(CONSTS.ATTACK_FAILURE_TARGET_UNREACHABLE)
            return false
        }

        const oAttacker = this._attacker

        // rolling attack
        let nRoll = oAttacker.dice.roll('1d20')
        this._rollBias = getAttackAdvantages(this)
        switch (this._rollBias.result) {
            case -1: {
                // only disadvantage
                nRoll = Math.min(nRoll, oAttacker.dice.roll('1d20'))
                break
            }

            case 1: {
                // only advantage
                nRoll = Math.max(nRoll, oAttacker.dice.roll('1d20'))
                break
            }

            default: {
                break
            }
        }
        const bCritical = nRoll === this._attacker.getters.getVariables['ROLL_CRITICAL_SUCCESS_VALUE']
        const bFumble = nRoll === this._attacker.getters.getVariables['ROLL_FUMBLE_VALUE']
        const bHit = bFumble
            ? false
            : bCritical
                ? true
                : ((nRoll + this._attackBonus) >= this._ac)
        this._roll = nRoll
        this._critical = bCritical
        this._fumble = bFumble
        this._hit = bHit

        if (bHit) {
            const sDamageType = this.getDamageType()
            this.rollDamages(this.getWeaponBaseDamageAmount(), sDamageType)
            if (this._rollBias.result > 0) {
                this._sneak = aggregateModifiers([
                    CONSTS.PROPERTY_SNEAK_ATTACK
                ], oAttacker.getters).sum
                if (this._sneak > 0) {
                    const sSneakDice = this._sneak.toString() + 'd6'
                    this.rollDamages(sSneakDice, sDamageType)
                }
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

    createDamageEffects () {
        return this._damages.effects = Object
            .entries(this._damages.types)
            .map(([sType, oDmg]) => {
                const eDmg = this._effectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, oDmg.amount, { damageType: sType })
                eDmg.subtype = CONSTS.EFFECT_SUBTYPE_WEAPON
                return eDmg
            })
    }

    /**
     * Applies damage effects described in the attack outcome
     */
    applyDamages () {
        const aDamages = this
            ._effectProcessor
            .applyEffectGroup(this._damages.effects, '', this._target, 0, this._attacker)
        const dam = this._damages
        aDamages.forEach(({ amp, data: { damageType, resistedAmount } }) => {
            dam.amount += amp
            dam.types[damageType].amount += amp
            dam.types[damageType].resisted += resistedAmount
        })
        return aDamages
    }
}

module.exports = AttackOutcome