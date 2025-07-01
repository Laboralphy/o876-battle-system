const { checkConst: cc } = require('./libs/check-const');

const PREFIXES = {
    ABILITY: 'ABILITY',
    CAPABILITY: 'CAPABILITY',
    CONDITION: 'CONDITION',
    EFFECT: 'EFFECT',
    PROPERTY: 'PROPERTY',
    EQUIPMENT_SLOT: 'EQUIPMENT_SLOT'
};

function checkConst (sConstName, sPrefix = '') {
    if (sPrefix !== '' && !sConstName.startsWith(sPrefix + '_')) {
        throw new Error(`invalid value ${sConstName}. must start with ${sPrefix}`);
    }
    return cc(sConstName);
}

function checkConstAbility (sConstName) {
    return checkConst(sConstName, PREFIXES.ABILITY);
}

function checkConstCapability (sConstName) {
    return checkConst(sConstName, PREFIXES.CAPABILITY);
}

function checkConstCondition (sConstName) {
    return checkConst(sConstName, PREFIXES.CONDITION);
}

function checkConstEffect (sConstName) {
    return checkConst(sConstName, PREFIXES.EFFECT);
}

function checkConstProperty (sConstName) {
    return checkConst(sConstName, PREFIXES.PROPERTY);
}

function checkConstEquipmentSlot (sConstName) {
    return checkConst(sConstName, PREFIXES.EQUIPMENT_SLOT);
}

module.exports = {
    checkConstCapability,
    checkConstAbility,
    checkConstCondition,
    checkConstEffect,
    checkConstProperty,
    checkConstEquipmentSlot
};
