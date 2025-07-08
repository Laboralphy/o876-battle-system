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
    const oSpellSlot = state.spellSlots[level];
    if (oSpellSlot) {
        const ready = oSpellSlot.cooldownTimer.length < oSpellSlot.count;
        if (ready) {
            oSpellSlot.cooldownTimer.push(oSpellSlot.cooldown);
            return true;
        } else {
            return false;
        }
    } else {
        throw new Error(`No spell slot available at level ${level}`);
    }
};
