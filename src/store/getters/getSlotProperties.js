/**
 * Renvoie les propriétés classée par Slot d'équipements
 * @param state {*}
 * @returns {RBSProperties[]}
 */
module.exports = state => {
    const aProperties = []
    Object
        .entries(state.equipment)
        .forEach(([sSlot, oItem]))
}