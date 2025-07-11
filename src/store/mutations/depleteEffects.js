/**
 * naturally depletes all effects when their duration has reached 0
 * @param state {RBSStoreState}
 */
module.exports = ({ state }) => {
    state.effects.forEach(effect => {
        if (effect.duration === 0 && effect.depletionDelay > 0) {
            --effect.depletionDelay;
        }
    });
};
