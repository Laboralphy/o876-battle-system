const CONSTS = require('../consts');
const {checkConst} = require('../libs/check-const');

/**
 * Inflict damage
 * @param effect {RBSEffect}
 * @param value {number}
 * @param sDamageType {string} DAMAGE_TYPE_
 * @param critical {boolean}
 */
function init ({ effect, damageType: sDamageType, critical = false }) {
    checkConst(sDamageType);
    if (effect.amp === 0 && sDamageType === CONSTS.DAMAGE_TYPE_POISON) {
        throw new Error('WTF!!! POISON 0 amp');
    }
    Object.assign(effect.data, {
        damageType: sDamageType,
        appliedAmount: 0,
        resistedAmount: 0,
        critical
    });
}

/**
 * @param damageType {string}
 * @param amp {string|number}
 * @param target {Creature}
 * @returns {{amount: number, resisted: number}}
 */
function rollDamageAmount ({ damageType, amp, target }) {
    // What is the damage resistance, vulnerability, reduction ?
    const oMitigation = target.getters.getDamageMitigation;
    const sType = damageType;
    amp = typeof amp === 'number'
        ? amp
        : target.dice.roll(amp);
    if (sType in oMitigation) {
        const { factor, reduction } = oMitigation[sType];
        const nModifiedAmount = Math.floor(Math.max(0, (amp - reduction)) * factor);
        const nResistedAmount = Math.max(0, amp - nModifiedAmount);
        return {
            amount: nModifiedAmount,
            resisted: nResistedAmount
        };
    } else {
        // no resistance no absorb no immunity
        return {
            amount: amp,
            resisted: 0
        };
    }
}

/**
 * Apply effect modification on effect target
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param source {Creature}
 */
function mutate ({ effect, target, source }) {
    const ed = effect.data;
    const oRecentDamage = rollDamageAmount({
        damageType: ed.damageType,
        amp: effect.amp,
        target
    });
    ed.appliedAmount = oRecentDamage.amount;
    ed.resistedAmount = oRecentDamage.resisted;
    target.hitPoints -= oRecentDamage.amount;
    target.events.emit(CONSTS.EVENT_CREATURE_DAMAGED, {
        ...oRecentDamage,
        damageType: ed.damageType,
        source,
        subtype: effect.subtype
    });
    if (target.getters.isDead) {
        target.events.emit(CONSTS.EVENT_CREATURE_DEATH, {
            killer: source
        });
    }
}

function apply ({ effect, target, reject }) {
    if (
        effect.data.damageType === CONSTS.DAMAGE_TYPE_POISON &&
        (
            target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_POISON) ||
            target.getters.getConditionSet.has(CONSTS.CONDITION_PETRIFIED)
        )
    ) {
        reject();
    }
}

module.exports = {
    init,
    mutate,
    apply
};
