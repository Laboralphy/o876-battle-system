/**
 * Return the list of effect that must be removed
 * @param state {*}
 * @returns {RBSEffect[]}
 */
module.exports = state => state.effects.filter(effect => effect.duration <= 0 && effect.depletionDelay <= 0);
