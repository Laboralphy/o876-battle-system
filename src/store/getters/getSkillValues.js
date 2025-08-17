const CONSTS = require('../../consts');
const { aggregateModifiers } = require('../../libs/aggregator');

/**
 * Returns all skill modifiers
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 * @return {Object<string, number>}
 */

module.exports = (state, getters, externals) => {
    const profs = getters.getProficiencySet;
    const oAbilityModifier = getters.getAbilityModifiers;
    const { sorter: oSkillModifiers } = aggregateModifiers([
        CONSTS.EFFECT_SKILL_MODIFIER,
        CONSTS.PROPERTY_SKILL_MODIFIER
    ], getters, {
        propSorter: prop => prop.data.skill,
        effectSorter: effect => effect.data.skill
    });
    const { sorter: oAbilityCheckModifiers } = aggregateModifiers([
        CONSTS.EFFECT_ABILITY_CHECK_MODIFIER,
        CONSTS.PROPERTY_ABILITY_CHECK_MODIFIER
    ], getters, {
        propSorter: prop => prop.data.unviversal ? 'universal' : prop.data.ability,
        effectSorter: effect => effect.data.unviversal ? 'universal' : effect.data.skill
    });
    const oSkillData = externals['SKILLS'];
    const nAbilityCheckUniversalModifier = oAbilityModifier['universal']?.sum ?? 0;
    return Object.fromEntries(Object
        .entries(oSkillData)
        .map(([ skill, { ability, proficiency } ]) => {
            const sm = oSkillModifiers[skill]?.sum ?? 0;
            const sam = oSkillModifiers[ability]?.sum ?? 0;
            const acm = nAbilityCheckUniversalModifier + (oAbilityCheckModifiers[ability]?.sum ?? 0);
            const am = oAbilityModifier[ability];
            const pb = profs.has(proficiency) ? getters.getProficiencyBonus : 0;
            return [skill, sm + am + sam + acm + pb];
        })
    );
};
