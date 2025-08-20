const CONSTS = require('../consts');
const BLUEPRINTS = require('./blueprints');
const BLUEPRINT_ENTRIES = Object.entries(BLUEPRINTS);
const PARTIAL_ACTORS = Object.fromEntries(BLUEPRINT_ENTRIES
    .filter(([, bp]) => bp.entityType === CONSTS.ENTITY_TYPE_PARTIAL_ACTOR));
const PARTIAL_ITEMS = Object.fromEntries(BLUEPRINT_ENTRIES
    .filter(([, bp]) => bp.entityType === CONSTS.ENTITY_TYPE_PARTIAL_ITEM));

/**
 * Dispatch items of a collection, using one of their properties
 * @param oObject {object}
 * @param sField {string}
 */
function dispatch (oObject, sField) {
    const oRegistry = new Map();
    for (const [entry, item] of Object.entries(oObject)) {
        const key = item[sField];
        if (!oRegistry.has(key)) {
            oRegistry.set(key, []);
        }
        oRegistry.get(key).push(entry);
    }
    return Object.fromEntries(oRegistry.entries());
}

function getPartialActorSlice (sPattern) {
    return Object
        .entries(PARTIAL_ACTORS)
        .filter(([entry]) => entry.startsWith(sPattern))
        .map(([entry]) => entry);
}

module.exports = {
    classTypes: getPartialActorSlice('class-type-'),
    races: getPartialActorSlice('race-'),
    species: getPartialActorSlice('specie-'),
    commonProperties: getPartialActorSlice('cp-'),
    itemTypes: dispatch(PARTIAL_ITEMS, 'itemType')
};
