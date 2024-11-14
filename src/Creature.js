const { buildStore } = require('./store')

class Creature {
    constructor () {
        this._store = buildStore()
    }

    /**
     * return store getters
     * @returns {RBSStoreGetters}
     */
    get getters () {
        return this._store.getters
    }

    /**
     * return store mutations
     * @returns {RBSStoreMutations}
     */
    get mutations () {
        return this._store.mutations
    }

    /**
     * Returns creature id
     * @returns {string}
     */
    get id () {
        return this.getters.getId
    }

    /**
     * Sets creature id
     * @param value {string}
     */
    set id (value) {
        this.mutations.setId({ id: value })
    }
}

module.exports = Creature
