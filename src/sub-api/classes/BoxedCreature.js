import Creature from "../../Creature";

const SYMBOL_ORIGINAL_CREATURE = 'SYMBOL_ORIGINAL_CREATURE'
class BoxedCreature {
    constructor (creature) {
        if (!(creature instanceof Creature)) {
            throw new TypeError('Expected Creature instance')
        }
        this.id = creature.id
        Object.defineProperty(this, SYMBOL_ORIGINAL_CREATURE, {
            value: creature,
            enumerable: false,
            writable: false,
            configurable: false
        })
    }

}

module.exports = BoxedCreature
