const { checkConst } = require('../libs/check-const')

function init ({ property, ability = '' }) {
    if (ability) {
        property.data.ability = checkConst(ability)
        property.data.universal = false
    } else {
        property.data.universal = true
    }
}

module.exports = {
    init
}