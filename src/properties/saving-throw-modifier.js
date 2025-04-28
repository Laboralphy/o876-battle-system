const { checkConst } = require('../libs/check-const');

function init ({ property, ability = '', threat = '' }) {
    const sType = ability || threat;
    if (sType) {
        property.data.ability = checkConst(sType);
        property.data.universal = false;
    } else {
        property.data.universal = true;
    }
}

module.exports = {
    init
};
