const CONSTS = require('./consts')

/**
 * @class
 */
class AttackOutcome {
    constructor () {
        /**
         * target armor class during this attack
         * @type {number}
         */
        this.ac = 0
        /**
         * attack bonus
         * @type {number}
         */
        this.bonus = 0
        /**
         * auto hit and extra damage
         * @type {boolean}
         */
        this.critical = false
        /**
         * distance between target and attacker
         * @type {number}
         */
        this.distance = 0
        /**
         * target hit by attack
         * @type {boolean}
         */
        this.hit = false
        /**
         * weapon range
         * @type {number}
         */
        this.range = 0
        /**
         * attack roll
         * @type {number}
         */
        this.roll = 0
        /**
         * attacking creature
         * @type {Creature}
         */
        this.attacker = null
        /**
         * targetted creature
         * @type {Creature}
         */
        this.target = null
        /**
         * Weapon used during attack
         * @type {RBSItem | null}
         */
        this.weapon = null // weapon involved in attack
        /**
         * Ammo used during attack (if any)
         * @type {RBSItem | null}
         */
        this.ammo = null
        this.action = null // action involved in attack
        /**
         * the attack killed the target
         * @type {boolean}
         */
        this.kill = false
        /**
         * could not attack
         * @type {boolean}
         */
        this.failed = false
        /**
         * reason why attack failed (out of range, condition, etc...)
         * @type {string}
         */
        this.failure = CONSTS.ATTACK_FAILURE_NO_ACTION
        /**
         * This attack is made from behind, a rogue may have damage bonus
         * @type {boolean}
         */
        this.sneakable = false
        /**
         * target visibility during this attack
         * @type {string}
         */
        this.visibility = CONSTS.CREATURE_VISIBILITY_VISIBLE
        /**
         * this was an attack of opportunity
         * @type {boolean}
         */
        this.opportunity = false
        /**
         * Damage dealt during the attack
         * @type {{amount: number, types: {[damageType: string]: { amount: number, resisted: number }}}}
         */
        this.damages = {
            amount: 0, // amount of damage if attack hit
            types: {} // amount of damage taken and resisted by type
        }
    }
}

module.exports = AttackOutcome