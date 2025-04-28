const CONSTS = require('../../../../consts');

/**
 * If character wears an armor or a shield but nor proficient
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
    const eqp = attackOutcome.attacker.getters.isEquipmentProficient;
    return !(eqp[CONSTS.EQUIPMENT_SLOT_CHEST] && eqp[CONSTS.EQUIPMENT_SLOT_SHIELD]);
}

module.exports = main;
