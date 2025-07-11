const { getCantripDamageDice, castDirectDamageSpell } = require('../helper/spell-helper');

/*
You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target.
On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.

This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).

 */

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 * @param spell {{}}
 */
function main ({ manager, caster, target, spell }) {
    // compute 1d10 acid damage (+1d10 at levels 5, 11, 17)
    const nCasterLevel = manager.getCreatureLevel(caster);
    const sDamage = getCantripDamageDice(10, nCasterLevel);
    // Checks if dexterity saving throw is success
    castDirectDamageSpell({
        spell: spell.id,
        manager,
        caster,
        target,
        damage: sDamage,
        damageType: manager.CONSTS.DAMAGE_TYPE_FIRE,
        attack: true
    });
}

module.exports = main;
