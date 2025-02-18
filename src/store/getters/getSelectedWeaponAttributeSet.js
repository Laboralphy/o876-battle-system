/**
 * Returns current selected weapon attributes
 * @param state {RBSStoreState}
 * @returns {Set<string>}
 */
module.exports = (state, getters) => {
    const w = getters.getSelectedWeapon;
    if (w) {
        return new Set(w.blueprint.attributes);
    } else {
        return new Set();
    }
};
