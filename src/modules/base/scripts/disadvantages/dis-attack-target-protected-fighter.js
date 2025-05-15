const CONSTS = require('../../../../consts');

function hasShield (oCreature) {
    /**
     * @var {RBSItem}
     */
    const oShield = oCreature.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_SHIELD];
    return oShield && oShield.blueprint.itemType === CONSTS.ITEM_TYPE_SHIELD;
}

function hasFeat (oCreature) {
    return oCreature.ge;
}


function getAllMeleeOffenders (attackOutcome) {
    const oCreature = attackOutcome.attacker;
    return attackOutcome.manager.combatManager.getOffenders(oCreature, oCreature.data['weapon-range'].WEAPON_RANGE_MELEE);
}

/**
 * When creature attacks a target protected by a fighter equipped with shield and having martial archetype protection
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {

    // is there an offender fighter ?
    return getAllMeleeOffenders(attackOutcome.attacker)
        .some(f => hasFeat(f) && hasShield(f));

    return false;
}

module.exports = main;
