const ServiceAbstract = require('./ServiceAbstract')

class Combats extends ServiceAbstract {
    constructor () {
        super()
    }

    getCombatAttacker (idCombat) {
        const oCombat = this.services.manager.combatManager.combatRegistry[idCombat]
        if (oCombat) {
            return oCombat.attacker.id
        }
    }
}