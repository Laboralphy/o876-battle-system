const CombatActionOutcome = require('./CombatActionOutcome');

class CombatActionSuccess extends CombatActionOutcome {
    constructor () {
        super({
            success: true,
            reason: ''
        });
    }
}

module.exports = CombatActionSuccess;
