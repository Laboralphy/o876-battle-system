const { getCantripDamageDice, castDirectDamageSpell } = require('../helper/spell-helper');

/*
You create a ghostly, skeletal hand in the space of a creature within range.
Make a ranged spell attack against the creature to assail it with the chill of the grave.
On a hit, the target takes 1d8 necrotic damage, and it can’t regain hit points until the start of your next turn.
Until then, the hand clings to the target.

If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.

This spell’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).
 */

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 * @param spell {RBSSpellData}
 */
function main ({ manager, caster, target, spell }) {
    // compute 1d8 withering damage (+1d8 at levels 5, 11, 17)
    const nCasterLevel = caster.getters.getLevel;
    const sDamage = getCantripDamageDice(10, nCasterLevel);
    // Checks if dexterity saving throw is success
    if (castDirectDamageSpell({
        spell: spell.id,
        manager,
        caster,
        target,
        damage: sDamage,
        damageType: manager.CONSTS.DAMAGE_TYPE_WITHERING,
        attack: true
    })) {
        // hit ! adds additional effects
        const aExtraEffects = [];
        // No heal
        aExtraEffects.push(manager.createEffect(manager.CONSTS.EFFECT_HEALING_FACTOR, 0));
        // if undead : disadvantage on attack rolls
        if (target.getters.getSpecie === manager.CONSTS.SPECIE_UNDEAD) {
            aExtraEffects.push(manager.createEffect(manager.CONSTS.EFFECT_DISADVANTAGE_ATTACK));
        }
        manager.applySpellEffectGroup(spell.id, aExtraEffects, target, 1, caster);
    }
}

module.exports = main;
