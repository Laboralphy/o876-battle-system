const path = require('node:path');
const { Worker } = require('worker_threads');
const { getUniqueId } = require('../libs/unique-id');
const MESSAGE_OPCODES = require('./message-opcodes.json');

class Client {
    constructor () {
    }

    /**
     * @typedef Request {object}
     * @property requestId {string}
     * @property opcode {string}
     * @property request {{}}
     *
     * @param opcode
     * @param request
     * @returns {Promise<{}>}
     */
    transaction (opcode, request) {
        const requestId = getUniqueId();
        return new Promise((resolve, reject) => {
            const messageHandler = (message) => {
                if (message.requestId === requestId) {
                    this._worker.off('message', messageHandler);
                    resolve(message.result);
                }
            };
            this._worker.on('message', messageHandler);

            // Sends message to worker
            this._worker.postMessage({ requestId, opcode, request });

            // When error occurs
            this._worker.on('error', (error) => {
                this._worker.off('message', messageHandler);
                reject(error);
            });
        });
    }

    //  ▄▄
    // ▐▌▝▘▗▛▜▖▐▛▜▖▗▛▜▖
    // ▐▌▗▖▐▌▐▌▐▌  ▐▛▀▘
    //  ▀▀  ▀▀ ▝▘   ▀▀

    /**
     * Initialize manager worker and start doom loop
     * @param modules {string[]} list of modules to load
     * @returns {Promise<unknown>}
     */
    init ({ modules = [] }) {
        this._worker = new Worker(path.resolve(__dirname, 'worker.js'));
        return this.transaction(MESSAGE_OPCODES.OPCODE_INIT, {
            modules
        });
    }

    /**
     * Stop doom loop and unload manager worker
     * @returns {Promise<number>}
     */
    async shutdown() {
        await this.transaction(MESSAGE_OPCODES.OPCODE_SHUTDOWN, {});
        return this._worker.terminate();
    }

    /**
     * Returns manager version
     * @returns {Promise<{ version: string }>}
     */
    getVersion () {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_VERSION);
    }



    // ▗▄▄▖     ▗▖  ▗▖  ▗▖  ▗▖
    // ▐▙▄ ▐▛▜▖▝▜▛▘ ▄▖ ▝▜▛▘ ▄▖ ▗▛▜▖▗▛▀▘
    // ▐▌  ▐▌▐▌ ▐▌  ▐▌  ▐▌  ▐▌ ▐▛▀▘ ▀▜▖
    // ▝▀▀▘▝▘▝▘  ▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▀▀

    /**
     * Create a new entity
     * @see Manager.createEntity()
     * @param resref {string} reference of blueprint
     * @param id {string} identifier of new entity
     * @returns {Promise<unknown>}
     */
    createEntity (resref, id = '') {
        return this.transaction(MESSAGE_OPCODES.OPCODE_CREATE_ENTITY, { resref, id });
    }

    /**
     * Destroys an entity
     * @param id {string} identifier of entity to destroy
     * @returns {Promise<unknown>}
     */
    destroyEntity (id) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_DESTROY_ENTITY, { creature: id });
    }

    /**
     * Returns all vitals from a creature
     * @param id {string}
     * @returns {Promise<unknown>}
     */
    getCreatureVitals (id) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_CREATURE_VITALS, { creature: id });
    }

    /**
     * Return distance between two creatures
     * @param id1 {string}
     * @param id2 {string}
     * @returns {Promise<unknown>}
     */
    getDistanceBetweenCreatures (id1, id2) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_DISTANCE_BETWEEN_CREATURES, {
            creature1: id1, creature2: id2
        });
    }

    /**
     * Returns an item's statistics
     * @param id {string}
     */
    getItemData (id) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_ITEM_DATA, {
            item: id
        });
    }

    // ▗▄▄▖         ▗▖  ▗▖
    // ▐▙▄  ▀▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▌  ▗▛▜▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘   ▀▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀
    // Factions

    getCreatureFaction (id) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_CREATURE_FACTION, { creature: id });
    }

    setCreatureFaction (id, faction) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_SET_CREATURE_FACTION, { creature: id, faction });
    }

    getCreatureLocation (id) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_CREATURE_LOCATION, { creature: id });
    }

    setCreatureLocation (id, location) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_SET_CREATURE_FACTION, { creature: id, location });
    }

    getCreatureRoomOccupants (id) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_CREATURE_LOCATION_OCCUPANTS, { creature: id });
    }

    // ▗▄▄▖         ▗▖                          ▗▖
    // ▐▙▄ ▐▛▜▖▐▌▐▌ ▄▖ ▐▛▜▖▗▛▜▖▐▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘▗▛▀▘
    // ▐▌  ▐▌▐▌▝▙▟▘ ▐▌ ▐▌  ▐▌▐▌▐▌▐▌▐▛▛█▐▛▀▘▐▌▐▌ ▐▌  ▀▜▖
    // ▝▀▀▘▝▘▝▘ ▝▘  ▀▀ ▝▘   ▀▀ ▝▘▝▘▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘▝▀▀

    setLocationEnvironments (idLocation, aEnvironments) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_SET_LOCATION_ENVIRONMENTS, {
            location: idLocation,
            environments: aEnvironments
        });
    }

    // ▗▄▄▖         ▄▖      ▗▖  ▗▖
    // ▐▙▄ ▐▌▐▌▗▛▜▖ ▐▌ ▐▌▐▌▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖
    // ▐▌  ▝▙▟▘▐▌▐▌ ▐▌ ▐▌▐▌ ▐▌  ▐▌ ▐▌▐▌▐▌▐▌
    // ▝▀▀▘ ▝▘  ▀▀  ▀▀  ▀▀▘  ▀▘ ▀▀  ▀▀ ▝▘▝▘
    // Evolution

    increaseCreatureXP (id, xp) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_INCREASE_CREATURE_XP, { creature: id, xp });
    }

    //  ▄▄         ▗▖       ▗▖
    // ▐▌▝▘▗▛▜▖▐▙▟▙▐▙▄  ▀▜▖▝▜▛▘▗▛▀▘
    // ▐▌▗▖▐▌▐▌▐▛▛█▐▌▐▌▗▛▜▌ ▐▌  ▀▜▖
    //  ▀▀  ▀▀ ▝▘ ▀▝▀▀  ▀▀▘  ▀▘▝▀▀
    // Combats

    startCombat (idAttacker, idTarget) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_START_COMBAT, { attacker: idAttacker, target: idTarget });
    }

    endCombat (idAttacker, bothSides = false) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_END_COMBAT, { attacker: idAttacker, bothSides });
    }

    getCombatInfo (idAttacker) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_COMBAT_INFO, { attacker: idAttacker });
    }

    combatApproach (idAttacker) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_COMBAT_APPROACH, { attacker: idAttacker });
    }

    combatRetreat (idAttacker) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_COMBAT_RETREAT, { attacker: idAttacker });
    }


    //  ▗▖      ▗▖  ▗▖
    // ▗▛▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▙▟▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘▝▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀

    doAction (idCreature, idAction, idTarget = '', {
        freeCast = false,
        item = null,
        power = 0,
        additionalTargets = []
    }) {
        return this.transaction(
            MESSAGE_OPCODES.OPCODE_DO_ACTION, {
                creature: idCreature,
                target: idTarget,
                action: idAction,
                freeCast,
                item,
                power,
                additionalTargets
            });
    }

    // ▗▖ ▄         ▗▖          ▟▜▖     ▄▄          ▄▖  ▄▖                  ▗▖  ▗▖
    // ▐█▟█ ▀▜▖▗▛▜▌ ▄▖ ▗▛▀      ▟▛     ▝▙▄ ▐▛▜▖▗▛▜▖ ▐▌  ▐▌     ▗▛▀  ▀▜▖▗▛▀▘▝▜▛▘ ▄▖ ▐▛▜▖▗▛▜▌
    // ▐▌▘█▗▛▜▌▝▙▟▌ ▐▌ ▐▌      ▐▌▜▛      ▐▌▐▙▟▘▐▛▀▘ ▐▌  ▐▌     ▐▌  ▗▛▜▌ ▀▜▖ ▐▌  ▐▌ ▐▌▐▌▝▙▟▌
    // ▝▘ ▀ ▀▀▘▗▄▟▘ ▀▀  ▀▀      ▀▘▀     ▀▀ ▐▌   ▀▀  ▀▀  ▀▀      ▀▀  ▀▀▘▝▀▀   ▀▘ ▀▀ ▝▘▝▘▗▄▟▘

    getSpellData (idSpell) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_SPELL_DATA, { spell: idSpell });
    }

    // ▗▄▄▖ ▗▖                  ▟▜▖                 ▗▖                  ▗▖
    //  ▐▌ ▝▜▛▘▗▛▜▖▐▙▟▙▗▛▀▘     ▟▛     ▗▛▜▖▗▛▜▌▐▌▐▌ ▄▖ ▐▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    //  ▐▌  ▐▌ ▐▛▀▘▐▛▛█ ▀▜▖    ▐▌▜▛    ▐▛▀▘▝▙▟▌▐▌▐▌ ▐▌ ▐▙▟▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘  ▀▘ ▀▀ ▝▘ ▀▝▀▀      ▀▘▀     ▀▀   ▐▌ ▀▀▘ ▀▀ ▐▌  ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘

    useItem (idCreature, idItem, idTarget = '') {
        return this.transaction(MESSAGE_OPCODES.OPCODE_CAST_SPELL, { creature: idCreature, target: idTarget, item: idItem });
    }

    equipItem (idCreature, idItem, bypassCurse = false) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_EQUIP_ITEM, { creature: idCreature, item: idItem, bypassCurse });
    }

    unequipItem (idCreature, idItem, bypassCurse = false) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_UNEQUIP_ITEM, { creature: idCreature, item: idItem, bypassCurse });
    }
}

module.exports = Client;
