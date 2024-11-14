/**
 * Return the list of currently running effects
 * @param state {*}
 * @returns {RBSEffect[]}
 */
module.exports = state => Object
    .values(state.effects)
    .filter(effect => effect.duration > 0)