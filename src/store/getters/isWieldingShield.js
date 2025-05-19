const CONSTS = require('../../consts');

/**
 * returns true if creature is currently using shield
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    return !!state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] &&
        !getters.getSelectedWeaponAttributeSet.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED);
};
