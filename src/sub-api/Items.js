const ServiceAbstract = require('./ServiceAbstract');
const BoxedItem = require('./classes/BoxedItem');

class Items extends ServiceAbstract {
    /**
     * Return the type of an item
     * @param oItem {BoxedItem} identifier of item
     * @returns {string} ITEM_TYPE_
     */
    getItemType (oItem) {
        return oItem[BoxedItem.SYMBOL_BOXED_OBJECT].blueprint.itemType;
    }

    /**
     * Weight of an item
     * @param oItem {BoxedItem} item identifier
     * @returns {number}
     */
    getWeight (oItem) {
        return oItem[BoxedItem.SYMBOL_BOXED_OBJECT].blueprint.weight;
    }
}

module.exports = Items;
