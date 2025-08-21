const z = require('zod');
const Enum = require('../enums');
const CONSTS = require('../../consts');
const LABELS = require('../strings/labels');

module.exports = z.object({
    itemType: z.literal(CONSTS.ITEM_TYPE_SHIELD).describe(LABELS.Fields.ItemField.itemType),
    ac: z.number().int().describe(LABELS.Fields.ItemField.ac),
    proficiency: Enum.Proficiency.describe(LABELS.Fields.ItemField.proficiency),
    equipmentSlots: z.array(z.literal(CONSTS.EQUIPMENT_SLOT_SHIELD)).describe(LABELS.Fields.ItemField.equipmentSlots)
});
