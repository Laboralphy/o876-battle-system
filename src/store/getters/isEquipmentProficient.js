const CONSTS = require("../../consts");

/**
 * Return true if item proficiency is supported by proficiency set
 * @param aProficiencies {Set<string>}
 * @param oItem {RBSItem}
 * @returns {boolean}
 */
function isProficient (aProficiencies, oItem) {
    if (!oItem) {
        return aProficiencies.has(CONSTS.PROFICIENCY_WEAPON_NATURAL)
    }
    const sProficiency = oItem.blueprint.proficiency || CONSTS.PROFICIENCY_WEAPON_NATURAL
    return sProficiency === '' || aProficiencies.has(sProficiency)
}

/**
 * Returns the proficiency of item equipped on some offensive and defensive equipment slots
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {{[p: string]: boolean}}
 */
module.exports = (state, getters) => {
    const eq = getters.getEquipment
    const aProficiencies = getters.getProficiencySet
    return {
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: isProficient(aProficiencies, eq[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]),
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: isProficient(aProficiencies, eq[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]),
        [CONSTS.EQUIPMENT_SLOT_CHEST]: isProficient(aProficiencies, eq[CONSTS.EQUIPMENT_SLOT_CHEST]),
    }
}
