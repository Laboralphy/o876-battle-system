const CONSTS = require('../../consts')
/**
 *
 * @param state {RBSStoreState}
 * @param blueprint {{ specie: string, race: string, gender: string, ac: number, speed: number, classType: string, level: number, [abilities]: { strength: number, dexterity: number, constitution: number, intelligence: number, wisdom: number, charisma: number }}}
 */
module.exports = ({ state }, { blueprint }) => {
    state.specie = blueprint.specie
    state.race = blueprint.race || CONSTS.RACE_UNKNOWN
    state.gender = blueprint.gender || CONSTS.GENDER_NONE
    state.naturalArmorClass = blueprint.ac || 10
    state.speed = blueprint.speed
    state.classType = blueprint.classType
    state.level = blueprint.level
    if ('abilities' in blueprint) {
        state.abilities[CONSTS.ABILITY_STRENGTH] = blueprint.abilities.strength
        state.abilities[CONSTS.ABILITY_DEXTERITY] = blueprint.abilities.dexterity
        state.abilities[CONSTS.ABILITY_CONSTITUTION] = blueprint.abilities.constitution
        state.abilities[CONSTS.ABILITY_INTELLIGENCE] = blueprint.abilities.intelligence
        state.abilities[CONSTS.ABILITY_WISDOM] = blueprint.abilities.wisdom
        state.abilities[CONSTS.ABILITY_CHARISMA] = blueprint.abilities.charisma
    }
}