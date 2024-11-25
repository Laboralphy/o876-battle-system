/**
 * Renvoie les propriétés classées par Slot d'équipements
 * @param state {*}
 * @returns {{[slot: string]: RBSProperty[]}}
 */
module.exports = state => {
    const oProperties = {}
    Object
        .entries(state.equipment)
        .filter(([, oItem]) => !!oItem && oItem.properties.length > 0)
        .forEach(([sSlot, oItem]) => {
            if (!(sSlot in oProperties)) {
                oProperties[sSlot] = []
            }
            oProperties[sSlot].push(...oItem.properties)
        })
    return oProperties
}
