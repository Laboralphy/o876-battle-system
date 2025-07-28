/**
 * Prepare / unprepare a known spell
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param spell {string}
 * @param value {boolean}
 */
module.exports = ({ state, getters }, { spell, value }) => {
    const aPreparedSpells = new Set(getters.getPreparedSpells);
    if (aPreparedSpells.has(spell) && value) {
        // spell already prepared
        return;
    }
    if (!aPreparedSpells.has(spell) && !value) {
        // cannot unprepared an unprepared spell
        return;
    }
    const nMaxPreparedSpells = getters.getMaxPreparedSpells;
    if (aPreparedSpells.size >= nMaxPreparedSpells && value) {
        // Cannot prepare more spell than possible
        return;
    }

    if (spell in state.spells) {
        state.spells[spell].prepared = value;
    }
};
