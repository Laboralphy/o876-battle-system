const CONSTS = require('../../consts');

/**
 * Returns true if current weapon is two handed
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const wa = getters.getSelectedWeaponAttributeSet;
    return wa.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED) || (
        wa.has(CONSTS.WEAPON_ATTRIBUTE_VERSATILE) && !getters.isWieldingShield
    );
};
