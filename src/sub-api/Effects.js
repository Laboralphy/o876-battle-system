const ServiceAbstract = require('./ServiceAbstract');
const BoxedCreature = require('./classes/BoxedCreature');
const BoxedObject = require('./classes/BoxedObject');
const CONSTS = require('../consts');

const TAG_SPELL_GROUP = 'SPELL_GROUP::';

class Effects extends ServiceAbstract {
    /**
     * Returns a list of effect applied on the specified creature
     * @param oCreature {BoxedCreature} creature identifier
     * @returns {RBSEffect[]}
     */
    getEffects (oCreature) {
        return oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]
            .getters
            .getEffects;
    }

    /**
     * Get effect duration
     * @param oEffect {RBSEffect}
     * @returns {number}
     */
    getEffectDuration (oEffect) {
        return oEffect.duration;
    }

    /**
     * Get effect type
     * @param oEffect {RBSEffect}
     * @returns {string} EFFECT_*
     */
    getEffectType (oEffect) {
        return oEffect.type;
    }

    /**
     * Returns true if effect is extraordinary
     * @param oEffect {RBSEffect}
     * @returns {boolean}
     */
    isEffectExtraordinary (oEffect) {
        return oEffect.subtype === CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY;
    }

    /**
     * Returns true if effect is supernatural
     * @param oEffect {RBSEffect}
     * @returns {boolean}
     */
    isEffectSupernatural (oEffect) {
        return oEffect.subtype === CONSTS.EFFECT_SUBTYPE_SUPERNATURAL;
    }

    /**
     * Returns the creature identifier who created this effect
     * @param oEffect {RBSEffect}
     * @returns {BoxedCreature}
     */
    getEffectCreator (oEffect) {
        const idCreature = oEffect.source;
        const ent = this.services.entities;
        if (ent.entityExists(idCreature)) {
            return BoxedCreature.fromId(idCreature);
        } else {
            return null;
        }
    }

    /**
     * Returns the creature whose effect is applied on
     * @param oEffect {RBSEffect}
     * @returns {BoxedCreature}
     */
    getEffectTarget (oEffect) {
        const idCreature = oEffect.target;
        const ent = this.services.entities;
        if (ent.entityExists(idCreature)) {
            return BoxedObject.fromId(idCreature);
        } else {
            return null;
        }
    }

    /**
     * Creates an effect
     * @param sEffect {string} EFFECT_*
     * @param amp {string|number} amplitude can be either a number or a Die expression (1d6, 2d8+5, ...)
     * @param data {object} Effect parameters
     * @return {RBSEffect} Can be safely serialized, but should not be modified
     */
    createEffect (sEffect, amp = 0, data = {}) {
        return this._services.core.manager.createEffect(sEffect, amp, data);
    }

    /**
     * Same as createEffect but with extraordinary subtype
     * @param sEffect {string} EFFECT_*
     * @param amp {string|number} amplitude can be either a number or a Die expression (1d6, 2d8+5, ...)
     * @param data {object}
     * @return {RBSEffect}
     */
    createExtraordinaryEffect (sEffect, amp = 0, data = {}) {
        return this._services.core.manager.createExtraordinaryEffect(sEffect, amp, data);
    }

    /**
     * Same as createEffect but with supernatural subtype
     * @param sEffect {string} EFFECT_*
     * @param amp {string|number} amplitude can be either a number or a Die expression (1d6, 2d8+5, ...)
     * @param data {object}
     * @return {RBSEffect}
     */
    createSupernaturalEffect (sEffect, amp = 0, data = {}) {
        return this._services.core.manager.createSupernaturalEffect(sEffect, amp, data);
    }

    /**
     * Gather several effects in a "spell effect". These spells are siblings, removing one effect removes all effects
     * @param idSpell {string} spell identifier
     * @param target {BoxedCreature} identifier of target creature
     * @param duration {number} duration of all effects
     * @param source {BoxedCreature} identifier of source creature
     * @param aEffects {RBSEffect[]} list of all effects
     */
    applySpellEffectGroup (idSpell, aEffects, target, duration = 0, source = undefined) {
        const oTarget = target[BoxedCreature.SYMBOL_BOXED_OBJECT];
        const oSource = (source ?? target)[BoxedCreature.SYMBOL_BOXED_OBJECT];
        this
            ._services
            .core
            .manager
            .effectProcessor
            .applyEffectGroup(
                aEffects,
                TAG_SPELL_GROUP + idSpell,
                oTarget,
                duration,
                oSource
            );
    }

    /**
     * Applies an effect to the target creature
     * @param oEffect {RBSEffect} Effect created by createEffect
     * @param oTarget {BoxedCreature} creature whose effect is applied
     * @param nDuration {number} duration of effect
     * @param [oSource] {BoxedCreature} if undefined, will be set to idTargetCreature
     */
    applyEffect (oEffect, oTarget, nDuration = 0, oSource = undefined) {
        this._services.core.manager.applyEffect(
            oEffect,
            oTarget[BoxedCreature.SYMBOL_BOXED_OBJECT],
            nDuration,
            (oSource ?? oTarget)[BoxedCreature.SYMBOL_BOXED_OBJECT]
        );
    }

    /**
     * Removes an effect
     * @param effect {RBSEffect}
     */
    dispellEffect (effect) {
        const oCreature = this.getEffectTarget(effect);
        const oRealCreature = oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT];
        const oAppliedEffect = oRealCreature.getters.getEffectRegistry[effect.id];
        this._services.core.manager.effectProcessor.removeEffect(oAppliedEffect);
    }

    findEffects (oCreature, sType) {
        this.services.core.checkConstEffect(sType);
        const oRealCreature = oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT];
        return oRealCreature.getters.getEffects.filter(effect => effect.type === sType);
    }
}

module.exports = Effects;
