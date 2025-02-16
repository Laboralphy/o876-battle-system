const ServiceAbstract = require('./ServiceAbstract')

class Items extends ServiceAbstract {
    /**
     * Returns true if specified entity is an item
     * @param idEntity {string} entity identifier
     * @returns {boolean}
     */
    isItem (idEntity) {
        const oEntity = this._services.core.getEntity(idEntity)
        return oEntity.blueprint?.entityType === this._services.core.CONSTS.ENTITY_TYPE_ITEM
    }

    /**
     * Get a refernce of an item
     * @param idItem {string} item identifier
     * @returns {RBSItem}
     */
    getItem (idItem) {
        if (this.isItem(idItem)) {
            return this._services.core.getEntity(idItem)
        } else {
            throw new Error(`this is not an item ${idItem}`)
        }
    }

    /**
     * Return the type of an item
     * @param idItem {string} identifier of item
     * @returns {string} ITEM_TYPE_
     */
    getItemType (idItem) {
        return this.getItem(idItem).blueprint.itemType
    }

    /**
     * Weight of an item
     * @param idItem {string} item identifier
     * @returns {number}
     */
    getWeight (idItem) {
        return this.getItem(idItem).blueprint.weight
    }


}

module.exports = Items