const z = require('zod');
const LABELS = require('../../labels');

const CommonProperties = require('./common-properties');
const AmmoProperties = require('./ammo-properties');
const ArmorProperties = require('./armor-properties');
const ShieldProperties = require('./shield-properties');
const WeaponProperties = require('./shield-properties');
const GearProperties = require('./gear-properties');

module.exports = z.discriminatedUnion('itemType', [
    AmmoProperties.extend(CommonProperties).describe(LABELS.Fields.ItemField.itemTypes.Ammo),
    ArmorProperties.extend(CommonProperties).describe(LABELS.Fields.ItemField.itemTypes.Armor),
    ShieldProperties.extend(CommonProperties).describe(LABELS.Fields.ItemField.itemTypes.Shield),
    WeaponProperties.extend(CommonProperties).describe(LABELS.Fields.ItemField.itemTypes.Weapon),
    GearProperties.extend(CommonProperties).describe(LABELS.Fields.ItemField.itemTypes.Gear)
]).describe(LABELS.Struct.ItemStruct);
