const CONSTS = require('../consts');

const INTERNAL_PROPERTIES = [
    CONSTS.PROPERTY_FEAT,
    CONSTS.PROPERTY_SNEAK_ATTACK,
    CONSTS.PROPERTY_THINKER
];

const oPropertyParameters = {
    [CONSTS.PROPERTY_ABILITY_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        ability: {
            type: 'Ability',
            required: true
        }
    },
    [CONSTS.PROPERTY_ADVANTAGE_ATTACK]: {
        attackType: {
            type: 'AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_ADVANTAGE_SAVING_THROW]: {
        ability: {
            type: 'Ability',
            required: false
        },
        threat: {
            type: 'Threat',
            required: false
        }
    },
    [CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        damageType: {
            type: 'DamageType',
            required: false
        },
        attackType: {
            type: 'AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        attackType: {
            type: 'AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_ATTACK_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        attackType: {
            type: 'AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_CRITICAL_RANGE_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        attackType: {
            type: 'AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_CURSED]: {
    },
    [CONSTS.PROPERTY_DAMAGE_IMMUNITY]: {
        damageType: {
            type: 'DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_DAMAGE_MODIFIER]: {
        amp: {
            type: 'DiceExpression',
            required: true
        },
        damageType: {
            type: 'DamageType',
            required: false
        }
    },
    [CONSTS.PROPERTY_DAMAGE_REDUCTION]: {
        amp: {
            type: 'int',
            required: true
        },
        damageType: {
            type: 'DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_DAMAGE_RESISTANCE]: {
        damageType: {
            type: 'DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_DAMAGE_VULNERABILITY]: {
        damageType: {
            type: 'DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_DARKVISION]: {
    },
    [CONSTS.PROPERTY_DISADVANTAGE_ATTACK]: {
        attackType: {
            type: 'AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_DISADVANTAGE_SAVING_THROW]: {
        ability: {
            type: 'Ability',
            required: false
        },
        threat: {
            type: 'Threat',
            required: false
        }
    },
    [CONSTS.PROPERTY_ENFEEBLEMENT]: {
        ability: {
            type: 'Ability',
            required: true
        }
    },
    [CONSTS.PROPERTY_EXTRA_HITPOINTS]: {
        amp: {
            type: 'int',
            required: true
        },
    },
    [CONSTS.PROPERTY_EXTRA_WEAPON_DAMAGE_TYPE]: {
        damageType: {
            type: 'DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_HEALING_FACTOR]: {
        amp: {
            type: 'float',
            required: true
        }
    },
    [CONSTS.PROPERTY_HEALING_MODIFIER]: {
        amp: {
            type: 'DiceExpression',
            required: true
        }
    },
    [CONSTS.PROPERTY_IMMUNITY]: {
        immunityType: {
            type: 'ImmunityType',
            required: true
        }
    },
    [CONSTS.PROPERTY_LIGHT]: {
    },
    [CONSTS.PROPERTY_MAX_DEXTERITY_BONUS]: {
        amp: {
            type: 'int',
            required: true
        }
    },
    [CONSTS.PROPERTY_MULTI_ATTACK]: {
        amp: {
            type: 'int',
            required: true
        }
    },
    [CONSTS.PROPERTY_ON_ATTACK_HIT]: {
        ailment: {
            type: 'Ailment',
            required: true
        },
        amp: {
            type: 'DiceExpression',
            required: true
        },
        duration: {
            type: 'int',
            required: true
        },
        ability: {
            type: 'Ability',
            required: false
        },
        attackType: {
            type: 'AttackType',
            required: false
        },
        damageType: {
            type: 'DamageType',
            required: false
        },
        disease: {
            type: 'Disease',
            required: false
        }
    },
    [CONSTS.PROPERTY_PROTECTION_FROM_SPECIES]: {
        species: {
            type: 'Array<Species>',
            required: true
        }
    },
    [CONSTS.PROPERTY_REGENERATION]: {
        amp: {
            type: 'DiceExpression',
            required: true
        },
        damageTypeVulnerabilities: {
            type: 'Array<DamageType>',
            required: false
        },
        threshold: {
            type: 'float',
            require: false
        },
        useConstitutionModifier: {
            type: 'boolean',
            required: false
        }
    },
    [CONSTS.PROPERTY_SAVING_THROW_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        ability: {
            type: 'Ability',
            required: false
        },
        threat: {
            type: 'Threat',
            required: false
        }
    },
    [CONSTS.PROPERTY_SKILL_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        skill: {
            type: 'Skill',
            required: true
        }
    },
    [CONSTS.PROPERTY_SPEED_FACTOR]: {
        amp: {
            type: 'float',
            required: true
        }
    },
    [CONSTS.PROPERTY_SPELL_POWER]: {
        amp: {
            type: 'int',
            required: true
        },
        ability: {
            type: 'Ability',
            required: true
        }
    },
    [CONSTS.PROPERTY_SPIKE_DAMAGE]: {
        amp: {
            type: 'DiceExpression',
            required: true
        },
        damageType: {
            type: 'DamageType',
            required: false
        },
        maxDistance: {
            type: 'int',
            required: false
        },
        savingThrow: {
            type: 'boolean',
            required: false
        }
    },
    [CONSTS.PROPERTY_UNIDENTIFIED]: {
    },
    [CONSTS.PROPERTY_VAMPYRE]: {
        amp: {
            type: 'float',
            required: true
        },
        damageType: {
            type: 'DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_WEIGHT_FACTOR]: {
        amp: {
            type: 'float',
            required: true
        }
    }
};

for (const [sPropType, pp] of Object.entries(oPropertyParameters)) {
    pp.type = {
        type: 'string',
        value: sPropType,
        required: true
    };
}

module.exports = oPropertyParameters;
