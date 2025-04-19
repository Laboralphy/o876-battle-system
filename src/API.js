const Creatures = require('./sub-api/Creatures');
const Effects = require('./sub-api/Effects');
const Core = require('./sub-api/Core');
const Items = require('./sub-api/Items');
const Combats = require('./sub-api/Combats');
const Entities = require('./sub-api/Entities');

class API {
    constructor () {
        const services = {
            core: new Core(),
            creatures: new Creatures(),
            effects: new Effects(),
            items: new Items(),
            combats: new Combats(),
            entities: new Entities()
        };
        Object
            .entries(services)
            .forEach(([idService, service]) => {
                try {
                    service.injectServices(services);
                } catch (e) {
                    console.error(`while iterating over ${idService}...`);
                    throw e;
                }
            });
        this._services = services;
    }

    /**
     * Returns all services
     * @returns {{core: Core, creatures: Creatures, effects: Effects, items: Items, combats: Combats, entities: Entities}}
     */
    get services () {
        return this._services;
    }
}

module.exports = API;
