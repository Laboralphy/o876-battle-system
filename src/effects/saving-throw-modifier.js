const CONSTS = require('../consts')
const {checkConst} = require("../libs/check-const");

function init ({ effect, savingThrow = CONSTS.SAVING_THROW_ANY }) {
    checkConst(savingThrow)
    effect.data.savingThrow = savingThrow
}

module.exports = {
    init
}