const CONSTS = require('../../consts');

/**
 * Returns the attack bonus of the selected action
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {number}
 */
module.exports = (state, getters) => {
    return {
        [CONSTS.ATTACK_TYPE_MELEE]: getters.getMeleeAttackBonus,
        [CONSTS.ATTACK_TYPE_RANGED]: getters.getRangedAttackBonus

    }
    switch (getters.getSelectedOffensiveSlot) {
        case CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE: {
            return getters.getMeleeAttackBonus
        }

        case CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED: {
            return getters.getRangedAttackBonus
        }

        default: {
            throw new Error(`Invalid offensive slot : ${getters.getSelectedOffensiveSlot}`)
        }
    }
}
