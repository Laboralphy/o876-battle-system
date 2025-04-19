const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatAttackEvent extends GenericEvent {
    /**
     *
     * @param system
     * @param attack {AttackOutcome}
     */
    constructor ({ system, attack }) {
        super(CONSTS.EVENT_COMBAT_ATTACK, system);
        this.attacker = this.boxCreature(attack.attacker);
        this.target = this.boxCreature(attack.target);
        this.weapon = this.boxItem(attack.weapon);
        this.ammo = this.boxItem(attack.ammo);
        this.hit = attack.hit;
        this.ac = attack.ac;
        this.sneak = attack.sneak;
        this.opportunity = attack.opportunity;
        this.rush = attack.rush;
        this.visibility = attack.visibility;
        this.ability = attack.ability;
        this.attackType = attack.attackType;
        this.critical = attack.critical;
        this.fumble = attack.fumble;
        this.hit = attack.hit;
        this.roll = attack.roll;
        this.bonus = attack.attackBonus;
        this.lethal = attack.lethal;
        this.failed = attack.failed;
        this.failure = attack.failure;
        this.damages = attack.damages;
        this.advantages = [...attack.rollBias.advantages];
        this.disadvantages = [...attack.rollBias.disadvantages];
        this.bias = attack.rollBias.result;
        this.damageTypes = Object.keys(attack.damages.types);
    }
}

module.exports = CombatAttackEvent;
