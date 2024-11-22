const CONSTS = require('../consts')
const {checkConst} = require("../libs/check-const");

function init ({ effect, savingThrow = CONSTS.SAVING_THROW_ANY }) {
    effect.data.savingThrow = checkConst(savingThrow)
}

module.exports = {
    init
}