const {checkConst} = require('../libs/check-const');
const CONSTS = require('../consts');

function init ({ effect,  damageType: sDamageType }) {
    effect.data.damageType = checkConst(sDamageType);
}


/**
 * Effect is rejected if amp is negative and target is immune to damage decrease
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (effect.amp < 0 && target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_DAMAGE_DECREASE)) {
        reject();
    }
}

module.exports = {
    init,
    apply
};
