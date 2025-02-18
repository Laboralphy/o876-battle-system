/**
 * Défine a new value for gender
 * @param state {RBSStoreState}
 * @param value {string} GENDER_*
 */
const {checkConst} = require('../../libs/check-const');
module.exports = ({ state }, { value }) => {
    checkConst(value);
    state.gender = value;
};
