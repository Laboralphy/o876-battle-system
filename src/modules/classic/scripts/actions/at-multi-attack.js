/**
 * Multi attack
 * Will attack all opponents at once
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 * @param count {number} number of attacks
 */
function main ({ manager, action, combat }) {
    const {
        range,
        parameters: {
            count
        }
    } = action
    const oAttacker = combat.attacker
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range)
    const aTargets = []
    for (let i = 0; i < count; ++i) {
        aTargets.push(aOffenders[Math.floor(oAttacker.dice.random() * aOffenders.length)])
    }
    aTargets.forEach(offender => {
        manager.deliverAttack(oAttacker, offender)
    })
}

module.exports = main
