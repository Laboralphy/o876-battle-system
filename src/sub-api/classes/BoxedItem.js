const CONSTS = require('../../consts');
const BoxedObject = require('./BoxedObject');

class BoxedItem extends BoxedObject{
    constructor (item) {
        super(item);
        if (!(item?.blueprint?.entityType === CONSTS.ENTITY_TYPE_ITEM)) {
            throw new TypeError('Expected Item instance');
        }
        this.id = item.id;
    }

    get properties () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].properties;
    }

    get isItem () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT]?.blueprint?.entityType === CONSTS.ENTITY_TYPE_ITEM;
    }
}

module.exports = BoxedItem;
