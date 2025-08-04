const CONSTS = require('../consts');

/**
 * Effect is rejected if target is immune to charm
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param source {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, source, reject }) {
    if (target.getters.getSpecieProtectionSet.has(source.getters.getSpecie)) {
        reject();
    }
    if (target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_CHARM)) {
        reject();
    }
}

module.exports = {
    apply
};
