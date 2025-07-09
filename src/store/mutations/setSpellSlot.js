/**
 * Défine a new value for a given spell slot level
 * @param state {RBSStoreState}
 * @param level {number}
 * @param count {number|undefined}
 * @param cooldown {number|undefined}
 */
module.exports = ({ state }, { level, count = undefined, cooldown = undefined }) => {
    if (level < state.spellSlots.length) {
        const ss = state.spellSlots[level];
        if (count !== undefined) {
            ss.count = count;
        }
        if (cooldown !== undefined) {
            ss.cooldown = cooldown;
        }
    }
};
