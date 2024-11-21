/**
 * Défine a new value for class type
 * @param state {RBSStoreState}
 * @param value {string} CLASS_TYPE_*
 */
const {checkConst} = require("../../libs/check-const");
module.exports = ({ state }, { value }) => {
    checkConst('value', value, 'CLASS_TYPE_')
    state.classType = value
}