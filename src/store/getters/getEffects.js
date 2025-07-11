/**
 * Return the list of currently running effects
 * @param state {*}
 * @returns {RBSEffect[]}
 */
module.exports = state => state.effects.filter(effect => effect.duration > 0 || effect.depletionDelay > 0);
