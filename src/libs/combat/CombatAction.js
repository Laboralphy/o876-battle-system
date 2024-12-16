const CONSTS = require('../../consts')

/**
 * This class is used to store all parameters needed to properly conduct a combat action
 */
class CombatAction {
    /**
     *
     * @param id {string} action id
     * @param actionType {string}
     * @param cooldown {number}
     * @param charges {number}
     * @param onHit {string} script launched when action is done
     * @param parameters {{}} script parameters
     * @param range {number}
     */
    constructor ({
        id = '',
        actionType = CONSTS.COMBAT_ACTION_TYPE_ATTACK,
        onHit = '',
        parameters = {},
        cooldown = 0,
        charges = 0,
        range = Infinity,
    } = {}) {
        this._id = id
        this._actionType = actionType
        this._onHit = onHit
        this._parameters = parameters
        this._cooldownTimer = 0
        this._cooldown = cooldown
        this._charges = 0
        this._dailyCharges = charges
        this._range = range
    }

    get range () {
        return this._range
    }

    get isLimitedInCharges () {
        return this._dailyCharges > 0
    }

    get isLimitedInCooldown () {
        return this._cooldown > 0
    }

    /**
     * Return true if action is available (cooldownTimer 0 or charges > 0)
     */
    get ready () {
        const bDepletedCharges = this.isLimitedInCharges
            ? this._charges > 0
            : false
        const bCoolingDown = this.isLimitedInCooldown
            ? this._cooldownTimer > 0
            : false
        return !bCoolingDown && !bDepletedCharges
    }

    get id() {
        return this._id
    }

    get actionType() {
        return this._actionType
    }

    get onHit() {
        return this._onHit
    }

    get parameters () {
        return this._parameters
    }

    use () {
        if (this.ready) {
            if (this.isLimitedInCharges) {
                --this._charges
            }
            if (this.isLimitedInCooldown) {
                this._cooldownTimer = this._cooldown
            }
        }
    }

    /**
     * Used for cooling down the action
     */
    updateCooldown () {
        if (this._cooldownTimer > 0) {
            --this._cooldownTimer
        }
    }

    restoreCharges () {
        this._charges = this._dailyCharges
    }
}

module.exports = CombatAction
