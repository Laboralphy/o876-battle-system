const BoxedObject = require('./BoxedObject')

class BoxedAction extends BoxedObject {
    /**
     *
     * @param oAction {RBSAction}
     */
    constructor (oAction) {
        super(oAction)
        this.id = oAction.id
    }

    get cooldown () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].cooldown
    }

    get charges () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].charges
    }

    get maxCharges () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].maxCharges
    }

    get range () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].range
    }

    get ready () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].ready
    }
}

module.exports = BoxedAction
