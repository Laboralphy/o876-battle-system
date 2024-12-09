const CONSTS = require('../../consts')
/**
 * Renvoie la liste des slots offensifs pouvant servir à une attaque
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {string[]}
 */
module.exports = (state, getters) => {
    const sOffensiveSlot = state.selectedOffensiveSlot
    const aSlots = [sOffensiveSlot]
    if (sOffensiveSlot === CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED && getters.isRangedWeaponLoaded) {
        aSlots.push(CONSTS.EQUIPMENT_SLOT_AMMO)
    }
    const eq = state.equipment
    return aSlots
        .filter(slot => eq[slot] !== null)
}
