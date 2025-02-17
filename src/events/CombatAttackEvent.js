const CONSTS = require('../consts')

class CombatAttackEvent {
    /**
     *
     * @param system
     * @param attack {AttackOutcome}
     */
    constructor ({ system, attack }) {
        this.type = CONSTS.EVENT_COMBAT_ATTACK
        this.system = system
        this.attacker = attack.attacker.id
        this.target = attack.target.id
        this.hit = attack.hit
        this.sneak = attack.sneak
        this.opportunity = attack.opportunity
        this.rush = attack.rush
        this.visibility = attack.visibility
        this.ability = attack.ability
        this.attackType = attack.attackType
        this.critical = attack.critical
        this.fumble = attack.fumble
        this.hit = attack.hit
        this.roll = attack.roll
        this.lethal = attack.lethal
        this.failed = attack.failed
        this.failure = attack.failure
        this.damages = attack.damages
        this.advantages = [...attack.rollBias.advantages]
        this.disadvantages = [...attack.rollBias.disadvantages]
        this.bias = attack.rollBias.result
        this.damages = {
            types: attack.damages.types,
            amount: attack.damages.amount
        }
    }
}

module.exports = CombatAttackEvent
