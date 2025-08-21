const crypto = require('crypto');
const { deepMerge, deepFreeze } = require('@laboralphy/object-fusion');
const { getUniqueId } = require('./libs/unique-id');
const CONSTS = require('./consts');
const Creature = require('./Creature');

const zs = require('./z-schemas');

const { sortByDependency } = require('./libs/sort-by-dependency');
const DATA = require('./data');


/**
 * This class takes blueprints, and create real items out of them
 */
class EntityBuilder {
    constructor () {
        this._blueprints = new Map();
        this._propertyBuilder = null;
        this._data = {
            ...DATA
        };
    }

    get data () {
        return this._data;
    }

    /**
     * Add a property to a creature
     * @param oEntity {Creature|RBSItem}
     * @param oProperty {object}
     */
    addProperty (oEntity, oProperty) {
        const p = this.propertyBuilder.buildProperty(oProperty);
        if (oEntity instanceof Creature) {
            oEntity.mutations.addProperty({ property: p });
        } else {
            if (!oEntity.properties.some(p => p.id === oProperty.id)) {
                oEntity.properties.push(oProperty);
            }
        }
        return p;
    }

    /**
     * remove a property from a creature or item
     * item must be unequipped first
     * @param oEntity {Creature|RBSItem}
     * @param oProperty {RBSProperty}
     */
    removeProperty (oEntity, oProperty) {
        const idProperty = oProperty.id;
        if (oEntity instanceof Creature) {
            const p = oEntity.getters.getInnateProperties.find(({ id }) => id === idProperty);
            if (p) {
                oEntity.mutations.removeProperty({ property: p });
            }
        } else {
            const iProp = oEntity.properties.findIndex(p => p.id === idProperty);
            if (iProp >= 0) {
                oEntity.properties.splice(iProp, 1);
            }
        }
    }

    /**
     * Return true if the creature has the specified property
     * @param oCreature {Creature}
     * @param sFeat {string} feat identifier
     * @returns {boolean}
     */
    hasFeat (oCreature, sFeat) {
        return !!oCreature
            .getters
            .getInnateProperties
            .find(p => p.type === CONSTS.PROPERTY_FEAT && p.data.feat === sFeat);
    }

    /**
     * return feat repository
     * @returns {{[idFeat: string]: object}}
     */
    getFeatRepository () {
        return this.data['FEATS'];
    }

    /**
     * Adds a feat to a creature
     * @param oCreature {Creature}
     * @param sFeat {string}
     */
    addCreatureFeat (oCreature, sFeat) {
        if (this.hasFeat(oCreature, sFeat)) {
            return;
        }
        const oFeat = this.getFeatRepository()[sFeat];
        const aFeatProperties = oFeat.properties;
        if (aFeatProperties) {
            const aPropIds = aFeatProperties.map(property => {
                const p = this.addProperty(oCreature, property);
                return p.id;
            });
            this.addProperty(oCreature, {
                type: CONSTS.PROPERTY_FEAT,
                feat: sFeat,
                properties: aPropIds
            });
        }
    }

    /**
     *
     * @param oCreature {Creature}
     * @param sFeat {string}
     */
    removeCreatureFeat (oCreature, sFeat) {
        const aInnateProps = oCreature.getters.getInnateProperties;
        const oProps = Object.fromEntries(aInnateProps.map(p => [p.id, p]));
        aInnateProps
            .filter(p => p.type === CONSTS.PROPERTY_FEAT && p.feat === sFeat)
            .reduce((prev, idProp) => prev.concat(idProp), [])
            .map(idProp => oProps[idProp])
            .filter(p => !!p)
            .forEach(p => this.removeProperty(oCreature, p));
    }

    /**
     *
     * @returns {PropertyBuilder}
     */
    get propertyBuilder () {
        return this._propertyBuilder;
    }

    set propertyBuilder (propertyBuilder) {
        this._propertyBuilder = propertyBuilder;
    }

    set schemaValidator (value) {
        throw new Error('ERR_DEPRECATED');
    }

    get blueprints () {
        return this._blueprints;
    }

    set blueprints (value) {
        const aIdentifiedBlueprints = Object
            .entries(value)
            .map(([key, bp]) => ({
                ref: key,
                ...bp
            }));
        const aSortedBlueprints = sortByDependency(aIdentifiedBlueprints, 'ref', 'extends');
        aSortedBlueprints.forEach(blueprint => {
            this.defineBlueprint(blueprint.ref, blueprint);
        });
    }

    addData (data) {
        deepMerge(this._data, data);
    }

    /**
     * @typedef RBSItemBlueprint {object}
     * @property [ref] {string}
     * @property [extends] {string[]}
     * @property entityType {string} entity type : always ENTITY_TYPE_ITEM
     * @property itemType {string} item type
     * @property proficiencies {string[]} item proficiency (condition to use efficiently)
     * @property [damages] {number|string} weapon damage amount (can be dice expression)
     * @property [damageType] {string} weapon damage type list
     * @property weight {number} item weight
     * @property [attributes] {string[]} weapon attribute list
     * @property [size] {string} weapon size
     * @property [charges] {number} maximum number of charges
     * @property [equipmentSlots] {string[]} list of slot where item can be equipped
     * @property [ac] {number}
     * @property [maxDexterityBonus] {number}
     * @property properties {RBSProperty[]}
     * @property [spell] {string} spell cast when used
     *
     *
     * @typedef RBSActorBlueprint {object}
     * @property [extends] {string[]}
     * @property ac {number}
     * @property hd {number}
     * @property entityType {string}
     * @property [abilities] {{[ability: string]: number}}
     * @property classType {string}
     * @property level {number}
     * @property specie {string}
     * @property [race] {string}
     * @property speed {number}
     * @property properties
     * @property feats {string[]}
     * @property equipment {(string|RBSItemBlueprint)[]}
     * @property proficiencies {string[]}
     * @property actions {RBSAction[]}
     *
     * @param id {string}
     * @param blueprint {RBSActorBlueprint|RBSItemBlueprint}
     * @returns {RBSItemBlueprint}
     */
    defineBlueprint (id, blueprint) {
        if (this._blueprints.has(id)) {
            throw new Error(`blueprint ${id} is already defined`);
        }
        const oBuiltBlueprint = EntityBuilder.composeBlueprint(blueprint, this._blueprints);
        oBuiltBlueprint.ref = id;
        try {
            switch (oBuiltBlueprint.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                zs.Item.parse(oBuiltBlueprint);
                break;
            }

            case CONSTS.ENTITY_TYPE_ACTOR: {
                zs.Creature.parse(oBuiltBlueprint);
                break;
            }
            }
        } catch (e) {
            throw new Error(`Schema validation error on blueprint : ${id}\n${e.message}`);
        }
        const oFinalBP = deepFreeze(oBuiltBlueprint);
        this._blueprints.set(id, oFinalBP);
        return oFinalBP;
    }

    /**
     * Compose a blueprint by resolving all extends
     * @param blueprint {RBSActorBlueprint|RBSItemBlueprint}
     * @param blueprints {Map<string, RBSActorBlueprint|RBSItemBlueprint>}
     */
    static composeBlueprint (blueprint, blueprints) {
        const KEY_EXTENDS = 'extends';
        const oBuiltBlueprint = {};
        if (KEY_EXTENDS in blueprint) {
            oBuiltBlueprint[KEY_EXTENDS] = blueprint[KEY_EXTENDS];
        }
        while (KEY_EXTENDS in oBuiltBlueprint) {
            if (!Array.isArray(oBuiltBlueprint[KEY_EXTENDS])) {
                throw new TypeError('blueprint ' + KEY_EXTENDS + ' field must be an array');
            }
            const aExtends = oBuiltBlueprint[KEY_EXTENDS];
            delete oBuiltBlueprint[KEY_EXTENDS];
            aExtends.forEach(x => {
                if (blueprints.has(x)) {
                    deepMerge(oBuiltBlueprint, blueprints.get(x));
                } else {
                    throw new Error(`blueprint extends from an non-existant blueprint ${x}`);
                }
            });
        }
        deepMerge(oBuiltBlueprint, blueprint);
        delete oBuiltBlueprint[KEY_EXTENDS];
        if (!('properties' in oBuiltBlueprint)) {
            oBuiltBlueprint.properties = [];
        }
        return oBuiltBlueprint;
    }

    _hashObject (oObject) {
        const sObject = JSON.stringify(oObject);
        return crypto.createHash('md5').update(sObject).digest('hex');
    }

    _checkResRef (resref) {
        if (!(this._blueprints.has(resref))) {
            throw new Error(`resref ${resref} does not lead to a defined blueprint`);
        }
        return this._blueprints.get(resref);
    }

    /**
     * Register a blueprint without identifier, builds an identifier out of blueprint serialisation
     * @param blueprint {RBSItemBlueprint|string}
     * @returns {RBSItemBlueprint|RBSActorBlueprint|string}
     */
    _registerUnidentifiedBlueprint (blueprint) {
        if (typeof blueprint === 'string') {
            if (this._blueprints.has(blueprint)) {
                return this._blueprints.get(blueprint);
            } else {
                throw new ReferenceError(`This blueprint does not exist ${blueprint}`);
            }
        }
        const sHash = this._hashObject(blueprint);
        if (this._blueprints.has(sHash)) {
            return this._blueprints.get(sHash);
        } else {
            return this.defineBlueprint(sHash, blueprint);
        }
    }

    /**
     *
     * @param aProperties
     * @returns {RBSProperty[]}
     * @private
     */
    _buildProperties (aProperties) {
        return aProperties.map(p => this._propertyBuilder.buildProperty(p));
    }

    /**
     * @typedef RBSItem {object}
     * @property id {string} item identifier
     * @property ref {string} blueprint reference
     * @property blueprint {RBSItemBlueprint}
     * @property remainingCharges {number} current number of charges
     * @property properties {[]} these property list can be altered (remov item, add item...)
     *
     * @param resref
     * @param id
     * @returns {RBSItem}
     */
    createItemFromResRef (resref, id) {
        const oBlueprint = this._checkResRef(resref);
        return {
            id: id || getUniqueId(),
            blueprint: oBlueprint,
            remainingCharges: oBlueprint.charges || 0,
            tag: 'tag' in oBlueprint ? oBlueprint.tag : '',
            properties: this._buildProperties(oBlueprint.properties)
        };
    }

    createCreatureFromResRef (resref, id = undefined) {
        try {
            const oBlueprint = this._checkResRef(resref);
            const oCreature = new Creature({ blueprint: oBlueprint, id, data: this._data });
            this
                ._buildProperties(oBlueprint.properties)
                .forEach(property => oCreature.mutations.addProperty({ property }));
            Object
                .values(oBlueprint.equipment)
                .forEach(item => {
                    const oItem = this.createEntity(item);
                    oCreature.equipItem(oItem);
                });
            Object
                .values(oBlueprint.actions)
                .forEach(action => {
                    oCreature.mutations.defineAction(action);
                });
            if (oBlueprint.spells) {
                Object
                    .values(oBlueprint.spells)
                    .forEach(spell => {
                        oCreature.mutations.learnSpell(spell);
                    });
            }
            return oCreature;
        } catch (e) {
            console.error(e);
            throw new Error(`Could not build creature ${resref} : ${e.message}`, { cause: e });
        }
    }

    /**
     * Returns a fully instanciated Item or Creature according to blueprint
     * Returns null in case of a partial blueprint
     * @param blueprint {RBSActorBlueprint|RBSItemBlueprint}
     * @param id {string}
     * @returns {Creature|RBSItem|null}
     */
    createEntity (blueprint, id = '') {
        const bp = this._registerUnidentifiedBlueprint(blueprint);
        const idbp = bp.ref;
        if ((id ?? '') === '') {
            id = getUniqueId();
        }
        switch (bp.entityType) {
        case CONSTS.ENTITY_TYPE_PARTIAL_ITEM:
        case CONSTS.ENTITY_TYPE_ITEM: {
            return this.createItemFromResRef(idbp, id);
        }

        case CONSTS.ENTITY_TYPE_ACTOR: {
            return this.createCreatureFromResRef(idbp, id);
        }

        case CONSTS.ENTITY_TYPE_PARTIAL_ACTOR: {
            return null;
        }

        default: {
            throw new Error(`What the hell is this blueprint : ${idbp} / ${bp.entityType} ?`);
        }
        }
    }
}

module.exports = EntityBuilder;
