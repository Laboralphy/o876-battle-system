const CONSTS = require('../../consts')
/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const aProficiencies = getters.getProficiencySet
    const oWeapon = getters.getSelectedWeapon
    if (oWeapon) {
        // We have a weapon
        const sWeaponProficiency = oWeapon.blueprint.proficiency || ''
        // if weapon has no proficiency, we are proficient
        return sWeaponProficiency !== '' ? aProficiencies.has(sWeaponProficiency) : true
    }
    // we have no weapon
    return aProficiencies.has(CONSTS.PROFICIENCY_WEAPON_NATURAL)
}
