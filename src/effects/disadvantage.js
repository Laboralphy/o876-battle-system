const {checkConst} = require("../libs/check-const");

/**
 * This effect will force a disadvantage on a d20 roll (skill, saving throw or attack)
 * @param effect {RBSEffect}
 * @param rollType {string} ROLL_TYPE_*
 * @param ability {string}
 */
function init ({ effect, rollType, ability }) {
    effect.data.rollType = checkConst(rollType)
    effect.data.ability = checkConst(ability)
}

module.exports = {
    init
}