const CONSTS = require('../../consts');
const z = require('zod');
const Enum = require('../enums');
const DiceExpression = require('../dice-expression');
const LABELS = require('../strings/labels');

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
                throw new Error(`Unknown property "${sProp}" in LABELS.Fields.PropertyFields`);
            }
        }
        p[sEntry] = z.strictObject(d).describe(LABELS.Values[sEntry]);
    }
    return p;
};

const AmpNum = z.number().int();

module.exports = buildPropertyRegistryEntries({
    [CONSTS.PROPERTY_ABILITY_MODIFIER]: {
        amp: AmpNum,
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
        amp: AmpNum,
        damageType: Enum.DamageType.optional(),
        attackType: Enum.AttackType.optional()
    },
    [CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER]: {
        amp: AmpNum,
        attackType: Enum.AttackType.optional()
    },
    [CONSTS.PROPERTY_ATTACK_MODIFIER]: {
        amp: AmpNum,
        attackType: Enum.AttackType.optional()
    },
    [CONSTS.PROPERTY_CRITICAL_RANGE_MODIFIER]: {
        amp: AmpNum,
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
        amp: AmpNum.positive(),
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
        amp: AmpNum.positive()
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
        amp: AmpNum
    },
    [CONSTS.PROPERTY_MULTI_ATTACK]: {
        amp: AmpNum.positive()
    },
    [CONSTS.PROPERTY_ON_ATTACK_HIT]: {
        amp: DiceExpression.optional(),
        duration: z.number().int().positive().optional(),
        savingThrow: Enum.Ability.optional(),
        ailment: Enum.Ailment,
        ability: Enum.Ability.optional(),
        attackType: Enum.AttackType.optional(),
        damageType: Enum.DamageType.optional(),
        disease: Enum.Disease.optional(),
        subtype: Enum.EffectSubType.optional()
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
        amp: AmpNum,
        ability: Enum.Ability.optional(),
        threat: Enum.Threat.optional()
    },
    [CONSTS.PROPERTY_SKILL_MODIFIER]: {
        amp: AmpNum,
        skill: Enum.Skill
    },
    [CONSTS.PROPERTY_SPEED_FACTOR]: {
        amp: z.number().min(0)
    },
    [CONSTS.PROPERTY_SPELL_POWER]: {
        amp: AmpNum,
        ability: Enum.Ability
    },
    [CONSTS.PROPERTY_SPIKE_DAMAGE]: {
        amp: DiceExpression,
        damageType: Enum.DamageType.optional(),
        maxDistance: z.number().int().min(0),
        savingThrow: z.boolean().optional()
    },
    [CONSTS.PROPERTY_THINKER]: {
        combat: z.string().optional(),
        damaged: z.string().optional(),
        attack: z.string().optional(),
        attacked: z.string().optional()
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
