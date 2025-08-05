const CONSTS = require('../../consts');
const LocationEnvironmentEntry = require('./LocationEnvironmentEntry');

class LocationEnvironmentRegistry {
    constructor () {
        this._registry = new Map();
    }

    initLocation (idLocation) {
        this._registry.set(idLocation, {
            [CONSTS.ENVIRONMENT_DARKNESS]: new LocationEnvironmentEntry(CONSTS.ENVIRONMENT_DARKNESS)
        });
    }
}
