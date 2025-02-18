/**
 * Défine a new value for specie
 * @param state {RBSStoreState}
 * @param value {string} SPECIE_*
 */
const {checkConst} = require('../../libs/check-const');
module.exports = ({ state }, { value }) => {
    checkConst(value);
    state.specie = value;
};
