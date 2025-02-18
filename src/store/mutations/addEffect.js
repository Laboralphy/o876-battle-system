/**
 * Applies a non-instant effect on a creature
 * @param state {*}
 * @param effect {RBSEffect}
 * @returns {RBSEffect}
 */
module.exports = ({ state }, { effect }) => {
    return state.effects[state.effects.push(effect) - 1];
};
