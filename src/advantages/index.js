const { evaluateObject } = require('./evaluate-object');

const ATTACK_ROLL_ADVANTAGES = require('./functions/attack-rolls/adv');
const ATTACK_ROLL_DISADVANTAGES = require('./functions/attack-rolls/dis');
const SAVING_THROW_ADVANTAGES = require('./functions/saving-throws/adv');
const SAVING_THROW_DISADVANTAGES = require('./functions/saving-throws/dis');

/**
 * @typedef RollBias {object}
 * @property result {number}
 * @property advantage {Set<string>}
 * @property disadvantage {Set<string>}
 *
 * @param advFunctions {Object<string, function(): boolean>}
 * @param disFunctions {Object<string, function(): boolean>}
 * @param params
 * @returns {RollBias}
 */
function computeAdvDis (advFunctions, disFunctions, ...params) {
    const a = evaluateObject(advFunctions, ...params);
    const d = evaluateObject(disFunctions, ...params);
    const  result = (a.result ? 1 : 0) + (d.result ? -1 : 0);
    return {
        advantages: a.values,
        disadvantages: d.values,
        result
    };
}

module.exports = {
    computeAttackRollAdvantages: (...params) => computeAdvDis(ATTACK_ROLL_ADVANTAGES, ATTACK_ROLL_DISADVANTAGES, ...params),
    computeSavingThrowAdvantages: (...params) => computeAdvDis(SAVING_THROW_ADVANTAGES, SAVING_THROW_DISADVANTAGES, ...params),
};
