const CONSTS = require('../consts');

module.exports = {
    entityType: {
        type: 'string',
        value: CONSTS.ENTITY_TYPE_ACTOR
    },
    ac: {
        required: true,
        type: 'int'
    },
    hd: {
        required: true,
        type: 'int',
        min: 1
    },
    classType: {
        required: true,
        type: 'Enum<ClassType>'
    },
    level: {
        required: true,
        type: 'int',
        min: 1,
        max: 20
    },
    specie: {
        required: true,
        type: 'Enum<Specie>',
        default: CONSTS.SPECIE_HUMANOID
    },
    race: {
        required: false,
        type: 'Enum<Race>',
        default: CONSTS.RACE_UNKNOWN
    },
    speed: {
        required: true,
        type: 'int',
        default: 30,
        min: 0,
        max: 100
    },
    properties: {
        required: true,
        type: 'Array<PropertyDef>'
    },
    item: {
        required: true,
        type: 'Array<string>'
    },
    proficiency: {
        required: true,
        type: 'Array<Enum<Proficiency>>'
    },
    action: {
        required: true,
        type: 'Array<ActionTemplate>'
    },
    strength: {
        required: true,
        type: 'int',
        default: 8,
        min: 1
    },
    dexterity: {
        required: true,
        type: 'int',
        default: 8,
        min: 1
    },
    constitution: {
        required: true,
        type: 'int',
        default: 8,
        min: 1
    },
    intelligence: {
        required: true,
        type: 'int',
        default: 8,
        min: 1
    },
    wisdom: {
        required: true,
        type: 'int',
        default: 8,
        min: 1
    },
    charisma: {
        required: true,
        type: 'int',
        default: 8,
        min: 1
    }
};
