/**
 *
 * @param state {RBSStoreState}
 * @return {{level: number, count: number, used: number, remaining: number, ready: boolean, cooldown: number}[]}
 */
module.exports = (state) => state.spellSlots.map(({ level, cooldown, cooldownTimer, count }) => {
    if (!Array.isArray(cooldownTimer)) {
        throw new TypeError('cooldownTimer should be an array of numbers');
    }
    const used = cooldownTimer.length;
    const remaining = count - used;
    const ready = remaining > 0;

    return {
        level,
        count,
        used,
        remaining,
        ready,
        cooldown: ready ? 0 : cooldownTimer[0]
    };
});
