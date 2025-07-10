const CONSTS = require('../../consts');
const os = require('node:os');

const DAMAGE_TYPE_TO_THREAT_TYPE = {
    DAMAGE_TYPE_FIRE: CONSTS.THREAT_TYPE_FIRE,
    DAMAGE_TYPE_COLD: CONSTS.THREAT_TYPE_COLD,
    DAMAGE_TYPE_ACID: CONSTS.THREAT_TYPE_ACID,
    DAMAGE_TYPE_ELECTRICITY: CONSTS.THREAT_TYPE_ELECTRICITY,
    DAMAGE_TYPE_PSYCHIC: CONSTS.THREAT_TYPE_PSYCHIC,
    DAMAGE_TYPE_POISON: CONSTS.THREAT_TYPE_POISON,
    DAMAGE_TYPE_RADIANT: CONSTS.THREAT_TYPE_RADIANT,
    DAMAGE_TYPE_WITHERING: CONSTS.THREAT_TYPE_WITHERING,
};

function getThreatTypeFromDamageType (sDamageType) {
    return DAMAGE_TYPE_TO_THREAT_TYPE[sDamageType] ?? '';
}

/**
 * Do damage to creature with a saving throw allowed for half damage
 * @param oManager {Manager} Manager instance
 * @param oTarget {Creature} Creature receiving damage
 * @param oSource {Creature} Creature dealing damage
 * @param amount {string|number} Amount of damage dealt (can be dice expression)
 * @param damageType {string} Damage Type DAMAGE_TYPE_* constant group
 * @param offensiveAbility {string} offensive ability used to compute saving throw difficulty class
 * @param defensiveAbility {string} defensive ability sued to resolve saving throw success
 * @param extraordinary {boolean} an extraordinary effect is not dispellable
 *
 * @return {{ effect: RBSEffect, saved: boolean }}
 */
function doDamage (oManager, oTarget, oSource, {
    amount,
    damageType,
    offensiveAbility = '',
    defensiveAbility = '',
    extraordinary = false
}) {
    let bSaved = false;
    if (offensiveAbility) {
        const sThreatType = getThreatTypeFromDamageType(damageType);
        const dc = oSource.getters.getSpellDifficultyClass[offensiveAbility];
        const oSavingThrow = oTarget.rollSavingThrow(defensiveAbility, dc, sThreatType);
        bSaved = oSavingThrow.success;
    }
    const nFullDamage = oTarget.dice.roll(amount);
    const nDamage = bSaved ? Math.floor(nFullDamage / 2) : nFullDamage;
    const eDam = oManager.createEffect(CONSTS.EFFECT_DAMAGE, nDamage, {
        damageType,
        subtype: extraordinary ? oManager.CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY : oManager.CONSTS.EFFECT_SUBTYPE_MAGICAL
    });
    const effect = oManager.applyEffect(eDam, oTarget, 0, oSource);
    return {
        effect,
        saved: bSaved
    };
}

function doHeal (oManager, oCreature, oHealer, amount) {
    const eHeal = oManager.createEffect(oManager.CONSTS.EFFECT_HEAL, amount);
    oManager.applyEffect(eHeal, oCreature, oHealer);
}

/**
 * Returns the specified weapon range
 * @param weapon {RBSItem}
 * @param DATA {*}
 * @returns {number}
 */
function getWeaponRange (weapon, DATA) {
    if (!weapon) {
        return -1;
    }
    const wa = weapon.blueprint.attributes;
    const wr = DATA['WEAPON_RANGES'];
    if (wa.includes(CONSTS.WEAPON_ATTRIBUTE_REACH)) {
        return wr['WEAPON_RANGE_REACH'].range;
    } else if (wa.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
        return wr['WEAPON_RANGE_RANGED'].range;
    } else {
        return wr['WEAPON_RANGE_MELEE'].range;
    }
}

/**
 * Returns the best damage type. The one who will do the most damage.
 * @param aDamageTypes {string[]}
 * @param oMitigation {{ [damageType: string]: { factor: number, reduction: number } }}
 * @returns {string|undefined} DAMAGE_TYPE_*
 */
function getBestDamageTypeVsMitigation (aDamageTypes, oMitigation) {
    if (aDamageTypes.length === 0) {
        throw new Error('DamageType Array must have at least one item');
    }
    return aDamageTypes
        .map(dt => {
            if (dt in oMitigation) {
                return { damageType: dt, factor: oMitigation[dt].factor, reduction: oMitigation[dt].reduction };
            } else {
                return { damageType: dt, factor: 1, reduction: 0 };
            }
        })
        .sort((
            { factor: fa, reduction: ra },
            { factor: fb, reduction: rb }
        ) => fb === fa
            ? ra - rb
            : fb - fa
        )
        .map(({ damageType }) => damageType)
        .shift() ?? aDamageTypes[0];
}

/**
 * Returns the damage type against to most efficient AC
 * @param aDamageTypes {string[]}
 * @param oArmorClasses {{ [damageType: string]: number }}
 * @returns {string}
 */
function getWorstDamageTypeVsAC (aDamageTypes, oArmorClasses) {
    if (aDamageTypes.length === 0) {
        throw new Error('DamageType Array must have at least one item');
    }
    return aDamageTypes
        .filter(dt => dt in oArmorClasses)
        .map(dt => ({ damageType: dt, ac: oArmorClasses[dt] }))
        .sort(({ ac: a }, { ac: b }) => b - a)
        .map(({ damageType }) => damageType)
        .shift() ?? aDamageTypes[0];
}

/**
 *
 * @param oManager {Manager}
 * @param oCreature {Creature}
 * @param oTargetCenter {Creature}
 * @param nRange {number}
 */
function getAreaOfEffectTargets (oManager, oCreature, oTargetCenter, nRange) {
    const aAllOffenders = oManager.combatManager.getTargetingCreatures(oCreature, nRange);
    if (!aAllOffenders.includes(oTargetCenter) && oTargetCenter !== null) {
        aAllOffenders.push(oTargetCenter);
    }
    return aAllOffenders.filter(offender => {
        if (oCreature.getCreatureVisibility(offender) !== CONSTS.CREATURE_VISIBILITY_VISIBLE) {
            return oCreature.dice.random() >= 0.5;
        } else {
            return true;
        }
    });
}

module.exports = {
    getThreatTypeFromDamageType,
    doDamage,
    doHeal,
    getWeaponRange,
    getBestDamageTypeVsMitigation,
    getWorstDamageTypeVsAC,
    getAreaOfEffectTargets
};
