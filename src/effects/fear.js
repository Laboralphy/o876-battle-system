const CONSTS = require('../consts');

/**
 * Effect is rejected if target is immune to fear
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param source {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, source, reject }) {
    if (target.getters.getEffectSet.has(CONSTS.EFFECT_PROTECTION_FROM_EVIL) && source.getters.isSpecieEvil) {
        reject();
    }
    if (target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_FEAR)) {
        reject();
    }
}

module.exports = {
    apply
};
