const { checkConst } = require('../libs/check-const')

/**
 * This effect modifies an ability, adding a bonus (if amp > 0) or a penalty (if amp < 0)
 * @param effect {RBSEffect}
 * @param ability {string} ABILITY_*
 */
function init ({ effect, ability }) {
    effect.data.ability = checkConst(ability)
}

module.exports = {
    init
}