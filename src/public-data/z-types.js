const CONSTS = require('../consts');
const CONSTS_VALUES = Object.values(CONSTS);
const MODULES = require('./modules');
const { deepMerge } = require('@laboralphy/object-fusion');
const DATA = {};
deepMerge(DATA, MODULES.base.data);
deepMerge(DATA, MODULES.classic.data);
const z = require('zod');
const Dice = require('../libs/dice');
const LABELS = require('./labels.fr.json');
const util = require('node:util');

const buildEnum = (sPrefix) => z.enum(CONSTS_VALUES.filter(c => c.startsWith(sPrefix)));
const Enum = {
    Ability: buildEnum('ABILITY_'),
    ActionType: buildEnum('COMBAT_ACTION_TYPE_'),
    Ailment: buildEnum('ON_ATTACK_HIT_'),
    AttackType: buildEnum('ATTACK_TYPE'),
    ClassType: buildEnum('CLASS_TYPE_'),
    DamageType: buildEnum('DAMAGE_TYPE_'),
    Disease: buildEnum('DISEASE_'),
    EntityType: buildEnum('ENTITY_TYPE_'),
    ImmunityType: buildEnum('IMMUNITY_TYPE_'),
    Proficiency: buildEnum('PROFICIENCY_'),
    PropertyType: buildEnum('PROPERTY_'),
    Race: buildEnum('RACE_'),
    Skill: buildEnum('SKILL_'),
    Specie: buildEnum('SPECIE_'),
    Threat: buildEnum('THREAT_')
};

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
        p[sEntry] = z.strictObject(d).describe(LABELS.Enum[sEntry]);
    }
    return p;
};

const DiceExpression = z.union([
    z.number().int().describe(LABELS.Misc.DiceExpression.int),
    z.string().regex(Dice.REGEX_XDY).describe(LABELS.Misc.DiceExpression.dice)
]);

const PROPERTY_REGISTRY = buildPropertyRegistryEntries({
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

const Struct = {
    Action: z.strictObject({
        id: z.string().describe(LABELS.Fields.ActionField.id),
        actionType: Enum.ActionType.describe(LABELS.Fields.ActionField.actionType),
        bonus: z.boolean().describe(LABELS.Fields.ActionField.bonus),
        hostile: z.boolean().describe(LABELS.Fields.ActionField.hostile),
        script: z.string().describe(LABELS.Fields.ActionField.script),
        parameters: z.object().optional().describe(LABELS.Fields.ActionField.parameters),
        cooldown: z.number().int().positive().optional().describe(LABELS.Fields.ActionField.cooldown),
        charges: z.number().int().positive().optional().describe(LABELS.Fields.ActionField.charges),
        range: z.number().int().positive().describe(LABELS.Fields.ActionField.range),
        delay: z.number().int().positive().optional().describe(LABELS.Fields.ActionField.delay)
    }),
    PropertyRegistry: PROPERTY_REGISTRY,
    Property: z.discriminatedUnion('type', Object.values(PROPERTY_REGISTRY))
};

module.exports = {
    Enum,
    Struct
};

function getFieldDoc (oField) {
    let bRequired = true;
    let field = oField;
    const description = oField.description;
    if (oField.isOptional()) {
        bRequired = false;
        field = oField.unwrap();
    }
    const sType = field.def.type;
    const dx = {
        type: sType,
        required: bRequired
    };
    switch (sType) {
    case 'literal': {
        dx.value = field.value;
        break;
    }
    case 'number': {
        dx.int = field.isInt;
        if (('minValue' in field) && field.minValue !== Number.MIN_SAFE_INTEGER) {
            dx.min = field.minValue;
        }
        if ('maxValue' in field && field.maxValue !== Number.MAX_SAFE_INTEGER) {
            dx.max = field.maxValue;
        }
        break;
    }
    case 'enum': {
        dx.options = field.options.map(s => ({
            value: s,
            description: LABELS.Enum[s]
        }));
        break;
    }
    case 'union': {
        dx.type = [
            field.options.map(o => getFieldDoc(o))
        ];
        break;
    }
    case 'optional': {
        Object.assign(dx, getFieldDoc(field.unwrap()));
        break;
    }
    }
    if (description) {
        dx.description = description;
    }
    return dx;
}

/**
 *
 * @param schema {z.ZodObject}
 * @returns {string}
 */
function generateDoc(schema) {
    const d = {
        schema: schema.description,
        properties: {}
    };
    for (const [key, oField] of Object.entries(schema.shape)) {
        const dx = getFieldDoc(oField);
        d.properties[key] = dx;
    }
    return d;
}

console.log(
    util.inspect(
        generateDoc(Struct.Action),
        { depth: null, color: true }
    )
);
