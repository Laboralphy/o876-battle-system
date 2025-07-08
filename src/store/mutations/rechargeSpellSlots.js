/**
 * @param slot {RBSStoreStateSpellSlot}
 */
function cooldownSpellSlots (slot) {
    if (slot.cooldown > 0 && slot.cooldown !== Infinity) {
        const sscdt = slot.cooldownTimer;
        for (let i = sscdt.length - 1; i >= 0; --i) {
            --sscdt[i];
            if (sscdt[i] <= 0) {
                sscdt.splice(i, 1);
            }
        }
    }
}

/**
 * All actions are cooling down if
 * @param state {RBSStoreState}
 */
module.exports = ({ state }) => {
    /**
     * @var ss {RBSStoreStateSpellSlot[]}
     */
    const ss = state.spellSlots;
    for (let i = 0, l = ss.length; i < l; ++i) {
        /**
         * @var {RBSStoreStateSpellSlot}
         */
        const slot = ss[i];
        cooldownSpellSlots(slot);
    }
};
