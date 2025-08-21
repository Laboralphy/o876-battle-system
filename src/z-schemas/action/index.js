const z = require('zod');
const LABELS = require('../strings/labels');
const Enum = require('../enums');

module.exports = z.strictObject({
    id: z.string().describe(LABELS.Fields.ActionField.id),
    actionType: Enum.ActionType.describe(LABELS.Fields.ActionField.actionType),
    bonus: z.boolean().describe(LABELS.Fields.ActionField.bonus),
    hostile: z.boolean().describe(LABELS.Fields.ActionField.hostile),
    script: z.string().describe(LABELS.Fields.ActionField.script),
    parameters: z.object().optional().describe(LABELS.Fields.ActionField.parameters),
    cooldown: z.number().int().min(0).optional().describe(LABELS.Fields.ActionField.cooldown),
    charges: z.number().int().min(0).optional().describe(LABELS.Fields.ActionField.charges),
    range: z.number().int().min(0).describe(LABELS.Fields.ActionField.range),
    delay: z.number().int().min(0).optional().describe(LABELS.Fields.ActionField.delay)
}).describe(LABELS.Struct.ActionStruct);
