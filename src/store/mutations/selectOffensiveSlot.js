const CONSTS = require('../../consts')

/**
 * Select an offensive slot
 * @param state {RBSStoreState}
 * @param value {string}
 */
module.exports = ({ state }, { value }) => {
    if (value === CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED || value === CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED) {
        if (state.selectedOffensiveSlot !== value) {
            state.selectedOffensiveSlot = value
        }
    } else {
        throw new Error(`invalid offensive slot : ${value}`)
    }
}