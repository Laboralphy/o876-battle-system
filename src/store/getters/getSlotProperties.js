/**
 * Renvoie les propriétés classées par Slot d'équipements
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {{[slot: string]: RBSProperty[]}}
 */
module.exports = (state, getters) => {
    const aSlots = [
        ...getters.getDefensiveSlots,
        ...getters.getOffensiveSlots
    ]
    const oProperties = {}
    const eq = state.equipment
    aSlots
        .forEach(slot => {
            const oItem = eq[slot]
            if (!!oItem && oItem.properties.length > 0) {
                if (!(slot in oProperties)) {
                    oProperties[slot] = []
                }
                oProperties[slot].push(...oItem.properties)
            }
        })
    return oProperties
}
