const {checkConst} = require("../libs/check-const");

function init ({ effect, ability }) {
    effect.data.ability = checkConst(ability)
}

module.exports = {
    init
}