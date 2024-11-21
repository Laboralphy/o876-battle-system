/**
 * Défine a new value for race
 * @param state {RBSStoreState}
 * @param value {string} RACE_*
 */
const {checkConst} = require("../../libs/check-const");
module.exports = ({ state }, { value }) => {
    checkConst(value)
    state.race = value
}