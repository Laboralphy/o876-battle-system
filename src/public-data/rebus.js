const CONSTS = require('../consts');

const oCreatureForm = {
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
        type: 'Class'
    },
    level: {
        required: true,
        type: 'int',
        min: 1,
        max: 20
    },
    specie: {
        required: true,
        type: 'Specie',
        default: 'SPECIE_HUMANOID'
    },
    race: {
        required: false,
        type: 'Race',
        default: 'RACE_UNKNOWN'
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
    equipment: {
        required: true,
        type: 'Array<string>'
    },
    proficiencies: {
        required: true,
        type: 'Array<Proficiency>'
    },
    actions: {
        required: true,
        type: 'Array<ActionDef>'
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


const oCreatureTemplate = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    ac: 'ac',
    hd: 'hd',
    classType: 'classType',
    level: 'level',
    specie: 'specie',
    race: 'race',
    speed: 'speed',
    abilities: {
        strength: 'strength',
        dexterity: 'dexterity',
        constitution: 'constitution',
        intelligence: 'intelligence',
        wisdom: 'wisdom',
        charisma: 'charisma'
    },
    proficiencies: 'proficiencies',
    equipment: 'equipment',
    properties: 'properties',
    actions: 'actions'
};

const oActionDef = {
    id: {
        type: 'string',
        required: true,
    },
    actionType: {
        type: 'ActionType',
        required: true,
        default: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY
    },
    bonus: {
        type: 'boolean',
        required: true,
        default: false
    },
    hostile: {
        type: 'boolean',
        required: true,
        default: false
    },
    script: {
        type: 'string',
        required: true
    },
    parameters: {
        type: 'object',
        required: false
    },
    cooldown: {
        type: 'int',
        required: false,
        default: 0,
        min: 0
    },
    charges: {
        type: 'int',
        required: false,
        default: 0,
        min: 0
    },
    range: {
        type: 'int',
        required: true,
        default: Infinity,
        min: 0
    },
    delay: {
        type: 'int',
        required: false,
        default: 0,
        min: 0
    }
};

const oActionTemplate = {
    id: 'id',
    actionType: 'actionType',
    bonus: 'bonus',
    hostile: 'hostile',
    script: 'script',
    parameters: 'parameters',
    cooldown: 'cooldown',
    charges: 'charges',
    range: 'range',
    delay: 'delay'
};


module.exports = {
};
