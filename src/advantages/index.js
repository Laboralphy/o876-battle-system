const { evaluateObject } = require('./evaluate-object');

const ATTACK_ROLL_ADVANTAGES = require('./functions/attack-rolls/adv');
const ATTACK_ROLL_DISADVANTAGES = require('./functions/attack-rolls/dis');
const SAVING_THROW_ADVANTAGES = require('./functions/saving-throws/adv');
const SAVING_THROW_DISADVANTAGES = require('./functions/saving-throws/dis');

const ADVANTAGES = {
    attacks: {
        ...ATTACK_ROLL_ADVANTAGES
    },
    savingThrows: {
        ...SAVING_THROW_ADVANTAGES
    }
};
const DISADVANTAGES = {
    attacks: {
        ...ATTACK_ROLL_DISADVANTAGES
    },
    savingThrows: {
        ...SAVING_THROW_DISADVANTAGES
    }
};


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

function defineAttackAdvantage (sId, pFunction) {
    ADVANTAGES.attacks[sId] = pFunction;
}

function defineAttackDisadvantage (sId, pFunction) {
    DISADVANTAGES.attacks[sId] = pFunction;
}

function defineSavingThrowAdvantage (sId, pFunction) {
    ADVANTAGES.savingThrows[sId] = pFunction;
}

function defineSavingThrowDisadvantage (sId, pFunction) {
    DISADVANTAGES.savingThrows[sId] = pFunction;
}

module.exports = {
    defineAttackAdvantage,
    defineAttackDisadvantage,
    defineSavingThrowAdvantage,
    defineSavingThrowDisadvantage,
    computeAttackRollAdvantages: (...params) => computeAdvDis(ADVANTAGES.attacks, DISADVANTAGES.attacks, ...params),
    computeSavingThrowAdvantages: (...params) => computeAdvDis(ADVANTAGES.savingThrows, DISADVANTAGES.savingThrows, ...params),
};
