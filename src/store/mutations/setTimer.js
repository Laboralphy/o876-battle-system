/**
 * Replace timer value
 * @param state {RBSStoreState}
 * @param timer {string}
 * @param value {number}
 */
module.exports = ({ state }, { timer, value }) => {
    if (timer in state.timers) {
        state.timers[timer] = value;
    }
};
