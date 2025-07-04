/**
 *
 * @param nDieFaceCount {number}
 * @param nLevel {number}
 * @returns {string}
 */
function getCantripDamageDice (nDieFaceCount, nLevel) {
    let nDamage = 1;
    if (nLevel >= 5) {
        ++nDamage;
    }
    if (nLevel >= 11) {
        ++nDamage;
    }
    if (nLevel >= 17) {
        ++nDamage;
    }
    return nDamage.toString() + 'd' + nDieFaceCount.toString();
}

/**
 * @param manager {Manager}
 * @param caster {Creature}
 * @param target {Creature}
 */
function main ({ manager, caster, target }) {
    // compute 1d6 acid damage
    const nCasterLevel = manager.getCreatureLevel(caster);
    const sDamage = getCantripDamageDice(6, nCasterLevel);

}
