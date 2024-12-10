const { aggregateModifiers } = require('../../libs/aggregator')
const CONSTS = require('../../consts')

function addMitigationType (oMitig, sType) {
    if (!(sType in oMitig)) {
        oMitig[sType] = {
            reduction: 0,
            resistance: false,
            vulnerability: false,
            immunity: false,
            factor: 1
        }
    }
}

function addMitigation(oMitig, am) {
    Object
        .keys(am.sorter)
        .forEach(t => {
            addMitigationType(oMitig, t)
        })
}

/**
 * @typedef RBSOneDamageMitigation {object}
 * @property reduction {number}
 * @property factor {number}
 * @property resistance {boolean}
 * @property vulnerability {boolean}
 * @property immunity {boolean}
 *
 * @param state
 * @param getters
 * @param externals {*}
 * @returns {Object<string, RBSOneDamageMitigation>}}
 */
module.exports = (state, getters, externals) => {
    const {
        DAMAGE_FACTOR_IMMUNITY,
        DAMAGE_FACTOR_RESISTANCE,
        DAMAGE_FACTOR_VULNERABILITY
    } = externals['DAMAGE_FACTORS']
    const fDamageEffectSorter = eff => {
        return eff.data.damageType
    }
    const fDamagePropSorter = prop => prop.data.damageType
    const oReduction = aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_REDUCTION,
        CONSTS.PROPERTY_DAMAGE_REDUCTION
    ], getters, {
        effectSorter: fDamageEffectSorter,
        propSorter: fDamagePropSorter
    })
    const oResistance = aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_RESISTANCE,
        CONSTS.PROPERTY_DAMAGE_RESISTANCE
    ], getters, {
        effectSorter: fDamageEffectSorter,
        propSorter: fDamagePropSorter
    })
    const oVulnerability = aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_VULNERABILITY,
        CONSTS.PROPERTY_DAMAGE_VULNERABILITY
    ], getters, {
        effectSorter: fDamageEffectSorter,
        propSorter: fDamagePropSorter
    })
    const oImmunity = aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_IMMUNITY,
        CONSTS.PROPERTY_DAMAGE_IMMUNITY
    ], getters, {
        effectSorter: fDamageEffectSorter,
        propSorter: fDamagePropSorter
    })
    const oMitigation = {}
    addMitigation(oMitigation, oReduction)
    addMitigation(oMitigation, oResistance)
    addMitigation(oMitigation, oVulnerability)
    addMitigation(oMitigation, oImmunity)
    Object
        .entries(oReduction.sorter)
        .forEach(([sDamType, oReg]) => {
            oMitigation[sDamType].reduction += oReg.sum
        })
    Object
        .entries(oResistance.sorter)
        .forEach(([sDamType, oReg]) => {
            oMitigation[sDamType].resistance ||= oReg.count > 0
        })
    Object
        .entries(oVulnerability.sorter)
        .forEach(([sDamType, oReg]) => {
            oMitigation[sDamType].vulnerability ||= oReg.count > 0
        })
    Object
        .entries(oImmunity.sorter)
        .forEach(([sDamType, oReg]) => {
            oMitigation[sDamType].immunity ||= oReg.count > 0
        })
    Object
        .entries(oMitigation)
        .forEach(([, oReg]) => {
            const i = oReg.immunity ? 'i': ''
            const r = oReg.resistance ? 'r' : ''
            const v = oReg.vulnerability ? 'v' : ''
            switch (i + r + v) {
                case 'i':
                case 'ir':
                case 'iv':
                case 'irv': {
                    oReg.factor = DAMAGE_FACTOR_IMMUNITY
                    break
                }
                case 'r': {
                    oReg.factor = DAMAGE_FACTOR_RESISTANCE
                    break
                }
                case 'v': {
                    oReg.factor = DAMAGE_FACTOR_VULNERABILITY
                    break
                }
            }
        })
    return oMitigation
}
