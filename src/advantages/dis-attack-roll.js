const CONSTS = require('../consts');
const {aggregateModifiers} = require('../libs/aggregator');

/**
 * ATTACK DISADVANTAGES (according to D&D 5)
 *
 * Blinded attacker : DIS_ATTACK_ROLL_TARGET_UNDETECTED
 * Invisible target : DIS_ATTACK_ROLL_TARGET_UNDETECTED
 * Restrained attacker : DIS_ATTACK_ROLL_RESTRAINED
 * Prone attacker.
 * Poisoned attacker : DIS_ATTACK_ROLL_POISONED
 * Attacker makes ranged attack roll (weapon or spell) whilst within 5' of a hostile creature.
 * Long range.
 * Prone target is over 5' away.
 * Dodging Target (taking dodge action)
 * Attacker has level 3 exhaustion.
 * Frightened attacker who is able to see source of fear. (regardless if target is source of fear or not)
 * Attacker is squeezing in a smaller space.
 */


/**
 *
 * @type {{[p: string]: function(*): boolean}}
 */
module.exports = {
    /**
     * Some effects impose a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_ROLL_PROPERTY_EFFECT]: attackOutcome => {
        const oAttacker = attackOutcome.attacker;
        const sAttackType = attackOutcome.attackType;

        const f = propOrEffect => propOrEffect.data.attackType === sAttackType || propOrEffect.data.attackType === CONSTS.ATTACK_TYPE_ANY;

        return aggregateModifiers([
            CONSTS.PROPERTY_DISADVANTAGE_ATTACK,
            CONSTS.EFFECT_DISADVANTAGE_ATTACK
        ], oAttacker.getters, {
            propFilter: f,
            effectFilter: f
        }).count > 0;
    },

    /**
     * Attacking an undetected target (invisible, or in dark area) imposes a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_ROLL_TARGET_UNDETECTED]: attackOutcome =>
        attackOutcome.attacker.getCreatureVisibility(attackOutcome.target) !== CONSTS.CREATURE_VISIBILITY_VISIBLE,

    /**
     * Attacking when poisoned imposes a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_ROLL_POISONED]: attackOutcome =>
        attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_POISONED),

    /**
     * Attacking when rooted imposes a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_ROLL_RESTRAINED]: attackOutcome =>
        !attackOutcome.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE),

    /**
     * Attacking when confused imposes a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_ROLL_MIND_DISORDER]: attackOutcome =>
        attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_FRIGHTENED),

    /**
     * Attacking when wearing armor and/or shield when not proficient imposes a disadvantage
     * @param attackOutcome
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_ROLL_BAD_EQUIPMENT]: attackOutcome => {
        const eqp = attackOutcome.attacker.getters.isEquipmentProficient;
        return !(eqp[CONSTS.EQUIPMENT_SLOT_CHEST] && eqp[CONSTS.EQUIPMENT_SLOT_SHIELD]);
    },

    /**
     * Attacking with ranged weapon in a windy environment imposes a disadvantage
     * @param attackOutcome {boolean}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_ROLL_WINDY_ENVIRONMENT]: attackOutcome =>
        !!attackOutcome.attacker.getters.getEnvironment[CONSTS.ENVIRONMENT_WINDY] &&
        (
            attackOutcome.attackType === CONSTS.ATTACK_TYPE_RANGED ||
            attackOutcome.attackType === CONSTS.ATTACK_TYPE_RANGED_TOUCH
        )
};
