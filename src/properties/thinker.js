function init ({ property, combat = '', damaged = '', attack = '', attacked = '' }) {
    if (!combat && !damaged && !attack) {
        throw new Error('No script defined in Special Behavior property');
    }
    property.data = {
        combat,
        damaged,
        attack,
        attacked
    };
}

/**
 * this part is triggered when a creature attacks
 * @param property {RBSProperty} the item property object
 * @param manager {Manager} Instance of manager
 * @param creature {Creature} the attacking creature
 * @param target {Creature} the targetted creature
 * @param attack {AttackOutcome} the attack outcome
 */
function attack ({ property, manager, creature, target, attack }) {
    const sScript = property.data.attack;
    if (sScript) {
        manager.runScript(sScript, {
            manager,
            creature,
            target,
            attack
        });
    }
}
/**
 * this part is triggered when a creature attacks
 * @param property {RBSProperty} the item property object
 * @param manager {Manager} Instance of manager
 * @param creature {Creature} the attacking creature
 * @param target {Creature} the targetted creature
 * @param attack {AttackOutcome} the attack outcome
 */
function attacked ({ property, manager, creature, target, attack }) {
    const sScript = property.data.attack;
    if (sScript) {
        manager.runScript(sScript, {
            manager,
            creature,
            target,
            attack
        });
    }
}

/**
 * This part is triggered when creature is damaged
 * @param property {RBSProperty} the item property object
 * @param manager {Manager} Instance of manager
 * @param creature {Creature} the damaged creature
 * @param sDamageType {string} a DAMAGE_TYPE_*
 * @param amount {number} number of damage points dealt
 * @param resisted {number} number of damage points resisted
 */
function damaged ({ property, manager, creature, damageType: sDamageType, amount, resisted }) {
    const sScript = property.data.damaged;
    if (sScript) {
        manager.runScript(sScript, {
            manager,
            creature,
            damageType: sDamageType,
            amount,
            resisted
        });
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
    const sScript = property.data.combat;
    if (sScript) {
        manager.runScript(sScript, {
            manager,
            creature,
            action,
            combat
        });
    }
}

module.exports = {
    init,
    combatTurn,
    damaged,
    attack,
    attacked
};
