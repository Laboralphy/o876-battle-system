const CONSTS = require('../../../consts');
const z = require('zod');
const Enum = require('../enums');
const DiceExpression = require('../dice-expression');
const LABELS = require('../../labels');

const buildPropertyRegistryEntries = (oPropDef) => {
    const p = {};
    for (const [sEntry, oDef] of Object.entries(oPropDef)) {
        const d = {
            type: z.literal(sEntry).describe(LABELS.Fields.PropertyFields.type)
        };
        for (const [sProp, value] of Object.entries(oDef)) {
            if (sProp in LABELS.Fields.PropertyFields) {
                d[sProp] = value.describe(LABELS.Fields.PropertyFields[sProp]);
            } else {
                throw new Error(`Unknown field type ${sProp} in LABELS.Fields.PropertyFields`);
            }
        }
        p[sEntry] = z.strictObject(d).describe(LABELS.Values[sEntry]);
    }
    return p;
};

module.exports = buildPropertyRegistryEntries({
    [CONSTS.PROPERTY_ABILITY_MODIFIER]: {
        amp: z.number().int(),
        ability: Enum.Ability
    },
    [CONSTS.PROPERTY_ADVANTAGE_ATTACK]: {
        attackType: Enum.AttackType.optional()
    },
    [CONSTS.PROPERTY_ADVANTAGE_SAVING_THROW]: {
        ability: Enum.Ability.optional(),
        threat: Enum.Threat.optional()
    },
    [CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER]: {
        amp: z.number().int(),
        damageType: Enum.DamageType.optional(),
        attackType: Enum.AttackType.optional()
    },
    [CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER]: {
        amp: z.number().int(),
        attackType: Enum.ActionType.optional()
    },
    [CONSTS.PROPERTY_ATTACK_MODIFIER]: {
        amp: z.number().int(),
        attackType: Enum.AttackType.optional()
    },
    [CONSTS.PROPERTY_CRITICAL_RANGE_MODIFIER]: {
        amp: z.number().int(),
        attackType: Enum.AttackType.optional()
    },
    [CONSTS.PROPERTY_CURSED]: {},
    [CONSTS.PROPERTY_DAMAGE_IMMUNITY]: {
        damageType: Enum.DamageType
    },
    [CONSTS.PROPERTY_DAMAGE_MODIFIER]: {
        amp: DiceExpression,
        damageType: Enum.DamageType.optional()
    },
    [CONSTS.PROPERTY_DAMAGE_REDUCTION]: {
        amp: z.number().int().positive(),
        damageType: Enum.DamageType
    },
    [CONSTS.PROPERTY_DAMAGE_RESISTANCE]: {
        damageType: Enum.DamageType
    },
    [CONSTS.PROPERTY_DAMAGE_VULNERABILITY]: {
        damageType: Enum.DamageType
    },
    [CONSTS.PROPERTY_DARKVISION]: {},
    [CONSTS.PROPERTY_DISADVANTAGE_ATTACK]: {
        attackType: Enum.AttackType.optional()
    },
    [CONSTS.PROPERTY_DISADVANTAGE_SAVING_THROW]: {
        ability: Enum.Ability.optional(),
        threat: Enum.Threat.optional()
    },
    [CONSTS.PROPERTY_ENFEEBLEMENT]: {
        ability: Enum.Ability
    },
    [CONSTS.PROPERTY_EXTRA_HITPOINTS]: {
        amp: z.number().int().positive()
    },
    [CONSTS.PROPERTY_EXTRA_WEAPON_DAMAGE_TYPE]: {
        damageType: Enum.DamageType
    },
    [CONSTS.PROPERTY_HEALING_FACTOR]: {
        amp: z.number()
    },
    [CONSTS.PROPERTY_HEALING_MODIFIER]: {
        amp: DiceExpression
    },
    [CONSTS.PROPERTY_IMMUNITY]: {
        immunityType: Enum.ImmunityType
    },
    [CONSTS.PROPERTY_LIGHT]: {},
    [CONSTS.PROPERTY_MAX_DEXTERITY_BONUS]: {
        amp: z.number().int()
    },
    [CONSTS.PROPERTY_MULTI_ATTACK]: {
        amp: z.number().int().positive()
    },
    [CONSTS.PROPERTY_ON_ATTACK_HIT]: {
        amp: DiceExpression,
        duration: z.number().int().positive(),
        ailment: Enum.Ailment,
        ability: Enum.Ability.optional(),
        attackType: Enum.AttackType.optional(),
        damageType: Enum.DamageType.optional(),
        disease: Enum.Disease.optional()
    },
    [CONSTS.PROPERTY_PROTECTION_FROM_SPECIES]: {
        species: z.array(Enum.Specie).nonempty()
    },
    [CONSTS.PROPERTY_REGENERATION]: {
        amp: DiceExpression,
        damageTypeVulnerabilities: z.array(Enum.DamageType).optional(),
        threshold: z.number().min(0).max(1).optional(),
        useConstitutionModifier: z.boolean().optional()
    },
    [CONSTS.PROPERTY_SAVING_THROW_MODIFIER]: {
        amp: z.number().int(),
        ability: Enum.Ability.optional(),
        threat: Enum.Threat.optional()
    },
    [CONSTS.PROPERTY_SKILL_MODIFIER]: {
        amp: z.number().int(),
        skill: Enum.Skill
    },
    [CONSTS.PROPERTY_SPEED_FACTOR]: {
        amp: z.number().min(0)
    },
    [CONSTS.PROPERTY_SPELL_POWER]: {
        amp: z.number().int(),
        ability: Enum.Ability
    },
    [CONSTS.PROPERTY_SPIKE_DAMAGE]: {
        amp: DiceExpression,
        damageType: Enum.DamageType.optional(),
        maxDistance: z.number().int().positive(),
        savingThrow: z.boolean().optional()
    },
    [CONSTS.PROPERTY_UNIDENTIFIED]: {},
    [CONSTS.PROPERTY_VAMPYRE]: {
        amp: z.number(),
        damageType: Enum.DamageType
    },
    [CONSTS.PROPERTY_WEIGHT_FACTOR]: {
        amp: z.number().min(0)
    }
});
