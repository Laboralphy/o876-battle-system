const CONSTS = require('./consts')
const DATA = require('./data')

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

    _configWeaponAttack (sAttackType) {
        const atk = this.attacker
        const def = this.target
        const ga = atk.getters
        const ma = atk.mutations
        const gt = def.getters
        const mt = def.mutations
        this.ac = gt.getArmorClass[sAttackType]
        switch (sAttackType) {
            case CONSTS.ATTACK_TYPE_MELEE: {
                ma.setOffensiveSlot({ value: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
                break
            }

            case CONSTS.ATTACK_TYPE_RANGED: {
                ma.setOffensiveSlot({ value: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
                break
            }
        }
        this.weapon = ga.getSelectedWeapon
        this.bonus = ga.getAttackBonus
    }

    /**
     * Configure attack to use creature's melee weapon
     */
    configMeleeWeaponAttack () {
        this._configWeaponAttack(CONSTS.ATTACK_TYPE_MELEE)
    }


    /**
     * Configure attack to use creature's melee weapon
     */
    configRangedWeaponAttack () {
        this._configWeaponAttack(CONSTS.ATTACK_TYPE_RANGED)
    }

    getSelectedWeaponRange () {
        const weapon = this.attacker.getters.getSelectedWeapon
        if (!weapon) {
            return DATA['WEAPON_RANGES']['WEAPON_RANGE_MELEE'].range
        }
        if (weapon.attributes.includes[CONSTS.WEAPON_ATTRIBUTE_REACH]) {
            return DATA['WEAPON_RANGES']['WEAPON_RANGE_REACH'].range
        } else if (weapon.attributes.includes[CONSTS.WEAPON_ATTRIBUTE_RANGED]) {
            return DATA['WEAPON_RANGES']['WEAPON_RANGE_RANGED'].range
        } else {
            return DATA['WEAPON_RANGES']['WEAPON_RANGE_MELEE'].range
        }
    }

    selectMostUseeFullWeapon () {
        const nWeaponRange = this.getSelectedWeaponRange()
        const nDistance = this.distance
        if (nDistance <= nWeaponRange) {
            // current weapon is ok to attack
        } else {
            // distance is too far for
        }
    }
}

module.exports = AttackOutcome