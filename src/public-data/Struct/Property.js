const CONSTS = require('../../consts');

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
            type: 'Enum.Ability',
            required: true
        }
    },
    [CONSTS.PROPERTY_ADVANTAGE_ATTACK]: {
        attackType: {
            type: 'Enum.AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_ADVANTAGE_SAVING_THROW]: {
        ability: {
            type: 'Enum.Ability',
            required: false
        },
        threat: {
            type: 'Enum.Threat',
            required: false
        }
    },
    [CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        damageType: {
            type: 'Enum.DamageType',
            required: false
        },
        attackType: {
            type: 'Enum.AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        attackType: {
            type: 'Enum.AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_ATTACK_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        attackType: {
            type: 'Enum.AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_CRITICAL_RANGE_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        attackType: {
            type: 'Enum.AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_CURSED]: {
    },
    [CONSTS.PROPERTY_DAMAGE_IMMUNITY]: {
        damageType: {
            type: 'Enum.DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_DAMAGE_MODIFIER]: {
        amp: {
            type: 'DiceExpression',
            required: true
        },
        damageType: {
            type: 'Enum.DamageType',
            required: false
        }
    },
    [CONSTS.PROPERTY_DAMAGE_REDUCTION]: {
        amp: {
            type: 'int',
            required: true
        },
        damageType: {
            type: 'Enum.DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_DAMAGE_RESISTANCE]: {
        damageType: {
            type: 'Enum.DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_DAMAGE_VULNERABILITY]: {
        damageType: {
            type: 'Enum.DamageType',
            required: true
        }
    },
    [CONSTS.PROPERTY_DARKVISION]: {
    },
    [CONSTS.PROPERTY_DISADVANTAGE_ATTACK]: {
        attackType: {
            type: 'Enum.AttackType',
            required: false
        }
    },
    [CONSTS.PROPERTY_DISADVANTAGE_SAVING_THROW]: {
        ability: {
            type: 'Enum.Ability',
            required: false
        },
        threat: {
            type: 'Enum.Threat',
            required: false
        }
    },
    [CONSTS.PROPERTY_ENFEEBLEMENT]: {
        ability: {
            type: 'Enum.Ability',
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
            type: 'Enum.DamageType',
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
            type: 'Enum.Ailment',
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
            type: 'Enum.Ability',
            required: false
        },
        attackType: {
            type: 'Enum.AttackType',
            required: false
        },
        damageType: {
            type: 'Enum.DamageType',
            required: false
        },
        disease: {
            type: 'Enum.Disease',
            required: false
        }
    },
    [CONSTS.PROPERTY_PROTECTION_FROM_SPECIES]: {
        species: {
            type: 'Enum.Species[]',
            required: true
        }
    },
    [CONSTS.PROPERTY_REGENERATION]: {
        amp: {
            type: 'DiceExpression',
            required: true
        },
        damageTypeVulnerabilities: {
            type: 'Enum.DamageType[]',
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
            type: 'Enum.Ability',
            required: false
        },
        threat: {
            type: 'Enum.Threat',
            required: false
        }
    },
    [CONSTS.PROPERTY_SKILL_MODIFIER]: {
        amp: {
            type: 'int',
            required: true
        },
        skill: {
            type: 'Enum.Skill',
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
            type: 'Enum.Ability',
            required: true
        }
    },
    [CONSTS.PROPERTY_SPIKE_DAMAGE]: {
        amp: {
            type: 'DiceExpression',
            required: true
        },
        damageType: {
            type: 'Enum.DamageType',
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
            type: 'Enum.DamageType',
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

module.exports = {
    type: 'Enum.PropertyType',
    required: true,
    remark: 'Select a sub-structure matching this value, and extends the current structure',
    switch: oPropertyParameters
};
