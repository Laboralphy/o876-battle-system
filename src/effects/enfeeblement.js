const {CONSTS} = require('../../index');

/**
 * The creature becomes weak and all attacks using a certain ability will have its damage output halved
 * @param effect {RBSEffect}
 * @param ability {string} ABILITY_*
 */
function init ({ effect, ability }) {
    effect.data.ability = ability;
}

/**
 * Half the damages of any attack using the effect ability
 * @param attackOutcome {AttackOutcome}
 * @param effect {RBSEffect}
 */
function attack ({ effect, attack: attackOutcome }) {
    if (attackOutcome.ability === effect.data.ability) {
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
