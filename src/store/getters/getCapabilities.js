const CONSTS = require('../../consts')

/**
 * Retursna registry of thing that can do a creature
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals
 * @return {{act: boolean, fight: boolean, move: boolean, see: boolean, cast: { self: boolean, target: boolean } }}
 */
module.exports = (state, getters, externals) => {
    const aConditionSet = getters.getConditionSet
    const alive = !getters.isDead
    const act = alive && !(
        aConditionSet.has(CONSTS.CONDITION_CALM) ||
        aConditionSet.has(CONSTS.CONDITION_PARALYZED)
    )
    const fight = act && !aConditionSet.has(CONSTS.CONDITION_DAZED)
    const move = act && !aConditionSet.has(CONSTS.CONDITION_RESTRAINED)
    const see = !aConditionSet.has(CONSTS.CONDITION_BLINDED)
    const castSelf = act && !aConditionSet.has(CONSTS.CONDITION_DAZED)
    const castTarget = castSelf && see
    const cast = {
        self: castSelf,
        target: castTarget
    }
    const sClassTypeRef = getters.getClassTypeData.ref
    const sneak = alive && (
        sClassTypeRef === CONSTS.CLASS_TYPE_ROGUE ||
        sClassTypeRef === CONSTS.CLASS_TYPE_ROGUE_MAGIC_USER
    )
    return {
        act,
        move,
        cast,
        fight,
        see,
        sneak
    }
}
