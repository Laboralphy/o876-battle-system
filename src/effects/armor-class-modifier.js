const CONSTS = require('../consts')
const {checkConst} = require("../libs/check-const");

function init ({ effect, damageType = CONSTS.DAMAGE_TYPE_ANY, attackType = CONSTS.ATTACK_TYPE_ANY }) {
    effect.data.damageType = checkConst(damageType)
    effect.data.attackType = checkConst(attackType)
}

module.exports = {
    init
}
