/**
 * This effect can apply bonus/malus to a skill
 * @param effect {RBSEffect}
 * @param skill {string}
 */
function init ({ effect, skill }) {
    effect.data.skill = skill;
}

module.exports = {
    init
};
