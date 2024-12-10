const EntityBuilder = require('./EntityBuilder')
const EffectProcessor = require('./EffectProcessor')
const Horde = require('./Horde')
const Creature = require('./Creature')

class Manager {
    constructor () {
        this._horde = new Horde()
        this._entityBuilder = new EntityBuilder()
        this._effectProcessor = new EffectProcessor({ horde: this._horde })
    }

    createEntity (resref, id) {
        return this._entityBuilder.createEntity(resref, id)
    }

    createCombat (oAttacker, oDefender) {

    }
}
