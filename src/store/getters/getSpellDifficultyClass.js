const CONSTS = require('../../consts');

const { aggregateModifiers } = require('../../libs/aggregator');
const {filterAbility} = require('../../libs/props-effects-filters');

/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {{}}
 * @return {{[ability: string]: number}}
 */
module.exports = (state, getters, externals) => {
    const spellPower = aggregateModifiers([
        CONSTS.PROPERTY_SPELL_POWER,
        CONSTS.EFFECT_SPELL_POWER
    ], getters, {
        propSorter: filterAbility,
        effectSorter: filterAbility
    });
    const result = getters.getAbilityModifiers;
    return Object.fromEntries(
        Object
            .entries(result)
            .map(([ sAbility, nAbilityModifier ]) => [
                sAbility,
                getters.getProficiencyBonus + nAbilityModifier + externals.VARIABLES.BASE_SPELL_DIFFICULTY_CLASS + (spellPower[sAbility]?.sum || 0)
            ])
    );
};
