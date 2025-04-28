const CONSTS = require('../../consts');
const {aggregateModifiers} = require('../../libs/aggregator');

function getAbilitySavingThrowProficiency (sAbility) {
    switch (sAbility) {
    case CONSTS.ABILITY_STRENGTH: {
        return CONSTS.PROFICIENCY_SAVING_THROW_STRENGTH;
    }
    case CONSTS.ABILITY_DEXTERITY: {
        return CONSTS.PROFICIENCY_SAVING_THROW_DEXTERITY;
    }
    case CONSTS.ABILITY_CONSTITUTION: {
        return CONSTS.PROFICIENCY_SAVING_THROW_CONSTITUTION;
    }
    case CONSTS.ABILITY_INTELLIGENCE: {
        return CONSTS.PROFICIENCY_SAVING_THROW_INTELLIGENCE;
    }
    case CONSTS.ABILITY_WISDOM: {
        return CONSTS.PROFICIENCY_SAVING_THROW_WISDOM;
    }
    case CONSTS.ABILITY_CHARISMA: {
        return CONSTS.PROFICIENCY_SAVING_THROW_CHARISMA;
    }
    default: {
        throw new Error('unknown saving throw ability ' + sAbility);
    }
    }
}

/**
 * Returns all saving throws bonus
 * @param state {RBSStoreState}
 * @param getters {RBSStoreState}
 * @return {Object<string, number>}
 */
module.exports = (state, getters) => {
    const UNIVERSAL = 'UNIVERSAL';
    const { sorter } = aggregateModifiers([
        CONSTS.PROPERTY_SAVING_THROW_MODIFIER,
        CONSTS.EFFECT_SAVING_THROW_MODIFIER
    ], getters, {
        propSorter: prop => prop.data.universal ? UNIVERSAL : prop.data.ability,
        effectSorter: effect => effect.data.universal ? UNIVERSAL : effect.data.ability
    });
    const nUniversalBonus = UNIVERSAL in sorter ? sorter[UNIVERSAL].sum : 0;
    const results = {
        [CONSTS.ABILITY_STRENGTH]: nUniversalBonus,
        [CONSTS.ABILITY_DEXTERITY]: nUniversalBonus,
        [CONSTS.ABILITY_CONSTITUTION]: nUniversalBonus,
        [CONSTS.ABILITY_INTELLIGENCE]: nUniversalBonus,
        [CONSTS.ABILITY_WISDOM]: nUniversalBonus,
        [CONSTS.ABILITY_CHARISMA]: nUniversalBonus
    };
    for (const ability of Object.keys(results)) {
        const sProficiency = getAbilitySavingThrowProficiency(ability);
        const bProficient = getters.getProficiencySet.has(sProficiency);
        const nProfBonus = bProficient ? getters.getProficiencyBonus : 0;
        const nPropEffectBonus = ability in sorter ? sorter[ability].sum : 0;
        results[ability] += nPropEffectBonus + nProfBonus;
    }
    for (const [sThreat, { sum: nThreatBonus }] of Object.entries(sorter)) {
        if (!(sThreat in results)) {
            results[sThreat] = nThreatBonus;
        }
    }
    return results;
};
