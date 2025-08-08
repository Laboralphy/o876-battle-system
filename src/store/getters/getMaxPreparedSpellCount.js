/**
 * Returns the maximum number of different spell one can cast each day before resting
 * Example : caster level 5 with Int 16 (+3) can cast 5+3: 8 different spell each day
 * even if caster has more spell written in spellbook
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {number}
 */
module.exports = (state, getters) => getters.getAbilityModifiers[getters.getSpellCastingAbility] + getters.getLevel;
