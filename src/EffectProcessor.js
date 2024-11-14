const Events = require('node:events')
const { v4: uuidv4 } = require('uuid')
const { getUniqueId } = require('./libs/unique-id')
const CONSTS = require('./consts')
const EFFECTS = require('./effects')
const Horde = require('./horde')

/**
 * @typedef RBSEffect {object}
 * @property id {string}
 * @property type {string} EFFECT_*
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
        return this.effectPrograms
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
    applyEffect (oEffect, target, source = null, duration = 0) {
        if (!source) {
            source = target
        }
        oEffect.duration = duration
        oEffect.target = target.id
        oEffect.source = source.id
        this.invokeEffectMethod(oEffect, 'mutate', target, source)
        this._events.emit('effect-applied', {
            effect: oEffect,
            target,
            source
        })
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
