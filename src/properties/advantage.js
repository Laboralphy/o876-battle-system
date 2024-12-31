const {checkConst} = require("../libs/check-const");

/**
 * This property will grant an advantage on a d20 roll (skill, saving throw or attack)
 * @param property {RBSProperty}
 * @param rollType {string} ROLL_TYPE_*
 * @param ability {string}
 */
function init ({ property, rollType, ability }) {
    property.data.rollType = checkConst(rollType)
    if (ability) {
        property.data.ability = checkConst(ability)
        property.data.universal = false
    } else {
        property.data.universal = true
    }
}

module.exports = {
    init
}