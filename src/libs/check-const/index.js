const CONSTS = require('../../consts')

/**
 * Check of const is present, or throw error
 * @param sProperty {string}
 * @param value {string}
 * @param sRequiredPrefix {string}
 */
function checkConst (sProperty, value, sRequiredPrefix = '') {
    if (typeof value !== 'string') {
        throw new TypeError(`Parameter ${sProperty} of effect/property should be of type string`)
    }
    if (sRequiredPrefix && !value.startsWith(sRequiredPrefix)) {
        throw new TypeError(`Parameter ${sProperty} of effect/property should start with ${sRequiredPrefix}`)
    }
    if (!CONSTS[value]) {
        throw new ReferenceError(`Parameter "${sProperty}" in invalid`)
    }
}

module.exports = {
    checkConst
}