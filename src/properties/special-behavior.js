function init ({ property, combatTurn = '', damaged = '', attack = '' }) {
    if (!combatTurn && !damaged && !attack) {
        throw new Error('No script defined in Special Behavior property')
    }
    property.data = {
        combatTurn,
        damaged,
        attack
    }
}

/**
 * this part is triggered when a creature attacks
 * @param property {RBSProperty} the item property object
 * @param manager {Manager} Instance of manager
 * @param attackOutcome {AttackOutcome} the attack outcome
 */
function attack ({ property, manager, attackOutcome }) {
    const sScript = property.data.attack
    if (sScript) {
        manager.runScript(sScript, {
            attackOutcome
        })
    }
}

/**
 * This part is triggered when creature is damaged
 * @param property {RBSProperty} the item property object
 * @param manager {Manager} Instance of manager
 * @param creature {Creature} the damaged creature
 * @param source {Creature} the creature who is applying damage effects
 * @param sDamageType {string} a DAMAGE_TYPE_*
 * @param amount {number} number of damage points dealt
 * @param resisted {number} number of damage points resisted
 */
function damaged ({
    property,
    manager,
    creature,
    source,
    damageType,
    amount,
    resisted
}) {
    const sScript = property.data.damaged
    if (sScript) {
        manager.runScript(sScript, {
            manager,
            creature,
            source,
            damageType,
            amount,
            resisted
        })
    }
}

/**
 * This part is triggered each combat turn
 * @param property {RBSProperty} the item property object
 * @param manager {Manager} Instance of manager
 * @param creature {Creature} the acting creature
 * @param action {function(s:string)} a function called to define next action
 * @param combat {Combat}
 */
function combatTurn ({ property, manager, creature, action, combat }) {
    const sScript = property.data.combatTurn
    if (sScript) {
        manager.runScript(sScript, {
            manager,
            creature,
            action,
            combat
        })
    }
}

module.exports = {
    init,
    combatTurn,
    damaged,
    attack
}
