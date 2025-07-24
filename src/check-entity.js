const CONSTS = require('./consts');
const Creature = require('./Creature');

/**
 * Return object if given parameter is null or instance of creature, else throw an error
 * @param oEntity {Creature|null|undefined|*}
 * @returns {Creature|null}
 */
function checkEntityCreature (oEntity) {
    if (oEntity === undefined) {
        throw new ReferenceError('Undefined entity ; required creature');
    } else if (oEntity === null) {
        return null;
    } else if (isEntityCreature(oEntity)) {
        return oEntity;
    } else {
        throw new TypeError('Creature instance expected');
    }
}

/**
 * Return object if given parameter is null or instance of RBSItem, else throw an error
 * @param oEntity {RBSItem|null|undefined|*}
 * @returns {RBSItem}
 */
function checkEntityItem (oEntity) {
    if (oEntity === undefined) {
        throw new ReferenceError('Undefined entity : required item');
    } else if (oEntity === null) {
        return null;
    } else if (isEntityItem(oEntity)) {
        return oEntity;
    } else {
        throw new TypeError('Item instance expected');
    }
}

function isEntityCreature (oEntity) {
    return oEntity instanceof Creature;
}

function isEntityItem (oEntity) {
    return oEntity?.blueprint?.entityType === CONSTS.ENTITY_TYPE_ITEM;
}

module.exports = {
    checkEntityCreature,
    checkEntityItem,
    isEntityCreature,
    isEntityItem
};
