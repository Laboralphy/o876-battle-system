const { getUniqueId } = require('./libs/unique-id')
const { buildStore } = require('./store')
const CONSTS = require('./consts')

class Creature {
    constructor ({ blueprint = null, id = null }) {
        this._store = buildStore()
        this._blueprint = blueprint
        if (blueprint) {
            this.mutations.setBlueprint({ blueprint })
        }
        if (id) {
            this.mutations.setId({ id })
        } else {
            this.mutations.setId({ id: getUniqueId() })
        }
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
