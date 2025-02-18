const Abstract = require('./ServiceAbstract');
const CONSTS = require('../consts');
const { checkConst } = require('../libs/check-const');
const Manager = require('../Manager');
const GenericEvent = require('../events/GenericEvent');


const PREFIXES = {
    ABILITY: 'ABILITY_',
    CAPABILITY: 'CAPABILITY_',
    CONDITION: 'CONDITION_',
};

class Core extends Abstract {
    constructor (services) {
        super(services);
        this._manager = new Manager();
        this._manager.systemInstance = this;
        GenericEvent.useBoxedObjects = true;
        this._events = this._manager.events;
        this._manager.combatManager.defaultDistance = 50;
        /**
         * @type {{[id: string]: RBSItem | Creature}}
         * @private
         */
        this._entities = {};
    }

    get events () {
        return this._events;
    }

    get PREFIXES () {
        return PREFIXES;
    }

    get CONSTS () {
        return CONSTS;
    }

    /**
     * @returns {Manager}
     */
    get manager () {
        return this._manager;
    }

    /**
     * Validate constant with prefix
     * @param sConstName {string}
     * @param sPrefix {string}
     * @returns {string}
     */
    checkConst (sConstName, sPrefix = '') {
        if (sPrefix !== '' && !sConstName.startsWith(sPrefix)) {
            throw new Error(`invalid value ${sConstName}. must start with ${sPrefix}`);
        }
        return checkConst(sConstName);
    }
}

module.exports = Core;
