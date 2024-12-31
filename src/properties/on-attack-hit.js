const CONSTS = require("../consts");

/**
 * This property will be applied an effect on anybody hit by attack
 * @param property {RBSProperty}
 * @param chance {string} Dice expression
 * @param savingThrow {string} ability
 * @param extraParams {string}
 * @param ailment {string}
 */
function init ({ property, ailment, chance = '', savingThrow = '', extraParams = '' }) {
    if (!CONSTS[ailment]) {
        throw new ReferenceError('unknown ailment ' + ailment)
    }
    property.data.ailment = ailment
    property.data.savingThrow = savingThrow
    property.data.chance = chance
    property.data.extraParams = extraParams
}

function attack ({ property, item, creature, manager, attack }) {
    const oDicer = attack.attacker
    if (property.data.chance) {
        if (oDicer.dice.roll(property.data.chance) > 1) {
            return
        }
    }
    if (property.data.savingThrow) {

    }
}

module.exports = {
    init,
    attack
}