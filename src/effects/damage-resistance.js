const {checkConst} = require('../libs/check-const');

function init ({ effect, damageType: sDamageType }) {
    effect.data.damageType = checkConst(sDamageType);
}

module.exports = {
    init
};
