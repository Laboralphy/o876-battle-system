const CONSTS = require('../../consts')
const {checkConst} = require("../../libs/check-const");
/**
 * @param state {RBSStoreState}
 * @param externals {{}}
 * @param item {RBSItem}
 * @param slot {string}
 * @param bypassCurse {boolean}
 * @returns {*}
 */
module.exports = ({ state }, { item, slot = '', bypassCurse = false }) => {
    if (slot) {
        checkConst(slot)
    }
    const aAllowedSlots = item.blueprint.equipmentSlots
    let sUseSlot = aAllowedSlots.includes(slot) ? slot : ''
    for (const s of aAllowedSlots) {
        if (!state.equipment[s]) {
            sUseSlot = s
            break
        }
    }
    if (!sUseSlot) {
        sUseSlot = aAllowedSlots[0]
    }
    const oPrevItem = state.equipment[sUseSlot]
    if (oPrevItem) {
        // Verifier si l'objet est maudit
        if (!bypassCurse && !!oPrevItem.properties.find(ip => ip.type === CONSTS.PROPERTY_CURSED)) {
            return {
                previousItem: oPrevItem,
                newItem: item,
                slot: sUseSlot,
                cursed: true
            }
        }
    }
    state.equipment[sUseSlot] = item
    return {
        previousItem: oPrevItem,
        newItem: item,
        slot: sUseSlot,
        cursed: false
    }
}