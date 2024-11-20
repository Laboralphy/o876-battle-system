const CONSTS = require("../consts");

/**
 * This property will add a bonus or penalty to an ability value
 * The amp register holds the modifier
 * @param property {RBSProperty}
 * @param ability {string} ABILITY_*
 */
function init ({ property, ability }) {
    if (!CONSTS[ability]) {
        throw new ReferenceError('unknown ability ' + ability)
    }
    property.data.ability = ability
}

module.exports = {
    init
}