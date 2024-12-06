const CONSTS = require("../consts");

/**
 * This property will be applied an effect on anybody hit by attack
 * @param property {RBSProperty}
 * @param ailment {string}
 */
function init ({ property, ailment }) {
    if (!CONSTS[ailment]) {
        throw new ReferenceError('unknown ailment ' + ailment)
    }
    property.data.ailment = ailment
}

function onWeaponHit ({ property, manager, attack }) {
    //
}

module.exports = {
    init,
    onWeaponHit
}