const CONSTS = require('../consts');

/**
 * This effect will add a bonus or penalty to spell DC tied to an ability
 * The amp register holds the modifier
 * @param effect {RBSEffect}
 * @param ability {string} ABILITY_*
 */
function init ({ effect, ability }) {
    if (!CONSTS[ability]) {
        throw new ReferenceError('unknown ability ' + ability);
    }
    effect.data.ability = ability;
}

module.exports = {
    init
};
