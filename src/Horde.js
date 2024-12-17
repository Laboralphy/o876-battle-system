class Horde {
    constructor () {
        this._creatures = {}
        // list of creatures that have running effect or action cooling down
        this._activeCreatures = new Set()
    }

    get creatures () {
        return this._creatures
    }

    forEach (f) {
        const aCreatures = Object.values(this._creatures)
        aCreatures.forEach(((creature, index) => f(creature, index, aCreatures)))
    }

    linkCreature (oCreature) {
        this._creatures[oCreature.id] = oCreature
    }

    unlinkCreature (oCreature) {
        this._activeCreatures.delete(oCreature)
        delete this._creatures[oCreature.id]
    }

    setCreatureActive (oCreature) {
        this._activeCreatures.add(oCreature)
    }

    isCreatureActive (oCreature) {
        return oCreature.getters.getEffects.length > 0 ||
            Object.values(oCreature.getters.getActions).some(action => action.cooldown > 0);
    }

    shrinkActiveCreatureRegistry () {
        const tac = this._activeCreatures
        if (tac.size === 0) {
            return
        }
        this.activeCreatures.forEach(creature => {
            if (!this.isCreatureActive(creature)) {
                tac.remove(creature)
            }
        })
    }

    get activeCreatures () {
        return Array.from(this._activeCreatures)
    }
}

module.exports = Horde