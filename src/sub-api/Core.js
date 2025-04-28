const Abstract = require('./ServiceAbstract');
const CONSTS = require('../consts');
const { checkConst } = require('../libs/check-const');
const Manager = require('../Manager');
const GenericEvent = require('../events/GenericEvent');


const PREFIXES = {
    ABILITY: 'ABILITY',
    CAPABILITY: 'CAPABILITY',
    CONDITION: 'CONDITION',
    EFFECT: 'EFFECT',
    PROPERTY: 'PROPERTY',
    EQUIPMENT_SLOT: 'EQUIPMENT_SLOT'
};

class Core extends Abstract {
    constructor (services) {
        super(services);
        this._manager = new Manager();
        this._manager.systemInstance = this;
        GenericEvent.useObjectBoxing = true;
        this._events = this._manager.events;
        this._manager.combatManager.defaultDistance = 50;
    }

    get events () {
        return this._events;
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

    process () {
        this._manager.process();
    }

    /**
     * Validate constant with prefix
     * @param sConstName {string}
     * @param sPrefix {string}
     * @returns {string}
     */
    checkConst (sConstName, sPrefix = '') {
        if (sPrefix !== '' && !sConstName.startsWith(sPrefix + '_')) {
            throw new Error(`invalid value ${sConstName}. must start with ${sPrefix}`);
        }
        return checkConst(sConstName);
    }

    checkConstAbility (sConstName) {
        return this.checkConst(sConstName, PREFIXES.ABILITY);
    }

    checkConstCapability (sConstName) {
        return this.checkConst(sConstName, PREFIXES.CAPABILITY);
    }

    checkConstCondition (sConstName) {
        return this.checkConst(sConstName, PREFIXES.CONDITION);
    }

    checkConstEffect (sConstName) {
        return this.checkConst(sConstName, PREFIXES.EFFECT);
    }

    checkConstProperty (sConstName) {
        return this.checkConst(sConstName, PREFIXES.PROPERTY);
    }

    checkConstEquipmentSlot (sConstName) {
        return this.checkConst(sConstName, PREFIXES.EQUIPMENT_SLOT);
    }
}

module.exports = Core;
