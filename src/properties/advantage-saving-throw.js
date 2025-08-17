const { checkConst } = require('../libs/check-const');

/**
 * This property will grant an advantage on a d20 roll (skill, saving throw or attack)
 * @param property {RBSProperty}
 * @param universal {boolean}
 * @param ability {string} ABILITY_*
 * @param threat {string} THREAT_*
 */
function init ({ property, universal = false, ability = '', threat = '' }) {
    if (!ability && !threat) {
        universal = true;
    }
    if (universal) {
        property.data.universal = true;
        property.data.ability = '';
    } else {
        const sAbility = ability || threat;
        property.data.universal = false;
        property.data.ability = checkConst(sAbility);
    }
}

module.exports = {
    init
};
