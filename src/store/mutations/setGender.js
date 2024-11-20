/**
 * Défine a new value for gender
 * @param state {RBSStoreState}
 * @param value {string} GENDER_*
 */
module.exports = ({ state }, { value }) => {
    state.gender = value
}