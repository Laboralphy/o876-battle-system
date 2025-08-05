class LocationEnvironmentEntry {
    constructor (environment, duration = Infinity) {
        this._duration = duration;
        this._environment = environment;
        this._permanent = duration === Infinity;
        this._active = duration === 0;
    }

    decreaseDuration () {
        if (!this._permanent) {
            --this._duration;
        }
    }

    get permanent () {
        return this._permanent;
    }

    get expired () {
        return this._duration <= 0;
    }

    get environment () {
        return this._environment;
    }
}

module.exports = LocationEnvironmentEntry;
