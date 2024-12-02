const CONSTS = require('../../consts')
/**
 * Renvoie les propriétés classées par Slot d'équipements, uniquement les propriété des objet servant à l'offensive
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {string[]}
 */
module.exports = (state, getters) => {
    const sOffensiveSlot = state.offensiveSlot
    const aSlots = [sOffensiveSlot]
    if (sOffensiveSlot === CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED && getters.isRangedWeaponLoaded) {
        aSlots.push(CONSTS.EQUIPMENT_SLOT_AMMO)
    }
    const eq = state.equipment
    return aSlots
        .filter(slot => eq[slot] !== null)
}
