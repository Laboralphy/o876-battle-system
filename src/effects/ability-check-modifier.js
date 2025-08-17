const { checkConst } = require('../libs/check-const');

/**
 * This effect modifies an ability check, adding a bonus (if amp > 0) or a penalty (if amp < 0)
 * @param effect {RBSEffect}
 * @param ability {string} ABILITY_*
 */
function init ({ effect, ability = undefined }) {
    if (ability) {
        effect.data.ability = checkConst(ability);
        effect.data.unviversal = false;
    } else {
        effect.data.unviversal = true;
    }
}

module.exports = {
    init
};
