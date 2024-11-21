/**
 * changes value of an ability
 * @param state {RBSStoreState}
 * @param ability {string}
 * @param value {number}
 */
const {checkConst} = require("../../libs/check-const");
module.exports = ({ state }, { ability, value }) => {
    checkConst('ability', ability, 'ABILITY_')
    if (ability in state.abilities) {
        state.abilities[ability] = value
    } else {
        throw new ReferenceError(`This ability does not exist ${ability}`)
    }
}
