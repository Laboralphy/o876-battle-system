const CONSTS = require('../consts');
const MODULES = require('./z-schemas/modules');
const { deepMerge } = require('@laboralphy/object-fusion');
const DATA = {};
deepMerge(DATA, MODULES.base.data);
deepMerge(DATA, MODULES.classic.data);


const CONSTS_VALUES = Object.values(CONSTS);

module.exports = {
    Ability: CONSTS_VALUES.filter(c => c.startsWith('ABILITY_')),
    AttackType: CONSTS_VALUES.filter(c => c.startsWith('ATTACK_TYPE_')),
    ClassType: Object.keys(DATA.CLASS_TYPES).filter(c => c.startsWith('CLASS_TYPE_')),
    DamageType: CONSTS_VALUES.filter(c => c.startsWith('DAMAGE_TYPE_')),
    Proficiency: CONSTS_VALUES.filter(c => c.startsWith('PROFICIENCY_')),
    Race: CONSTS_VALUES.filter(c => c.startsWith('RACE_')),
    Specie: CONSTS_VALUES.filter(c => c.startsWith('SPECIE_')),
    Threat: CONSTS_VALUES.filter(c => c.startsWith('THREAT_')),
    ImmunityType: CONSTS_VALUES.filter(c => c.startsWith('IMMUNITY_TYPE_')),
    Ailment: CONSTS_VALUES.filter(c => c.startsWith('ON_ATTACK_HIT_')),
    Disease: CONSTS_VALUES.filter(c => c.startsWith('DISEASE_')),
    Skill: CONSTS_VALUES
        .filter(c => c.startsWith('PROFICIENCY_SKILL_'))
        .map(c => c.substring(12)),
    ActionType: CONSTS_VALUES.filter(c => c.startsWith('COMBAT_ACTION_TYPE_')),
    PropertyType: CONSTS_VALUES.filter(c => c.startsWith('PROPERTY_'))
};
