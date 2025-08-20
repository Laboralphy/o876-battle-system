const CONSTS = require('../../../consts');
const CONSTS_VALUES = Object.values(CONSTS);
const MODULES = require('../modules');
const { deepMerge } = require('@laboralphy/object-fusion');
const DATA = {};
deepMerge(DATA, MODULES.base.data);
deepMerge(DATA, MODULES.classic.data);
const z = require('zod');
const LABELS = require('../../labels');

z.union([z.literal('a'), z.literal('b')]);


const filterValues = (sPrefix) => CONSTS_VALUES.filter(c => c.startsWith(sPrefix));

const convertValuesToLiterals = (v) => v.map(c => z.literal(c).describe(LABELS.Values[c]));

const buildEnum = (sPrefix) => {
    const v = filterValues(sPrefix);
    if (v.length === 0) {
        throw new Error('There is no ' + sPrefix);
    }
    const l = convertValuesToLiterals(v);
    return z.union(l);
};

const buildEnum2 = (sPrefix) => z.enum(
    CONSTS_VALUES
        .filter(c => c.startsWith(sPrefix))
    // .map(c => z.literal(c).describe(LABELS.Values[c]))
);

module.exports = {
    Ability: buildEnum('ABILITY_').describe(LABELS.Enum.Ability),
    ActionType: buildEnum('COMBAT_ACTION_TYPE_').describe(LABELS.Enum.ActionType),
    Ailment: buildEnum('ON_ATTACK_HIT_').describe(LABELS.Enum.Ailment),
    AttackType: buildEnum('ATTACK_TYPE').describe(LABELS.Enum.AttackType),
    ClassType: buildEnum('CLASS_TYPE_').describe(LABELS.Enum.ClassType),
    DamageType: buildEnum('DAMAGE_TYPE_').describe(LABELS.Enum.DamageType),
    Disease: buildEnum('DISEASE_').describe(LABELS.Enum.Disease),
    EntityType: buildEnum('ENTITY_TYPE_').describe(LABELS.Enum.EntityType),
    ItemType: buildEnum('ITEM_TYPE_').describe(LABELS.Enum.ItemType),
    ImmunityType: buildEnum('IMMUNITY_TYPE_').describe(LABELS.Enum.ImmunityType),
    Proficiency: buildEnum('PROFICIENCY_').describe(LABELS.Enum.Proficiency),
    PropertyType: buildEnum('PROPERTY_').describe(LABELS.Enum.PropertyType),
    Race: buildEnum('RACE_').describe(LABELS.Enum.Race),
    Skill: buildEnum('SKILL_').describe(LABELS.Enum.Skill),
    Specie: buildEnum('SPECIE_').describe(LABELS.Enum.Specie),
    Threat: buildEnum('THREAT_').describe(LABELS.Enum.Threat),
    EquipmentSlot: buildEnum('EQUIPMENT_SLOT_').describe(LABELS.Enum.EquipmentSlot),
    WeaponAttribute: buildEnum('WEAPON_ATTRIBUTE_').describe(LABELS.Enum.WeaponAttribute),
    WeaponSize: buildEnum('WEAPON_SIZE_').describe(LABELS.Enum.WeaponSize),
    AmmoType: buildEnum('AMMO_TYPE_').describe(LABELS.Enum.AmmoType),
};
