/**
 * Change a creature id
 * @param state {*}
 * @param id {string}
 */
module.exports = ({ state }, { id }) => {
    state.id = id
}