const SYMBOL_BOXED_OBJECT = Symbol('SYMBOL_BOXED_OBJECT');

class BoxedObject {
    /**
     * @param oInstance { { id?: string } }
     * @constructor
     */
    constructor (oInstance) {
        this.id = oInstance.id ?? undefined;
        Object.defineProperty(this, SYMBOL_BOXED_OBJECT, {
            value: oInstance,
            enumerable: false,
            writable: false,
            configurable: false
        });
    }

    /**
     * @returns {symbol}
     */
    static get SYMBOL_BOXED_OBJECT () {
        return SYMBOL_BOXED_OBJECT;
    }

    toJSON () {
        return { id: this.id, type: this.constructor.name };
    }
}

module.exports = BoxedObject;
