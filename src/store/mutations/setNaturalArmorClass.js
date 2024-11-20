/**
 * Défine a new value for natural armor class (without any equipment, and dex bonus)
 * @param state {RBSStoreState}
 * @param value {number}
 */
module.exports = ({ state }, { value }) => {
    state.naturalArmorClass = value
}
