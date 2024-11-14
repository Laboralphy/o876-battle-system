const CONSTS = require('../consts')
function init ({ effect, damageType = CONSTS.DAMAGE_TYPE_ANY, rangeType = CONSTS.RANGE_TYPE_ANY }) {
    effect.data.damageType = damageType
    effect.data.rangeType = rangeType
}