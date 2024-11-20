/**
 * Défine a new value for race
 * @param state {RBSStoreState}
 * @param value {string} RACE_*
 */
module.exports = ({ state }, { value }) => {
    state.race = value
}