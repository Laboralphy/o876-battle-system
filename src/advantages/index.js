const { evaluateObject } = require('./evaluate-object');
/**
 * @type {{[p: string]: function(AttackOutcome): boolean}|{}}
 */
const ATTACK_ROLL_ADVANTAGES = require('./adv-attack-roll');
/**
 * @type {{[p: string]: function(AttackOutcome): boolean}|{}}
 */
const ATTACK_ROLL_DISADVANTAGES = require('./dis-attack-roll');


/**
 *
 * @param params
 * @returns {{result: number, advantages: Set<string>, disadvantages: Set<string>}}
 */
function computeAttackRollAdvantages (...params) {
    const a = evaluateObject(ATTACK_ROLL_ADVANTAGES, ...params);
    const d = evaluateObject(ATTACK_ROLL_DISADVANTAGES, ...params);
    const  result = (a.result ? 1 : 0) + (d.result ? -1 : 0);
    return {
        advantages: a.values,
        disadvantages: d.values,
        result
    };
}

module.exports = {
    computeAttackRollAdvantages
};
