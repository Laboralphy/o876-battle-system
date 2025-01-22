const CONSTS = require('../../consts')

const SELECTABLE_SLOTS = new Set([
    CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED,
    CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3
])

/**
 * Select an offensive slot
 * @param state {RBSStoreState}
 * @param value {string}
 */
module.exports = ({ state }, { value }) => {
    if (!SELECTABLE_SLOTS.has(value)) {
        throw new Error(`invalid offensive slot : ${value}`)
    }
    if (state.selectedOffensiveSlot !== value) {
        state.selectedOffensiveSlot = value
    }
}