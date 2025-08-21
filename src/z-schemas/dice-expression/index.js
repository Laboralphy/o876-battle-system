const z = require('zod');
const LABELS = require('../strings/labels.fr.json');
const Dice = require('../../libs/dice');

module.exports = z.union([
    z.number().int().describe(LABELS.Misc.DiceExpression.int),
    z.string().regex(Dice.REGEX_XDY).describe(LABELS.Misc.DiceExpression.dice)
]).describe(LABELS.Misc.DiceExpression.description);
