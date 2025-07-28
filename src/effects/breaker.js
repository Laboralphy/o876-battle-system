const CONSTS = require('../consts');

/**
 * This effect will break its sibling if :
 * - Saving throw is success each turn
 * - If a certain amount of damage is done
 *
 * @param effect
 * @param ability {string} ability for saving throw
 * @param threat {string} threat for saving throw
 * @param dc {number} difficulty to overcome in order too break effect, must be > 0 to be effective
 * @param damage {number} number of damage point needed in one attack to break the effect
 * @param damageType {string} restrict to damageType
 */
function init ({ effect, ability, threat = '', dc = 0, damage = Infinity, damageType = CONSTS.DAMAGE_TYPE_ANY }) {
    effect.data.dc = dc;
    effect.data.threat = threat;
    effect.data.ability = ability;
    effect.data.damage = damage;
    effect.data.damageType = damageType;
}


/**
 * Each time will try to break free
 * @param effect
 * @param effectProcessor {EffectProcessor}
 * @param target
 */
function mutate ({ effect, effectProcessor, target }) {
    if (effect.data.dc > 0) {
        if (target.rollSavingThrow(
            effect.data.ability,
            effect.data.dc,
            effect.data.threat
        ).success) {
            effectProcessor.removeEffect(effect);
        }
    }
}

function damaged ({ effect, effectProcessor, amount, damageType }) {
    if (effect.data.damageType === CONSTS.DAMAGE_TYPE_ANY || effect.data.damageType === damageType) {
        effect.data.damage -= amount;
        if (effect.data.damage <= 0) {
            effectProcessor.removeEffect(effect);
        }
    }
}

module.exports = {
    init,
    mutate,
    damaged
};
