const CONSTS = require('../consts');


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
