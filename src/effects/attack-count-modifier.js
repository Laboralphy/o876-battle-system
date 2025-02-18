const CONSTS = require('../consts');
const {checkConst} = require('../libs/check-const');

function init ({ effect, attackType = CONSTS.ATTACK_TYPE_ANY } = {}) {
    effect.data.attackType = checkConst(attackType);
}

module.exports = {
    init
};
