const CONSTS = require('../../consts');
const Creature = require('../../Creature');
const BoxedObject = require('./BoxedObject');

class BoxedItem extends BoxedObject{
    constructor (item) {
        super(item);
        if (!(item?.blueprint?.entityType === CONSTS.ENTITY_TYPE_ITEM instanceof Creature)) {
            throw new TypeError('Expected Creature instance');
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
