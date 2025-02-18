const CONSTS = require('../consts');
const {checkConst} = require('../libs/check-const');

function init ({ effect, immunityType }) {
    effect.data.immunityType = checkConst(immunityType);
}

module.exports = {
    init
};
