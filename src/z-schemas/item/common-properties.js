const z = require('zod');
const CONSTS = require('../../consts');
const Property = require('../property');
const LABELS = require('../strings/labels');

module.exports = {
    ref: z.string().optional(),
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe(LABELS.Fields.ItemField.entityType),
    properties: z.array(Property).describe(LABELS.Fields.ItemField.properties),
    weight: z.number().min(0).describe(LABELS.Fields.ItemField.weight),
    charges: z.number().int().min(0).optional().describe(LABELS.Fields.ItemField.charges),
    tag: z.string().optional().describe(LABELS.Fields.ItemField.tag),
    spell: z.string().optional().describe(LABELS.Fields.ItemField.spell)
};
