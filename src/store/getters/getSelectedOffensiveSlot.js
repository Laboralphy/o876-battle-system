/**
 * Returns current selected offensive slot
 * @param state {RBSStoreState}
 * @returns {string} EQUIPMENT_SLOT_WEAPON_MELEE or RANGED
 */
module.exports = state => state.selectedOffensiveSlot;
