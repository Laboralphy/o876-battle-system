const CONSTS = require('../../consts')

/**
 * This class is used to store all parameters needed to properly conduct a combat action
 */
class CombatAction {
    /**
     *
     * @param id {string} action id
     * @param attackType {string} attack type (melee, ranged, melee touch ...)
     * @param damages {string|number} damages (dice expression)
     * @param damageType {string} damage type
     * @param onHit {[]} script launched when action is done
     */
    constructor ({
        id = '',
        attackType = CONSTS.ATTACK_TYPE_MELEE,
        damages = 0,
        damageType = CONSTS.DAMAGE_TYPE_PHYSICAL,
        onHit = []
    } = {}) {
        this.id = id
        this.attackType = attackType
        this.damages = damages
        this.damageType = damageType
        this.onHit = onHit
    }
}

module.exports = CombatAction
