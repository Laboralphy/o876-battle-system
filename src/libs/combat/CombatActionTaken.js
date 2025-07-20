/**
 * This class is used to trigger actions during combat
 */
class CombatActionTaken {
    /**
     *
     * @param creature {Creature}
     * @param action {string|RBSAction}
     * @param target {Creature|undefined}
     * @param parameters {object}
     */
    constructor ({ creature, action, target, ...parameters }) {
        this._creature = creature;
        this._target = target;
        this._parameters = parameters;
        this._action = typeof action === 'string'
            ? creature.getters.getActions[action]
            : action;
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

    get target () {
        return this._target;
    }

    get creature () {
        return this._creature;
    }
}

module.exports = CombatActionTaken;
