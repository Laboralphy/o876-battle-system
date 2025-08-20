const CONSTS = require('../../consts');

module.exports = {
    id: {
        type: 'string',
        required: true,
    },
    actionType: {
        type: 'Enum.ActionType',
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
        type: 'Object',
        required: false,
        default: {}
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
