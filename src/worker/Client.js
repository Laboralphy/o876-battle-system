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

    init ({ modules = [] }) {
        this._worker = new Worker(path.resolve(__dirname, 'Service.js'));
        return this.transaction(MESSAGE_OPCODES.OPCODE_INIT, {
            modules
        });
    }

    async shutdown() {
        await this.transaction(MESSAGE_OPCODES.OPCODE_SHUTDOWN, {});
        return this._worker.terminate();
    }

    getVersion () {
        return this.transaction(MESSAGE_OPCODES.OPCODE_GET_VERSION);
    }



    // ▗▄▄▖     ▗▖  ▗▖  ▗▖  ▗▖
    // ▐▙▄ ▐▛▜▖▝▜▛▘ ▄▖ ▝▜▛▘ ▄▖ ▗▛▜▖▗▛▀▘
    // ▐▌  ▐▌▐▌ ▐▌  ▐▌  ▐▌  ▐▌ ▐▛▀▘ ▀▜▖
    // ▝▀▀▘▝▘▝▘  ▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▀▀

    /**
     * @see Manager.createEntity()
     * @param resref {string}
     * @param id {string}
     * @returns {Promise<unknown>}
     */
    createEntity (resref, id = '') {
        return this.transaction(MESSAGE_OPCODES.OPCODE_CREATE_ENTITY, { resref, id });
    }

    /**
     * Destroys an entity
     * @param id {string}
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

    // ▗▄▄▖         ▄▖      ▗▖  ▗▖
    // ▐▙▄ ▐▌▐▌▗▛▜▖ ▐▌ ▐▌▐▌▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖
    // ▐▌  ▝▙▟▘▐▌▐▌ ▐▌ ▐▌▐▌ ▐▌  ▐▌ ▐▌▐▌▐▌▐▌
    // ▝▀▀▘ ▝▘  ▀▀  ▀▀  ▀▀▘  ▀▘ ▀▀  ▀▀ ▝▘▝▘
    // Evolution

    increaseCreatureXP (id, xp) {
        return this.transaction(MESSAGE_OPCODES.OPCODE_INCREASE_CREATURE_XP, { creature: id, xp });
    }
}

module.exports = Client;
