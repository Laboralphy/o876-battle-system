const CONSTS = require('../consts')

function init ({ effect, damageType = CONSTS.DAMAGE_TYPE_ANY, rangeType = CONSTS.ATTACK_TYPE_ANY }) {
    effect.data.damageType = damageType
    effect.data.rangeType = rangeType
}

module.exports = {
    init
}
