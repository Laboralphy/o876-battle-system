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
        GenericEvent.objectBoxingFactory = (oEntity) => {
            const bo = this.services.entities.getEntityById(oEntity.id);
            if (bo) {
                return bo;
            } else {
                return null;
            }
        };
        this._events = this._manager.events;
        this._manager.combatManager.defaultDistance = 50;
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

    loadModule (sModule) {
        this._manager.loadModule(sModule);
    }

    defineModule (oModule) {
        this._manager.defineModule(oModule);
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
