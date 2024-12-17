const Events = require('node:events')
const { getUniqueId } = require('./libs/unique-id')
const CONSTS = require('./consts')
const EFFECTS = require('./effects')
const Horde = require('./Horde')

/**
 * @typedef RBSEffect {object}
 * @property id {string}
 * @property type {string} EFFECT_*
 * @property subtype {string} EFFECT_SUBTYPE_*
 * @property amp {number|string}
 * @property duration {number}
 * @property target {string}
 * @property source {string}
 * @property data {object}
 * @property siblings {string[]}
 * @property tags {string[]}
 */

class EffectProcessor {
    constructor ({ horde }) {
        this._events = new Events()
        this._effectPrograms = EFFECTS
        if (!(horde instanceof Horde)) {
            throw new TypeError('horde parameter : type mismatch')
        }
        this._horde = horde
    }

    get events () {
        return this._events
    }

    get effectPrograms () {
        return this._effectPrograms
    }

    set effectPrograms (value) {
        this._effectPrograms = value
    }

    /**
     * Invoke effect method
     * @param oEffect {RBSEffect}
     * @param sMethod
     * @param target
     * @param source
     * @param oParams
     * @returns {undefined|*}
     */
    invokeEffectMethod (oEffect, sMethod, target, source, oParams = {}) {
        const ee = this._effectPrograms[oEffect.type]
        if (sMethod in ee) {
            return ee[sMethod]({
                effect: oEffect,
                effectProcessor: this,
                target,
                source,
                ...oParams
            })
        }
        return undefined
    }

    /**
     *
     * @param sEffect
     * @param amp
     * @param data
     * @return {RBSEffect}
     */
    createEffect (sEffect, amp = 0, data = {}) {
        if (!(sEffect in this._effectPrograms)) {
            throw new Error('Effect ' + sEffect + ' is invalid')
        }
        const oEffect = {
            id: getUniqueId(),
            type: sEffect,
            subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
            amp,
            data: {},
            duration: 0,
            target: '',
            source: '',
            siblings: [],
            tags: []
        }
        this.invokeEffectMethod(oEffect, 'init', null, null, data)
        return oEffect
    }

    /**
     *
     * @param oEffect {RBSEffect}
     * @param target {Creature}
     * @param source {Creature}
     * @param duration
     */
    applyEffect (oEffect, target, duration = 0, source = null) {
        if (!source) {
            source = target
        }
        oEffect.duration = duration
        oEffect.target = target.id
        oEffect.source = source.id
        if (this.isImmuneToEffect(oEffect, target)) {
            this._events.emit('effect-immunity', { effect: oEffect, target })
            return null
        }
        if (duration > 0) {
            target.mutations.addEffect({ effect: oEffect })
            this._horde.setCreatureActive(target)
        }
        this.invokeEffectMethod(oEffect, 'mutate', target, source)
        this._events.emit('effect-applied', {
            effect: oEffect,
            target,
            source
        })
        return oEffect
    }

    /**
     * Return true if effect is rejected by immunity
     * @param oEffect {RBSEffect}
     * @param target {Creature}
     */
    isImmuneToEffect (oEffect, target) {
        const aImmunitySet = target.getters.getImmunitySet
        switch (oEffect.type) {
            case CONSTS.EFFECT_STUN: {
                return aImmunitySet.has(CONSTS.IMMUNITY_TYPE_STUN)
            }

            case CONSTS.EFFECT_PARALYSIS: {
                return aImmunitySet.has(CONSTS.IMMUNITY_TYPE_PARALYSIS)
            }

            case CONSTS.EFFECT_BLINDNESS: {
                return aImmunitySet.has(CONSTS.IMMUNITY_TYPE_BLINDNESS)
            }

            case CONSTS.EFFECT_CONFUSION: {
                return aImmunitySet.has(CONSTS.IMMUNITY_TYPE_CONFUSION)
            }

            case CONSTS.EFFECT_NEGATIVE_LEVEL: {
                return aImmunitySet.has(CONSTS.IMMUNITY_TYPE_NEGATIVE_LEVEL)
            }

            case CONSTS.EFFECT_DISEASE: {
                return aImmunitySet.has(CONSTS.IMMUNITY_TYPE_DISEASE)
            }

            case CONSTS.EFFECT_ABILITY_MODIFIER: {
                return oEffect.amp < 0 && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_ABILITY_DECREASE)
            }

            case CONSTS.EFFECT_ARMOR_CLASS_MODIFIER: {
                return oEffect.amp < 0 && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_AC_DECREASE)
            }

            case CONSTS.EFFECT_ATTACK_MODIFIER: {
                return oEffect.amp < 0 && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_ATTACK_DECREASE)
            }

            case CONSTS.EFFECT_DAMAGE_MODIFIER: {
                return oEffect.amp < 0 && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_DAMAGE_DECREASE)
            }

            case CONSTS.EFFECT_DEATH: {
                return oEffect.subtype === CONSTS.EFFECT_SUBTYPE_MAGICAL && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_DEATH)
            }

            case CONSTS.EFFECT_DAMAGE: {
                return oEffect.data.damageType === CONSTS.DAMAGE_TYPE_POISON && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_POISON)
            }

            case CONSTS.EFFECT_SPEED_FACTOR: {
                return (oEffect.amp === -Infinity && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_ROOT)) ||
                    (oEffect.amp < 0 && oEffect.amp > -Infinity && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_SLOW))
            }

            case CONSTS.EFFECT_SAVING_THROW_MODIFIER: {
                return oEffect.amp < 0 && aImmunitySet.has(CONSTS.IMMUNITY_TYPE_SAVING_THROW_DECREASE)
            }

            default: {
                return false
            }
        }
    }


    /**
     * Groups all specified effect. i.e : All effects will get a list of all siblings
     * @param aEffects {RBSEffect[]}
     * @param tags {string[]}
     * @private
     */
    _groupEffects (aEffects, tags = []) {
        const aSiblings = aEffects.map(({ id }) => id)
        aEffects.forEach(effect => {
            effect.siblings = aSiblings
            effect.tags.push(...tags)
        })
    }

    /**
     * Parameter will be output in an array, expect if parameter is already array
     * @param x {*}
     * @returns {[]}
     * @private
     */
    _forceArray (x) {
        return Array.isArray(x) ? x : [x]
    }

    /**
     * Will apply all specified effects as a group
     * @param aEffects {RBSEffect[]}
     * @param tags {string | string[]}
     * @param target {Creature}
     * @param duration {number}
     * @param source {Creature|null}
     */
    applyEffectGroup (aEffects, tags, target, duration = 0, source = null) {
        this._groupEffects(aEffects, this._forceArray(tags))
        aEffects.forEach(effect => {
            this.applyEffect(effect, target, duration, source)
        })
    }

    /**
     * get source and target of an effect
     * @param oEffect {RBSEffect}
     * @returns {{ source: Creature, target: Creature }}
     */
    getEffectTargetSource (oEffect) {
        const idTarget = oEffect.target
        const idSource = oEffect.source
        const target = this._horde.creatures[idTarget]
        const source = this._horde.creatures[idSource]
        return {
            target,
            source
        }
    }

    /**
     * change an effect duration
     * @param oEffect {RBSEffect}
     * @param nDuration {number} new duration
     */
    setEffectDuration (oEffect, nDuration) {
        const { target, source } = this.getEffectTargetSource(oEffect)
        target.mutations.setEffectDuration({ effect: oEffect, duration: Math.max(0, nDuration) })
        if (nDuration <= 0) {
            this.invokeEffectMethod(oEffect, 'dispose', target, source)
            this._events.emit('effect-disposed', {
                effect: oEffect,
                target,
                source
            })
        }
    }


    /**
     * Removes an effect from its target
     * @param oEffect
     */
    removeEffect (oEffect) {
        const { target, source } = this.getEffectTargetSource(oEffect)
        if (oEffect.siblings.length > 0) {
            const oEffectRegistry = target.getters.getEffectRegistry
            oEffect
                .siblings
                .map(effId => effId in oEffectRegistry
                    ? oEffectRegistry[effId]
                    : null
                )
                .filter(eff => eff !== null)
                .forEach(eff => {
                    this.setEffectDuration(eff, 0)
                })
        } else {
            this.setEffectDuration(oEffect, 0)
        }
    }

    processEffect (oEffect) {
        const oTarget = this._horde.creatures[oEffect.target]
        if (!oTarget) {
            // Target creature is no longer online
            throw new Error('An effect is processed, but the target creature is no longer registered in the horde.')
        }
        const oSource = this._horde.creatures[oEffect.source]
        this.invokeEffectMethod(oEffect, 'mutate', oTarget, oSource)
    }
}

module.exports = EffectProcessor
