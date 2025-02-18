const CONSTS = require('../../consts');

/**
 * Return true if item proficiency is supported by proficiency set
 * @param aProficiencies {Set<string>}
 * @param oItem {RBSItem}
 * @param bNaturalSlot {boolean} if true then this slot is a natural weapon slot and mays use natural weapon proficiency
 * @returns {boolean}
 */
function isProficient (aProficiencies, oItem, bNaturalSlot = false) {
    if (bNaturalSlot && !oItem) {
        return aProficiencies.has(CONSTS.PROFICIENCY_WEAPON_NATURAL);
    } else if (!oItem) {
        return true;
    }
    const sProficiency = oItem.blueprint.proficiency || '';
    return sProficiency === '' || aProficiencies.has(sProficiency);
}

/**
 * Returns the proficiency of item equipped on some offensive and defensive equipment slots
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {{[p: string]: boolean}}
 */
module.exports = (state, getters) => {
    const eq = getters.getEquipment;
    const aProficiencies = getters.getProficiencySet;
    return {
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: isProficient(aProficiencies, eq[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED], true),
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: isProficient(aProficiencies, eq[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE], true),
        [CONSTS.EQUIPMENT_SLOT_CHEST]: isProficient(aProficiencies, eq[CONSTS.EQUIPMENT_SLOT_CHEST]),
        [CONSTS.EQUIPMENT_SLOT_SHIELD]: isProficient(aProficiencies, eq[CONSTS.EQUIPMENT_SLOT_SHIELD]),
    };
};
