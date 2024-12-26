const { getUniqueId } = require('./libs/unique-id')
const { buildStore } = require('./store')
const CONSTS = require('./consts')
const Events = require('events')
const Dice = require('./libs/dice')

class Creature {
    constructor ({ blueprint = null, id = null } = {}) {
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
        this._actions = {}
        this._events = new Events
        this._dice = new Dice()
    }

    /**
     * @returns {Dice}
     */
    get dice () {
        return this._dice
    }

    get events () {
        return this._events
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
        m.setNaturalArmorClass({ value: blueprint.ac || 0 })
        m.setSpeed({ value: blueprint.speed })
        m.setClassType({ value: blueprint.classType })

        m.setLevel({ value: blueprint.level })
        blueprint.proficiencies.forEach(value => m.addProficiency({ value }))
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
        return this.mutations.equipItem({ item: oItem })
    }

    /**
     * select an offensive slot
     * @param sSlot {string}
     */
    selectOffensiveSlot (sSlot) {
        const sPrevSlot = this.getters.getSelectedOffensiveSlot
        if (sSlot !== sPrevSlot) {
            this.mutations.selectOffensiveSlot({ value: sSlot })
            this._events.emit(CONSTS.EVENT_CREATURE_SELECT_WEAPON, {
                slot: sSlot,
                previousSlot: sPrevSlot
            })
        }
    }


    /**
     * Returns true if this creature can detect its target
     * @param oTarget {Creature}
     * @return {string} CREATURE_VISIBILITY_*
     */
    getCreatureVisibility (oTarget) {
        if (oTarget === this) {
            return CONSTS.CREATURE_VISIBILITY_VISIBLE
        }
        const mg = this.getters
        const tg = oTarget.getters
        const myConditions = mg.getConditionSet
        const myEffects = mg.getEffectSet
        const myProps = mg.getPropertySet
        const targetEffects = tg.getEffectSet
        const targetProps = tg.getPropertySet
        if (myConditions.has(CONSTS.CONDITION_BLINDED)) {
            return CONSTS.CREATURE_VISIBILITY_BLINDED
        }
        if (targetEffects.has(CONSTS.EFFECT_INVISIBILITY) && !myEffects.has(CONSTS.EFFECT_SEE_INVISIBILITY)) {
            return CONSTS.CREATURE_VISIBILITY_INVISIBLE
        }
        if (targetEffects.has(CONSTS.EFFECT_STEALTH)) {
            return CONSTS.CREATURE_VISIBILITY_HIDDEN
        }
        const bInDarkness = mg.getEnvironment[CONSTS.ENVIRONMENT_DARKNESS]
        if (bInDarkness && !myEffects.has(CONSTS.EFFECT_DARKVISION) && !myProps.has(CONSTS.PROPERTY_DARKVISION)) {
            // if environment is dark, then one of the two opponent must have a source light
            return (
                myProps.has(CONSTS.PROPERTY_LIGHT) ||
                targetProps.has(CONSTS.PROPERTY_LIGHT) ||
                myEffects.has(CONSTS.EFFECT_LIGHT) ||
                targetEffects.has(CONSTS.EFFECT_LIGHT)
            )
                ? CONSTS.CREATURE_VISIBILITY_VISIBLE
                : CONSTS.CREATURE_VISIBILITY_DARKNESS
        }
        return CONSTS.CREATURE_VISIBILITY_VISIBLE
    }

    /**
     * Attack target with equipped weapon
     * @param oTarget {Creature}
     * @param oAttackOutcome
     */
    attack (oTarget, oAttackOutcome) {
        oAttackOutcome.target = oTarget
    }


    /**
     * Revive a dead creature
     */
    revive () {
        if (this.getters.isDead) {
            this._events.emit('revive')
            this.mutations.setHitPoints({ value: 1 })
        }
    }

    get hitPoints () {
        return this.getters.getHitPoints
    }

    set hitPoints (hp) {
        const nCurrHP = this.getters.getHitPoints
        if (this.getters.isDead) {
            return
        }
        const nMaxHP = this.getters.getMaxHitPoints
        hp = Math.max(0, Math.min(hp, nMaxHP))
        if (hp === nCurrHP) {
            return
        }
        this.mutations.setHitPoints({ value: hp })
    }
}

module.exports = Creature
