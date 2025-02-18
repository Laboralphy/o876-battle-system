const Creature = require('../../Creature')
const BoxedObject = require('./BoxedObject')

class BoxedCreature extends BoxedObject{
    constructor (creature) {
        super(creature)
        if (!(creature instanceof Creature)) {
            throw new TypeError('Expected Creature instance')
        }
        this.id = creature.id
    }

    get properties () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT].getters.getProperties
    }

    get isCreature () {
        return this[BoxedObject.SYMBOL_BOXED_OBJECT] instanceof Creature
    }
}

module.exports = BoxedCreature
