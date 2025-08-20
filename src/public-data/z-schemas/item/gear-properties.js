const z = require('zod');
const Enum = require('../enums');
const CONSTS = require('../../../consts');
const LABELS = require('../../labels');

const excludedItemTypes = new Set([
    CONSTS.ITEM_TYPE_AMMO,
    CONSTS.ITEM_TYPE_ARMOR,
    CONSTS.ITEM_TYPE_SHIELD,
    CONSTS.ITEM_TYPE_WEAPON
]);

const gearItemTypes = z.union(
    Enum
        .ItemType
        .options
        .filter(s => !excludedItemTypes.has(s))
        .map(s => z.literal(s))
);

module.exports = z.object({
    itemType: gearItemTypes.describe(LABELS.Fields.ItemField.itemType),
    equipmentSlots: z.array(Enum.EquipmentSlot).describe(LABELS.Fields.ItemField.equipmentSlots)
});
