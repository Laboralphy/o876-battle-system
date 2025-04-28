const { checkConst } = require('../libs/check-const');

/**
 * This effect will grant an advantage on a d20 roll (skill, saving throw or attack)
 * @param effect {RBSEffect}
 * @param universal {boolean}
 * @param ability {string} ABILITY_*
 * @param threat {string} THREAT_*
 */
function init ({ effect, universal = false, ability = '', threat = '' }) {
    if (universal) {
        effect.data.universal = true;
        effect.data.ability = '';
    } else {
        const sAbility = ability || threat;
        effect.data.universal = false;
        effect.data.ability = checkConst(sAbility);
    }
}

module.exports = {
    init
};
