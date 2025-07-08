/**
 *
 * @param state {RBSStoreState}
 * @return {{level: number, count: number, used: number, remaining: number}[]}
 */
module.exports = (state) => state.spellSlots.map(s => {
    const count = s.count;
    const used = s.cooldownTimer.length;
    const remaining = count - used;
    return {
        level: s.level,
        count,
        used,
        remaining
    };
});
