const { checkConst } = require('../../libs/check-const');

/**
 *
 * @param state {RBSStoreState}
 * @param value {string}
 */
module.exports = ({ state }, { value }) => {
    checkConst(value);
    if (!state.proficiencies.includes(value)) {
        state.proficiencies.push(value);
    }
};
