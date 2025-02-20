const SYMBOL_BOXED_OBJECT = Symbol('SYMBOL_BOXED_OBJECT');

class BoxedObject {
    static #instances = new Map();
    /**
     * @param oInstance { { id: string } }
     * @constructor
     */
    constructor (oInstance) {
        this.id = oInstance.id ?? undefined;
        if (!this.id) {
            throw new ReferenceError('This entity has no defined id');
        }
        if (BoxedObject.#instances.has(oInstance.id)) {
            return BoxedObject.#instances.get(oInstance.id);
        }
        Object.defineProperty(this, SYMBOL_BOXED_OBJECT, {
            value: oInstance,
            enumerable: false,
            writable: false,
            configurable: false
        });
        BoxedObject.#instances.set(oInstance.id, this);
    }

    free () {
        BoxedObject.destroy(this.id);
    }

    static destroy (id) {
        this.#instances.delete(id);
    }

    static fromId (id) {
        return this.#instances.get(id) ?? null;
    }

    static from ({ id }) {
        return this.fromId(id);
    }

    static get instanceMapCount () {
        return this.#instances.size;
    }

    static resetMap () {
        this.#instances = new Map();
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
