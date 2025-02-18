const ServiceAbstract = require('./ServiceAbstract')
const BoxedCreature = require('./classes/BoxedCreature')

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

    getCreatureCombat (oCreature) {
        return this
            .services
            .core
            .manager
            .combatManager
            .getCombat(oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT])
    }

    getCreatureOffenders (oCreature, nRange = Infinity) {
        return this
            .services
            .core
            .manager
            .combatManager
            .getOffenders(oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT], nRange)
            .map((c) => new BoxedCreature(c))
    }

    approachTarget (oCreature, nSpeed = undefined) {
        const oCombat = this.getCreatureCombat(oCreature)
        if (oCombat) {
            oCombat.approachTarget(nSpeed)
        }
    }

    retreatFromTarget (oCreature, nSpeed = undefined) {
        const oCombat = this.getCreatureCombat(oCreature)
        if (oCombat) {
            oCombat.retreatFromTarget(nSpeed)
        }
    }

    selectAction (oCreature, idAction) {
        const oCombat = this.getCreatureCombat(oCreature)
        if (oCombat) {
            oCombat.selectCurrentAction(idAction)
        }
    }

    startCombat (oCreature, oTarget) {
        this
            .services
            .core
            .manager
            .combatManager
            .startCombat(
                oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT],
                oTarget[BoxedCreature.SYMBOL_BOXED_OBJECT]
            )
    }

    endCombat  (oAttacker, bBothSide = false) {
        const cm = this.services.core.manager.combatManager
        cm.endCombat(oAttacker[BoxedCreature.SYMBOL_BOXED_OBJECT], bBothSide)
    }
}

module.exports = Combats