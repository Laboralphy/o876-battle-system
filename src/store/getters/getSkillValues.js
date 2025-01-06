const CONSTS = require('../../consts')
const { aggregateModifiers } = require("../../libs/aggregator");

/**
 * Returns all skill modifiers
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 * @return {{[skill: string]: number}}
 */

module.exports = (state, getters, externals) => {
    const profs = getters.getProficiencySet
    const oAbilityModifier = getters.getAbilityModifiers
    const { sorter: oSkillModifiers } = aggregateModifiers([
        CONSTS.EFFECT_SKILL_MODIFIER,
        CONSTS.PROPERTY_SKILL_MODIFIER
    ], getters, {
        propSorter: prop => prop.data.skill,
        effectSorter: effect => effect.data.skill
    })
    const oSkillData = externals['SKILLS']
    return Object.fromEntries(Object
        .entries(oSkillData)
        .map(([ skill, { ability, proficiency } ]) => {
            const sm = oSkillModifiers[skill]?.sum || 0
            const am = oAbilityModifier[ability]
            const pb = profs.has(proficiency) ? getters.getProficiencyBonus : 0
            return [skill, sm + am + pb]
        })
    )
}
