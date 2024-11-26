const CONSTS = require('../../consts')
/**
 * Return a Set with all conditions
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Set<string>}
 */
module.exports = (state, getters) => {
    const aEffectSet = getters.getEffectSet
    const aConditions = {
        CONDITION_PARALYZED: aEffectSet.has(CONSTS.EFFECT_PARALYSIS),
        CONDITION_BLINDED: aEffectSet.has(CONSTS.EFFECT_BLINDNESS),
        CONDITION_FRIGHTENED: aEffectSet.has(CONSTS.EFFECT_FEAR),
        CONDITION_CONFUSED: aEffectSet.has(CONSTS.EFFECT_CONFUSION),
        CONDITION_DISEASE: aEffectSet.has(CONSTS.EFFECT_DISEASE),
        CONDITION_RESTRAINED: getters.getSpeed === 0,
        CONDITION_INCAPACITATED: getters.isDead,
        CONDITION_POISONED: aEffectSet.has(CONSTS.EFFECT_DAMAGE) &&
            getters.getEffects.some(eff => eff.type === CONSTS.EFFECT_DAMAGE && eff.damageType === CONSTS.DAMAGE_TYPE_POISON)
    }
    return Object
        .entries(aConditions)
        .filter(([, value]) => value)
        .reduce((prev, [sCondition]) => prev.add(sCondition), new Set())
}