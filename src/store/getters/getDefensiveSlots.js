const CONSTS = require('../../consts');
/**
 * Returns a list of defensive equipment slots (only those with equipped weapon/ammo)
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {string[]}
 */
module.exports = (state, getters) => {
    const aSlots = [
        CONSTS.EQUIPMENT_SLOT_HEAD,
        CONSTS.EQUIPMENT_SLOT_NECK,
        CONSTS.EQUIPMENT_SLOT_CHEST,
        CONSTS.EQUIPMENT_SLOT_BACK,
        CONSTS.EQUIPMENT_SLOT_ARMS,
        CONSTS.EQUIPMENT_SLOT_FINGER_LEFT,
        CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT,
        CONSTS.EQUIPMENT_SLOT_WAIST,
        CONSTS.EQUIPMENT_SLOT_FEET
    ];
    if (!getters.isWieldingTwoHandedWeapon) {
        aSlots.push(CONSTS.EQUIPMENT_SLOT_SHIELD);
    }
    const eq = state.equipment;
    return aSlots
        .filter(slot => eq[slot] !== null);
};
