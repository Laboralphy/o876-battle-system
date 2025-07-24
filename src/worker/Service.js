const { parentPort } = require('worker_threads');
const { Manager } = require('../../index');

class Service {
    constructor () {
        /**
         * @type {Manager}
         * @private
         */
        this._manager = null;
        if (!parentPort) {
            throw new Error('parent port is not defined');
        }
        this._parentPort = parentPort;
        this._doomLoopId = 0;
    }

    /**
     * return instance of the message port
     * @returns {MessagePort}
     */
    get parentPort () {
        return this._parentPort;
    }

    /**
     * return instance of the manager
     * @returns {Manager}
     */
    get manager () {
        return this._manager;
    }

    /**
     * send back a response to parent port
     * @param requestId {string}
     * @param result {{}}
     */
    sendResponse (requestId,  result) {
        this.parentPort.postMessage({
            result,
            requestId
        });
    }

    defineHandlers () {
        this.parentPort.on('message', ({ requestId, opcode, request}) => {
            const sMeth = 'opcode' + opcode;
            if (sMeth in this) {
                const result = this[sMeth](requestId, request);
                this.sendResponse(requestId, result);
            }
        });
    }

    startDoomLoop () {
        this.stopDoomLoop();
        this._doomLoopId = setInterval(() => this._manager.process());
    }

    stopDoomLoop () {
        if (this._doomLoopId) {
            clearInterval(this._doomLoopId);
            this._doomLoopId = 0;
        }
    }

    _outcome (sError = false) {
        return { error: sError};
    }

    _success () {
        return this._outcome();
    }

    _error (sError) {
        return this._outcome(sError);
    }

    _getCreature (idCreature) {
        const oCreature = this._manager.getEntity(idCreature);
        this._manager.checkEntityCreature(oCreature);
        return oCreature;
    }


    //  ▄▄
    // ▐▌▝▘▗▛▜▖▐▛▜▖▗▛▜▖
    // ▐▌▗▖▐▌▐▌▐▌  ▐▛▀▘
    //  ▀▀  ▀▀ ▝▘   ▀▀

    /**
     * Starts a new Manager instance with configuration
     * @param modules {string[]}
     * @return {{}}
     */
    opcodeInit ({
        modules = []
    }) {
        this._manager = new Manager();
        for (const m of modules) {
            this._manager.loadModule(m);
        }
        this._manager.initFactions();
        this.startDoomLoop();
        return this._success();
    }

    /**
     * Shuts down current Manager instance
     * @returns {{error: boolean|string}}
     */
    opcodeShutdown () {
        this.stopDoomLoop();
        return this._success();
    }

    opcodeGetVersion () {
        return {
            version: this._manager.version
        };
    }



    // ▗▄▄▖     ▗▖  ▗▖  ▗▖  ▗▖
    // ▐▙▄ ▐▛▜▖▝▜▛▘ ▄▖ ▝▜▛▘ ▄▖ ▗▛▜▖▗▛▀▘
    // ▐▌  ▐▌▐▌ ▐▌  ▐▌  ▐▌  ▐▌ ▐▛▀▘ ▀▜▖
    // ▝▀▀▘▝▘▝▘  ▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▀▀

    opcodeCreateEntity ({ resref, id }) {
        const oEntity = this._manager.createEntity(resref, id);
        return { id: oEntity.id };
    }

    opcodeDestroyEntity({ creature }) {
        const oEntity = this._manager.getEntity(creature);
        this._manager.destroyEntity(oEntity);
        return { id: oEntity.id };
    }

    opcodeGetCreatureVitals ({ creature }) {
        const oCreature = this._getCreature(creature);
        const g = oCreature.getters;
        const abilities = g.getAbilities;
        const abilityBaseValues = g.getAbilityBaseValues;
        const abilityModifiers = g.getAbilityModifiers;
        return {
            level: g.getUnmodifiedLevel,
            classType: g.getClassType,
            specie: g.getSpecie,
            hitPoints: g.getHitPoints,
            maxHitPoints: g.getMaxHitPoints,
            armorClass: g.getArmorClass,
            conditions: [...g.getConditionSet],
            attackBonus: g.getAttackBonus,
            proficiencyBonus: g.getProficiencyBonus,
            proficiencies: [...g.getProficiencySet],
            abilities: Object.entries(abilities).map(([sAbility, nValue]) => ({
                base: abilityBaseValues[sAbility],
                value: nValue,
                modifier: abilityModifiers[sAbility]
            }))
        };
    }

    opcodeGetDistanceBetweenCreatures ({ creature1, creature2 }) {
        const oCreature1 = this._getCreature(creature1);
        const oCreature2 = this._getCreature(creature2);
        return { distance: this._manager.getCreatureDistance(oCreature1, oCreature2) };
    }

    // ▗▄▄▖         ▗▖  ▗▖
    // ▐▙▄  ▀▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▌  ▗▛▜▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘   ▀▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀
    // Factions

    opcodeGetCreatureFaction ({ creature }) {
        const oCreature = this._getCreature(creature);
        const oFaction = this._manager.getCreatureFaction(oCreature);
        return {
            faction: oFaction?.id ?? ''
        };
    }

    opcodeSetCreatureFaction ({ creature, faction }) {
        const oCreature = this._getCreature(creature);
        this._manager.setCreatureFaction(oCreature);
        return {
            faction
        };
    }

    opcodeGetCreatureLocation ({ creature }) {
        const oCreature = this._getCreature(creature);
        return {
            location: this._manager.horde.getCreatureLocation(oCreature)
        };
    }

    opcodeSetCreatureLocation ({ creature, location }) {
        const oCreature = this._getCreature(creature);
        this._manager.horde.setCreatureLocation(oCreature, location);
        return {
            location
        };
    }

    opcodeGetCreatureRoomOccupants ({ creature }) {
        const oCreature = this._getCreature(creature);
        return {
            allies: this._manager.getFriendlyCreatures(oCreature).map(c => c.id),
            hostile: this._manager.getHostileCreatures(oCreature).map(c => c.id)
        };
    }

    // ▗▄▄▖         ▄▖      ▗▖  ▗▖
    // ▐▙▄ ▐▌▐▌▗▛▜▖ ▐▌ ▐▌▐▌▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖
    // ▐▌  ▝▙▟▘▐▌▐▌ ▐▌ ▐▌▐▌ ▐▌  ▐▌ ▐▌▐▌▐▌▐▌
    // ▝▀▀▘ ▝▘  ▀▀  ▀▀  ▀▀▘  ▀▘ ▀▀  ▀▀ ▝▘▝▘
    // Evolution

    opcodeIncreaseCreatureXP ({ creature, xp }) {
        const oCreature = this._getCreature(creature);
        this._manager.increaseCreatureExperience(oCreature, xp);
        return {
            xp: this._manager.evolution.getXP(oCreature)
        };
    }

    //  ▄▄         ▗▖       ▗▖
    // ▐▌▝▘▗▛▜▖▐▙▟▙▐▙▄  ▀▜▖▝▜▛▘▗▛▀▘
    // ▐▌▗▖▐▌▐▌▐▛▛█▐▌▐▌▗▛▜▌ ▐▌  ▀▜▖
    //  ▀▀  ▀▀ ▝▘ ▀▝▀▀  ▀▀▘  ▀▘▝▀▀
    // Combats
}

function main() {
    const oService = new Service();
    oService.defineHandlers();
    return oService;
}

main();
