const CONSTS = require('../consts');

/**
 * Grants immunity to one of immunity types
 * @param property {RBSProperty}
 * @param immunityType {string} IMMUNITY_TYPE_*
 */
function init ({ property, immunityType }) {
    if (!CONSTS[immunityType]) {
        throw new ReferenceError('unknown immunity type ' + immunityType);
    }
    property.data.immunityType = immunityType;
}

module.exports = {
    init
};
