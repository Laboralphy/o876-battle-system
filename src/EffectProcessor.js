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
 * @property tag {string}
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

    /**
     * @returns {module:events.EventEmitter | module:events.EventEmitter<DefaultEventMap>}
     */
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
        const {
            subtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
            ...effectData
        } = data
        const oEffect = {
            id: getUniqueId(),
            type: sEffect,
            subtype,
            amp,
            data: {},
            duration: 0,
            target: '',
            source: '',
            siblings: [],
            tag: ''
        }
        this.invokeEffectMethod(oEffect, 'init', null, null, effectData)
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
        let bRejected = false
        const reject = () => {
            bRejected = true
        }
        this.invokeEffectMethod(oEffect, 'apply', target, source, { reject })
        if (bRejected) {
            this._events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, { effect: oEffect, target })
            return null
        }
        if (duration > 0) {
            target.mutations.addEffect({ effect: oEffect })
            this._horde.setCreatureActive(target)
        }
        this.invokeEffectMethod(oEffect, 'mutate', target, source)
        this._events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, {
            effect: oEffect,
            target,
            source
        })
        return oEffect
    }

    /**
     * Groups all specified effect. i.e : All effects will get a list of all siblings
     * @param aEffects {RBSEffect[]}
     * @param tag {string}
     */
    groupEffects (aEffects, tag = '') {
        const aSiblings = aEffects.map(({ id }) => id)
        aEffects.forEach(effect => {
            effect.siblings = aSiblings
            if (tag !== '') {
                effect.tag = tag
            }
        })
        return aEffects
    }

    /**
     * Will apply all specified effects as a group
     * @param aEffects {RBSEffect[]}
     * @param tag {string}
     * @param target {Creature}
     * @param duration {number}
     * @param source {Creature|null}
     */
    applyEffectGroup (aEffects, tag, target, duration = 0, source = null) {
        return this.groupEffects(aEffects, tag)
            .map(effect => this.applyEffect(effect, target, duration, source))
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
        const nPreviousEffectDuration = oEffect.duration
        if (nPreviousEffectDuration === nDuration) {
            return
        }
        const { target, source } = this.getEffectTargetSource(oEffect)
        target.mutations.setEffectDuration({ effect: oEffect, duration: Math.max(0, nDuration) })
        if (nDuration <= 0) {
            this.invokeEffectMethod(oEffect, 'dispose', target, source)
            this._events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED, {
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
        console.groupEnd()
    }

    processEffect (oEffect) {
        const oTarget = this._horde.creatures[oEffect.target]
        if (!oTarget) {
            // Target creature is no longer online
            throw new Error('An effect is processed, but the target creature is no longer registered in the horde.')
        }
        const oSource = this._horde.creatures[oEffect.source]
        this.invokeEffectMethod(oEffect, 'mutate', oTarget, oSource)
        const nCurrentDuration = oTarget.getters.getEffectRegistry[oEffect.id].duration
        oTarget.mutations.setEffectDuration({ effect: oEffect, duration: nCurrentDuration - 1 })
    }
}

module.exports = EffectProcessor
