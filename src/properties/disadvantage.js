const {checkConst} = require("../libs/check-const");

/**
 * This property will force a disadvantage on a d20 roll (skill, saving throw or attack)
 * @param property {RBSProperty}
 * @param rollType {string} ROLL_TYPE_*
 * @param ability {string}
 */
function init ({ property, rollType, ability }) {
    property.data.rollType = checkConst(rollType)
    property.data.ability = checkConst(ability)
}

module.exports = {
    init
}