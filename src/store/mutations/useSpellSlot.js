/**
 * Will update cooldown and charges as spell slot is being used
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param level {number}
 */
module.exports = ({ state, getters }, { level }) => {
    /**
     * @var {RBSStoreStateSpellSlot}
     */
    if (level < 0 || level >= state.spellSlots.length) {
        throw new Error(`Invalid spell slot level ${level}`);
    }
    const { count, cooldownTimer, cooldown } = state.spellSlots[level];
    if (count === Infinity) {
        return true;
    }
    const ready = cooldownTimer.length < count;
    if (ready) {
        cooldownTimer.push(cooldown);
        return true;
    } else {
        return false;
    }
};
