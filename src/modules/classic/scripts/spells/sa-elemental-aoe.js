const { doDamage, getAreaOfEffectTargets } = require('../../../../libs/helpers');
const { checkConst } = require('../../../../libs/check-const');

/**
 * Elemental area of effect
 * A huge area of elemental damage is breath att all offenders
 * This is an extraordinary attack
 * If target succeed in saving throw, damage is halved
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param action.parameters.amount {number|string} amount of damage deliverer by attack
 * @param action.parameters.damageType {string} damage type (DAMAGE_TYPE_*)
 * @param creature {Creature} instance of creature attacking
 * @param target {Creature} instance of Creature targeted by this attack
 */
function main ({ manager, action, creature, target = null }) {
    const { range } = action;
    getAreaOfEffectTargets(manager, creature, target, range).forEach(offender => {
        doDamage(manager, offender, creature, {
            amount: action.parameters.amount,
            damageType: checkConst(action.parameters.damageType),
            offensiveAbility: manager.getCreatureSpellCastingAbility(creature),
            defensiveAbility: manager.CONSTS.ABILITY_DEXTERITY,
            extraordinary: false
        });
    });
}

module.exports = main;
