const CONSTS = require('../../consts');
const { getWeaponRange } = require('../../libs/helpers');

/**
 * Return, for each equipped weapon, its range (0 when ranged wepaon is not equipped)
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 * @return {{[slot: string]: number}}
 */
module.exports = (state, getters, externals) => {
    const eq = getters.getEquipment;
    const oMeleeWeapon = eq[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE];
    const oRangedWeapon = eq[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED];
    const oNaturalWeapon1 = eq[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1];
    const oNaturalWeapon2 = eq[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2];
    const oNaturalWeapon3 = eq[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3];

    const nDefaultMeleeRange = externals['WEAPON_RANGES']['WEAPON_RANGE_MELEE'].range;
    const nMeleeRange = oMeleeWeapon ? Math.max(nDefaultMeleeRange, getWeaponRange(oMeleeWeapon, externals)) : -1;
    const nRangedRange = (oRangedWeapon && getters.isRangedWeaponLoaded) ? getWeaponRange(oRangedWeapon, externals) : -1;
    const nNaturalWeapon1Range = oNaturalWeapon1 ? Math.max(nDefaultMeleeRange, getWeaponRange(oNaturalWeapon1, externals)) : -1;
    const nNaturalWeapon2Range = oNaturalWeapon2 ? Math.max(nDefaultMeleeRange, getWeaponRange(oNaturalWeapon2, externals)) : -1;
    const nNaturalWeapon3Range = oNaturalWeapon3 ? Math.max(nDefaultMeleeRange, getWeaponRange(oNaturalWeapon3, externals)) : -1;

    return {
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: nMeleeRange,
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: nRangedRange,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: nNaturalWeapon1Range,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: nNaturalWeapon2Range,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: nNaturalWeapon3Range
    };
};
