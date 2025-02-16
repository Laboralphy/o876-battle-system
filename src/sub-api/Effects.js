const Abstract = require('./ServiceAbstract')
const BoxedEffect = require('./classes/BoxedEffect')
const SYMBOL_ORIGINAL_EFFECT = BoxedEffect.SYMBOL_BOXED_OBJECT

const TAG_SPELL_GROUP = 'SPELL_GROUP::'



class Effects extends Abstract {
    /**
     * Returns a list of effect applied on the specified creature
     * @param idCreature {string} creature identifier
     * @returns {BoxedEffect[]}
     */
    getEffects (idCreature) {
        return this
            ._services
            .creatures
            .getCreature(idCreature)
            .getters
            .getEffects
            .map(effect => new BoxedEffect(effect))
    }

    /**
     * Get effect duration
     * @param oEffect {BoxedEffect}
     * @returns {number}
     */
    getEffectDuration (oEffect) {
        return oEffect.duration
    }

    /**
     * Get effect type
     * @param oEffect {BoxedEffect}
     * @returns {string} EFFECT_*
     */
    getEffectType (oEffect) {
        return oEffect.type
    }

    /**
     * Returns true if effect is extraordinary
     * @param oEffect {BoxedEffect}
     * @returns {boolean}
     */
    isEffectExtraordinary (oEffect) {
        return oEffect.isExtraordinary
    }

    /**
     * Returns true if effect is supernatural
     * @param oEffect {BoxedEffect}
     * @returns {boolean}
     */
    isEffectSupernatural (oEffect) {
        return oEffect.isSupernatural
    }

    /**
     * Returns the creature identifier who created this effect
     * @param oEffect {BoxedEffect}
     * @returns {string}
     */
    getEffectCreator (oEffect) {
        return oEffect.source
    }

    /**
     * Creates an effect
     * @param sEffect {string} EFFECT_*
     * @param amp {string|number} amplitude can be either a number or a Die expression (1d6, 2d8+5, ...)
     * @param data {object} Effect parameters
     * @return {BoxedEffect} Can be safely serialized, but should not be modified
     */
    createEffect (sEffect, amp = 0, data = {}) {
        return new BoxedEffect(this._services.core.manager.createEffect(sEffect, amp, data))
    }

    /**
     * Same as createEffect but with extraordinary subtype
     * @param sEffect {string} EFFECT_*
     * @param amp {string|number} amplitude can be either a number or a Die expression (1d6, 2d8+5, ...)
     * @param data {object}
     * @return {RBSEffect}
     */
    createExtraordinaryEffect (sEffect, amp = 0, data = {}) {
        return new BoxedEffect(this._services.core.manager.createExtraordinaryEffect(sEffect, amp, data))
    }

    /**
     * Same as createEffect but with supernatural subtype
     * @param sEffect {string} EFFECT_*
     * @param amp {string|number} amplitude can be either a number or a Die expression (1d6, 2d8+5, ...)
     * @param data {object}
     * @return {RBSEffect}
     */
    createSupernaturalEffect (sEffect, amp = 0, data = {}) {
        return new BoxedEffect(this._services.core.manager.createSupernaturalEffect(sEffect, amp, data))
    }

    /**
     * Gather several effects in a "spell effect". These spells are siblings, removing one effect removes all effects
     * @param idSpell {string} spell identifier
     * @param target {string} identifier of target creature
     * @param duration {number} duration of all effects
     * @param source {string} identifier of source creature
     * @param aEffects {BoxedEffect[]} list of all effects
     */
    applySpellEffectGroup (idSpell, aEffects, target, duration = 0, source = undefined) {
        const oTarget = this._services.creatures.getCreature(target)
        const oSource = this._services.creatures.getCreature(source ?? target)
        this
            ._services
            .core
            .manager
            .effectProcessor
            .applyEffectGroup(
                aEffects.map(effect => effect[SYMBOL_ORIGINAL_EFFECT]),
                TAG_SPELL_GROUP + idSpell,
                oTarget,
                duration,
                oSource
            )
    }

    /**
     * Applies an effect to the target creature
     * @param oEffect {BoxedEffect} Effect created by createEffect
     * @param idTargetCreature {string} creature whose effect is applied
     * @param nDuration {number} duration of effect
     * @param [idSourceCreature] {string} if undefined, will be set to idTargetCreature
     */
    applyEffect (oEffect, idTargetCreature, nDuration = 0, idSourceCreature = undefined) {
        const oRealEffect = oEffect[SYMBOL_ORIGINAL_EFFECT]
        const target = this._services.creatures.getCreature(idTargetCreature)
        const source = this._services.creatures.getCreature(idSourceCreature ?? idTargetCreature)
        this._services.core.manager.applyEffect(oRealEffect, target, nDuration, source)
    }

    /**
     * Removes an effect
     * @param effect {BoxedEffect}
     */
    removeEffect (effect) {
        const oRealEffect = effect[SYMBOL_ORIGINAL_EFFECT]
        const oCreature = this._services.creatures.getCreature(oRealEffect.target)
        const oAppliedEffect = oCreature.getters.getEffectRegistry[effect.id]
        this._services.core.manager.effectProcessor.removeEffect(oAppliedEffect)
    }
}

module.exports = Effects