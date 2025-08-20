const z = require('zod');
const CONSTS = require('../../../consts');
const Property = require('../property');
const LABELS = require('../../labels');

module.exports = {
    extends: z.array(z.string()).describe(LABELS.Fields.ItemField.extends),
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe(LABELS.Fields.ItemField.entityType),
    properties: z.array(Property).describe(LABELS.Fields.ItemField.properties),
    weight: z.number().int().positive().describe(LABELS.Fields.ItemField.weight),
    charges: z.number().int().positive().optional().describe(LABELS.Fields.ItemField.charges),
    tag: z.string().optional().describe(LABELS.Fields.ItemField.tag),
    spell: z.string().optional().describe(LABELS.Fields.ItemField.spell)
};
