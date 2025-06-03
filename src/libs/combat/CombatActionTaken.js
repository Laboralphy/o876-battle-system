/**
 * This class is used to trigger actions during combat
 */
class CombatActionTaken {
    constructor ({ creature, action, target, ...parameters }) {
        this._creature = creature;
        this._target = target;
        this._parameters = parameters;
        this._action = creature.getters.getActions[action];
        if (!this._action) {
            throw new Error(`action "${action} is not defined for creature ${creature.id}.`);
        }
    }

    /**
     *
     * @returns {RBSAction}
     */
    get action () {
        return this._action;
    }

    get parameters () {
        return this._parameters;
    }
}

module.exports = CombatActionTaken;
