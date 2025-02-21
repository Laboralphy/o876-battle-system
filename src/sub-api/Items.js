const ServiceAbstract = require('./ServiceAbstract');
const BoxedItem = require('./classes/BoxedItem');

class Items extends ServiceAbstract {
    checkItem (oItem) {
        return oItem instanceof BoxedItem;
    }

    /**
     * Return the type of an item
     * @param oItem {BoxedItem} identifier of item
     * @returns {string} ITEM_TYPE_
     */
    getItemType (oItem) {
        return oItem[BoxedItem.SYMBOL_BOXED_OBJECT].blueprint.itemType;
    }

    /**
     * Returns an item tag
     * @param oItem {BoxedItem}
     * @returns {string}
     */
    getItemTag (oItem) {
        return oItem[BoxedItem.SYMBOL_BOXED_OBJECT].tag;
    }

    /**
     * Sets an item tag with new value
     * @param oItem {BoxedItem}
     * @param tag {string}
     */
    setItemTag (oItem, tag) {
        oItem[BoxedItem.SYMBOL_BOXED_OBJECT].tag = tag;
    }
}

module.exports = Items;
