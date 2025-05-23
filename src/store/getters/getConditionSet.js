const CONSTS = require('../../consts');
/**
 * Return a Set with all conditions
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Set<string>}
 */
module.exports = (state, getters) => {
    const aEffectSet = getters.getEffectSet;
    const aConditions = {
        [CONSTS.CONDITION_BLINDED]: aEffectSet.has(CONSTS.EFFECT_BLINDNESS),
        [CONSTS.CONDITION_CHARMED]: aEffectSet.has(CONSTS.EFFECT_CHARM),
        [CONSTS.CONDITION_FRIGHTENED]: aEffectSet.has(CONSTS.EFFECT_FEAR),
        [CONSTS.CONDITION_INCAPACITATED]: getters.isDead,
        [CONSTS.CONDITION_PARALYZED]: aEffectSet.has(CONSTS.EFFECT_PARALYSIS),
        [CONSTS.CONDITION_PETRIFIED]: aEffectSet.has(CONSTS.EFFECT_PETRIFICATION),
        [CONSTS.CONDITION_POISONED]: aEffectSet.has(CONSTS.EFFECT_DAMAGE) &&
            getters.getEffects.some(eff => eff.type === CONSTS.EFFECT_DAMAGE && eff.data.damageType === CONSTS.DAMAGE_TYPE_POISON),
        [CONSTS.CONDITION_RESTRAINED]: getters.getSpeed === 0,
        [CONSTS.CONDITION_STUNNED]: aEffectSet.has(CONSTS.EFFECT_STUN)
    };
    return Object
        .entries(aConditions)
        .filter(([, value]) => value)
        .reduce((prev, [sCondition]) => prev.add(sCondition), new Set());
};
