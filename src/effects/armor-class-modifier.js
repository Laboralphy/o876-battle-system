const CONSTS = require('../consts')

function init ({ effect, damageType = CONSTS.DAMAGE_TYPE_ANY, attackType = CONSTS.ATTACK_TYPE_ANY }) {
    effect.data.damageType = damageType
    effect.data.attackType = attackType
}

module.exports = {
    init
}
