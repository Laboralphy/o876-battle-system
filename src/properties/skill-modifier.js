/**
 * This property can apply bonus/malus to a skill
 * @param effect {RBSEffect}
 * @param skill {string}
 */
function init ({ property, skill }) {
    property.data.skill = skill
}

module.exports = {
    init
}