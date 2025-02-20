const ServiceAbstract = require('./ServiceAbstract');
const BoxedCreature = require('./classes/BoxedCreature');

class Combats extends ServiceAbstract {
    constructor () {
        super();
    }

    /**
     * @param oCreature {BoxedCreature}
     * @returns {Combat|null}
     */
    getCreatureCombat (oCreature) {
        return this
            .services
            .core
            .manager
            .combatManager
            .getCombat(oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT]);
    }

    /**
     * Returns a list of creatures currently having specified creature as target during a combat
     * This can be limited in a specified range (defaul : infinity)
     * @param oCreature {BoxedCreature} Creature being attacked
     * @param [nRange] {number} maximum range considered (default infinity)
     * @returns {BoxedCreature[]} all creature attacking the specified creature
     */
    getCreatureOffenders (oCreature, nRange = Infinity) {
        return this
            .services
            .core
            .manager
            .combatManager
            .getOffenders(oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT], nRange)
            .map((c) => new BoxedCreature(c));
    }

    /**
     * Makes a creature approaching it's target by a certain distance
     * @param oCreature {BoxedCreature}
     * @param [nSpeed] {number} number of units of displacement toward target (default is creature speed)
     */
    approachTarget (oCreature, nSpeed = undefined) {
        const oCombat = this.getCreatureCombat(oCreature);
        if (oCombat) {
            oCombat.approachTarget(nSpeed);
        }
    }

    /**
     * Sames as approach but retreat from target instead of approaching
     * @param oCreature {BoxedCreature}
     * @param [nSpeed] {number} default is creature natural speed
     */
    retreatFromTarget (oCreature, nSpeed = undefined) {
        const oCombat = this.getCreatureCombat(oCreature);
        if (oCombat) {
            oCombat.retreatFromTarget(nSpeed);
        }
    }

    /**
     * Selects a new action during fight. After the action finished, creature goes back to weapon fighting
     * @param oCreature {BoxedCreature}
     * @param idAction {string}
     */
    selectAction (oCreature, idAction) {
        const oCombat = this.getCreatureCombat(oCreature);
        if (oCombat) {
            oCombat.selectCurrentAction(idAction);
        }
    }

    /**
     * Makes a creature starts a fighting with another creature
     * @param oCreature {BoxedCreature}
     * @param oTarget {BoxedCreature}
     */
    startCombat (oCreature, oTarget) {
        this
            .services
            .core
            .manager
            .combatManager
            .startCombat(
                oCreature[BoxedCreature.SYMBOL_BOXED_OBJECT],
                oTarget[BoxedCreature.SYMBOL_BOXED_OBJECT]
            );
    }

    /**
     *
     * @param oAttacker {BoxedCreature}
     * @param bBothSide {boolean}
     */
    endCombat  (oAttacker, bBothSide = false) {
        const cm = this.services.core.manager.combatManager;
        cm.endCombat(oAttacker[BoxedCreature.SYMBOL_BOXED_OBJECT], bBothSide);
    }
}

module.exports = Combats;
