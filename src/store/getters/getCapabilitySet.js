const CONSTS = require('../../consts')

/**
 * Retursna registry of thing that can do a creature
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals
 * @return {Set<string>}
 */
module.exports = (state, getters, externals) => {
    const aConditionSet = getters.getConditionSet
    const aCapabilitySet = new Set(Object.keys(CONSTS).filter(s => s.startsWith('CAPABILITY_')))
    const oConditionData = externals.CONDITIONS
    aConditionSet.forEach(sCondition => {
        const { prevents } = oConditionData[sCondition]
        prevents.forEach(p => {
            aCapabilitySet.delete(p)
        })
    })
    return aCapabilitySet
}
