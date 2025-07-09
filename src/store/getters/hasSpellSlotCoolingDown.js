/**
 * Returns true if creature has some spell slot cooling down
 * @param state {RBSStoreState}
 * @return {boolean}
 */
module.exports = state => state.spellSlots.some(ss => ss.cooldownTimer.length > 0);
