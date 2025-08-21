const z = require('zod');
const Enum = require('../enums');
const CONSTS = require('../../consts');
const LABELS = require('../strings/labels');


module.exports = z.object({
    itemType: z.literal(CONSTS.ITEM_TYPE_AMMO).describe(LABELS.Fields.ItemField.itemType),
    ammoType: Enum.AmmoType.describe(LABELS.Fields.ItemField.ammoType),
    equipmentSlots: z.array(z.literal(CONSTS.EQUIPMENT_SLOT_AMMO)).describe(LABELS.Fields.ItemField.equipmentSlots)
});
