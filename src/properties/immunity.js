const CONSTS = require('../consts');

/**
 * Grants immunity to one of immunity types
 * @param property
 * @param immunityType
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
