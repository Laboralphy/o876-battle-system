const CONSTS = require('../consts');
const { checkConst } = require('../libs/check-const');

function init ({ effect, ability = undefined, threat = undefined }) {
    const sType = ability || threat;
    if (sType) {
        effect.data.ability = checkConst(sType);
        effect.data.universal = false;
    } else {
        effect.data.universal = true;
    }
}

/**
 * Effect is rejected if amp is negative and target is immune to saving throw decrease
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (effect.amp < 0 && target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_SAVING_THROW_DECREASE)) {
        reject();
    }
}

module.exports = {
    init,
    apply
};
