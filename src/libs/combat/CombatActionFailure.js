const CombatActionOutcome = require('./CombatActionOutcome');

class CombatActionFailure extends CombatActionOutcome {
    constructor (reason) {
        super({
            success: false,
            reason
        });
    }
}

module.exports = CombatActionFailure;
