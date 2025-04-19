const CONSTS = require('../consts');
const {aggregateModifiers} = require('../libs/aggregator');

/**
 * ATTACK ADVANTAGES (according to D&D 5)
 *
 * Hidden/unseen attacker : ADV_ATTACK_ROLL_UNDETECTED_BY_TARGET
 * Blinded target : ADV_ATTACK_ROLL_UNDETECTED_BY_TARGET
 * Paralyzed target : ADV_ATTACK_ROLL_TARGET_DISABLED
 * Unconscious target : ADV_ATTACK_ROLL_TARGET_DISABLED
 * Petrified target : ADV_ATTACK_ROLL_TARGET_DISABLED
 * Stunned target : ADV_ATTACK_ROLL_TARGET_DISABLED
 * Restrained target : ADV_ATTACK_ROLL_TARGET_RESTRAINED
 *
 * Attacker is helped by an ally : No helping system
 * Prone target is within 5' : No prone status currently
 * Target is squeezing in a smaller space. : No such spatial considerations
 * Using Inspiration. : No Inspiration system
 */

/**
 * Usually, advantages are granted on attack when the attacker is unseen by its target, or the target is unable to
 * properly defend itself.
 *
 * @type {{[p: string]: function(AttackOutcome): boolean}}
 */
module.exports = {
    /**
     * An effect or item property may cause advantage.
     * A short duration effect like "true strike" will grant advantage
     * An item having attack advantage property would be considered as unfair
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.ADV_ATTACK_ROLL_PROPERTY_EFFECT]: attackOutcome => {
        const oAttacker = attackOutcome.attacker;
        const sAttackType = attackOutcome.attackType;

        const f = propOrEffect => propOrEffect.data.attackType === sAttackType || propOrEffect.data.attackType === CONSTS.ATTACK_TYPE_ANY;

        return aggregateModifiers([
            CONSTS.PROPERTY_ADVANTAGE_ATTACK,
            CONSTS.EFFECT_ADVANTAGE_ATTACK
        ], oAttacker.getters, {
            propFilter: f,
            effectFilter: f
        }).count > 0;
    },

    /**
     * Attacking a disabled target (unable to fight) grants an advantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.ADV_ATTACK_ROLL_TARGET_DISABLED]: attackOutcome =>
        !attackOutcome.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT),

    /**
     * Attacking a disabled target (unable to fight) grants an advantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.ADV_ATTACK_ROLL_TARGET_RESTRAINED]: attackOutcome =>
        !attackOutcome.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE),

    /**
     * Attacking an unaware target (because attacker is invisible, stealth, or in dark area) grants an advantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.ADV_ATTACK_ROLL_UNDETECTED_BY_TARGET]: attackOutcome =>
        attackOutcome.target.getCreatureVisibility(attackOutcome.attacker) !== CONSTS.CREATURE_VISIBILITY_VISIBLE
};
