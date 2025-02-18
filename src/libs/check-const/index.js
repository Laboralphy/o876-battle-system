const CONSTS = require('../../consts');

/**
 * Check of const is present, or throw error
 * @param value {string}
 * @param bAllowUndefined {boolean}
 */
function checkConst (value, bAllowUndefined = false) {
    if (value === undefined) {
        if (bAllowUndefined) {
            return value;
        } else {
            throw new TypeError('This parameter of mutation, effect, or property should be defined');
        }
    }
    if (typeof value !== 'string') {
        throw new TypeError('This parameter of mutation, effect, or property should be of type string');
    }
    if (!CONSTS[value]) {
        throw new ReferenceError(`Parameter value "${value}" in invalid`);
    }
    return value;
}

module.exports = {
    checkConst
};
