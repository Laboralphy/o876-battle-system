const CONSTS = require('../../consts')

/**
 * Check of const is present, or throw error
 * @param value {string}
 */
function checkConst (value) {
    if (typeof value !== 'string') {
        throw new TypeError(`This parameter of mutation, effect, or property should be of type string`)
    }
    if (!CONSTS[value]) {
        throw new ReferenceError(`Parameter value "${value}" in invalid`)
    }
    return value
}

module.exports = {
    checkConst
}