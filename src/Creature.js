const { getUniqueId } = require('./libs/unique-id')
const { buildStore } = require('./store')
const CONSTS = require('./consts')

class Creature {
    constructor ({ blueprint = null, id = null }) {
        this._store = buildStore()
        this._blueprint = blueprint
        if (blueprint) {
            this.blueprint = blueprint
        }
        if (id) {
            this.mutations.setId({ value: id })
        } else {
            this.mutations.setId({ value: getUniqueId() })
        }
    }

    /**
     * return store getters
     * @returns {RBSStoreGetters}
     */
    get getters () {
        return this._store.getters
    }

    /**
     * return store mutations
     * @returns {RBSStoreMutations}
     */
    get mutations () {
        return this._store.mutations
    }

    /**
     * Returns creature id
     * @returns {string}
     */
    get id () {
        return this.getters.getId
    }

    /**
     * Sets creature id
     * @param value {string}
     */
    set id (value) {
        this.mutations.setId({ id: value })
    }

    set blueprint (blueprint) {
        const m = this.mutations
        m.setLevel({ value: blueprint.specie })
        m.setRace({ value: blueprint.race || CONSTS.RACE_UNKNOWN })
        m.setGender({ value: blueprint.gender || CONSTS.GENDER_NONE })
        m.setNaturalArmorClass({ value: blueprint.ac || 10 })
        m.setSpeed({ value: blueprint.speed })
        m.setClassType({ value: blueprint.classType })
        m.setLevel({ value: blueprint.level })
        if ('abilities' in blueprint) {
            m.setAbilityValue({ ability: CONSTS.ABILITY_STRENGTH, value: blueprint.abilities.strength })
            m.setAbilityValue({ ability: CONSTS.ABILITY_DEXTERITY, value: blueprint.abilities.dexterity })
            m.setAbilityValue({ ability: CONSTS.ABILITY_CONSTITUTION, value: blueprint.abilities.constitution })
            m.setAbilityValue({ ability: CONSTS.ABILITY_INTELLIGENCE, value: blueprint.abilities.intelligence })
            m.setAbilityValue({ ability: CONSTS.ABILITY_WISDOM, value: blueprint.abilities.wisdom })
            m.setAbilityValue({ ability: CONSTS.ABILITY_CHARISMA, value: blueprint.abilities.charisma })
        }
        this._blueprint = blueprint
    }

    get blueprint () {
        return this._blueprint
    }

    equipItem (oItem) {

    }
}

module.exports = Creature
