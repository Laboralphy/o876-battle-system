const BoxedObject = require('./BoxedObject');
const CONSTS = require('../../consts');

class BoxedEffect extends BoxedObject {
    constructor (oRBSEffect) {
        super(oRBSEffect);
        this.id = oRBSEffect.id;
    }

    get type () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].type;
    }

    get duration () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].duration;
    }

    get source () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].source;
    }

    get subtype () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].subtype;
    }

    get isExtraordinary () {
        return this.subtype === CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY;
    }

    get isSupernatural () {
        return this.subtype === CONSTS.EFFECT_SUBTYPE_SUPERNATURAL;
    }
}

module.exports = BoxedEffect;
