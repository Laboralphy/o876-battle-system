const EntityBuilder = require('./EntityBuilder')

/**
 * @typedef RBSProperty
 * @property type {string} PROPERTY_*
 * @property amp {number|string}
 * @property data {object}
 */
class Manager {
    constructor () {
        this._entityBuilder = new EntityBuilder()
    }



    createEntity (resref) {

    }
}
