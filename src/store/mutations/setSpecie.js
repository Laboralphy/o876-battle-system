/**
 * Défine a new value for specie
 * @param state {RBSStoreState}
 * @param value {string} SPECIE_*
 */
module.exports = ({ state }, { value }) => {
    state.specie = value
}