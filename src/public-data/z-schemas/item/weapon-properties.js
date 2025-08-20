const z = require('zod');
const DiceExpression = require('../dice-expression');
const Enum = require('../enums');
const CONSTS = require('../../../consts');
const LABELS = require('../../labels');

const WeaponProperties = z.object({
    itemType: z.literal(CONSTS.ITEM_TYPE_WEAPON).describe(LABELS.Fields.ItemField.itemType),
    damages: DiceExpression.describe(LABELS.Fields.ItemField.damages),
    damageType: Enum.DamageType.describe(LABELS.Fields.ItemField.damageType),
    proficiency: Enum.Proficiency.describe(LABELS.Fields.ItemField.proficiency),
    attributes: z.array(Enum.WeaponAttribute).describe(LABELS.Fields.ItemField.attributes),
    size: Enum.WeaponSize.describe(LABELS.Fields.ItemField.size),
    ammoType: Enum.AmmoType.optional().describe(LABELS.Fields.ItemField.ammoType),
    equipmentSlots: z.array(z.union([
        z.literal(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE),
        z.literal(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED),
        z.literal(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1),
        z.literal(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2),
        z.literal(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3)
    ])).describe(LABELS.Fields.ItemField.equipmentSlots)
});
