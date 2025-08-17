const CONSTS = require('./consts');

class ConcentrationSpell {
    /**
     *
     * @param manager {Manager}
     * @param spell {string}
     * @param caster {Creature}
     * @param duration {number}
     */
    constructor ({ manager, spell, caster, duration }) {
        this._manager = manager;
        this._caster = caster;
        this._spell = spell;
        this._duration = duration;
        this._effects = [];
    }

    /**
     * apply a bunch of effects to a target
     * @param aEffects {RBSEffect[]}
     * @param target {Creature}
     */
    applyEffects (aEffects, target) {
        this._effects.push(...aEffects.map(eff => ({
            target: target.id,
            id: eff.id
        })));
        this._manager.applySpellEffectGroup(
            this._spell,
            aEffects,
            target,
            this._duration,
            this._caster
        );
    }

    /**
     * Creates the concentration effect on caster
     */
    commit () {
        if (this._effects.length > 0) {
            const eConcentration = this._manager.createEffect(CONSTS.EFFECT_CONCENTRATION, 0, {
                spell: this._spell,
                effects: this._effects
            });
            this._manager.applyEffect(eConcentration, this._caster, this._duration);
        }
    }
}

module.exports = ConcentrationSpell;
