const CONSTS = require('../consts')

function init ({ property, savingThrow = CONSTS.SAVING_THROW_ANY }) {
    property.data.savingThrow = savingThrow
}

module.exports = {
    init
}