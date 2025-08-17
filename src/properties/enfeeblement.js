/**
 * The creature becomes weak and all attacks using a certain ability will have its damage output halved
 * @param effect {RBSProperty}
 * @param ability {string} ABILITY_*
 */
function init ({ property, ability }) {
    property.data.ability = ability;
}

/**
 * Half the damages of any attack using the effect ability
 * @param property {RBSProperty}
 * @param attackOutcome {AttackOutcome}
 */
function attack ({ property, attack: attackOutcome }) {
    if (attackOutcome.ability === property.data.ability) {
        // reduce all physical damages
        Object
            .values(attackOutcome.damages.types)
            .forEach((oDamType) => {
                oDamType.amount = Math.max(1, Math.floor(oDamType.amount / 2));
            });
    }
}

module.exports = {
    init,
    attack
};
