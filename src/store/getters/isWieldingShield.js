const CONSTS = require('../../consts')

/**
 * returns true if creature is currently using shield
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    if (getters.isWieldingTwoHandedWeapon) {
        return false
    }
    return !!state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD]
}