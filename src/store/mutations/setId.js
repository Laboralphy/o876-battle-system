/**
 * Change a creature id
 * @param state {*}
 * @param id {string}
 */
module.exports = ({ state }, { value }) => {
    state.id = value
}