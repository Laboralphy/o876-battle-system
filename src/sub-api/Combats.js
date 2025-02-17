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

    getCreatureCombat (idCreature) {
        const oCreature = this.services.creatures.getCreature(idCreature)
        const cm = this.services.core.manager.combatManager
        if (cm.isCreatureFighting(oCreature)) {
            return cm.getCombat(oCreature)
        } else {
            return null
        }
    }

    getCreatureOffenders (idCreature, nRange = Infinity) {
        const oCreature = this.services.creatures.getCreature(idCreature)
        const cm = this.services.core.manager.combatManager
        return cm.getOffenders(oCreature, nRange).map((c) => c.id)
    }

    approachTarget (idCreature, nSpeed = undefined) {
        const oCombat = this.getCreatureCombat(idCreature)
        if (oCombat) {
            oCombat.approachTarget(nSpeed)
        }
    }

    retreatFromTarget (idCreature, nSpeed = undefined) {
        const oCombat = this.getCreatureCombat(idCreature)
        if (oCombat) {
            oCombat.retreatFromTarget(nSpeed)
        }
    }

    selectAction (idCreature, idAction) {
        const oCombat = this.getCreatureCombat(idCreature)
        if (oCombat) {
            oCombat.selectCurrentAction(idAction)
        }
    }

    startCombat  (idAttacker, idTarget) {
        const cm = this.services.core.manager.combatManager
        const oAttacker = this.services.creatures.getCreature(idAttacker)
        const oTarget = this.services.creatures.getCreature(idTarget)
        cm.startCombat(oAttacker, oTarget)
    }

    endCombat  (idAttacker, idTarget, bBothSide = false) {
        const cm = this.services.core.manager.combatManager
        const oAttacker = this.services.creatures.getCreature(idAttacker)
        cm.endCombat(oAttacker, bBothSide)
    }
}

module.exports = Combats