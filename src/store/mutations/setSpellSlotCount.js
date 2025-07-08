/**
 * Défine a new value for a given spell slot level
 * @param state {RBSStoreState}
 * @param level {number}
 * @param count {number}
 */
module.exports = ({ state }, { level, count }) => {
    if (level < state.spellSlots.length) {
        state.spellSlots[level].count = count;
    }
};
