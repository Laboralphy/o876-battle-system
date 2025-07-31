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
 * @param attackOutcome {AttackOutcome}
 */
function attack ({ attack: attackOutcome }) {
    if (attackOutcome.ability === property.data.ability) {
        // reduce all physical damages
        Object
            .entries(attackOutcome.damages.types)
            .forEach(([sType, nAmount]) => {
                attackOutcome.damages.types[sType] = Math.max(1, Math.floor(nAmount / 2));
            });
    }
}

module.exports = {
    init,
    attack
};
