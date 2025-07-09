class CombatActionOutcome {
    constructor ({ success, reason = '' }) {
        this._success = success;
        this._reason = reason;
    }

    get success () {
        return this._success;
    }

    get failure () {
        return !this._success;
    }

    /**
     * @returns {string}
     */
    get reason () {
        return this._reason;
    }
}

module.exports = CombatActionOutcome;
