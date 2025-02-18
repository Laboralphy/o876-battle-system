const Creatures = require('./sub-api/Creatures');
const Effects = require('./sub-api/Effects');
const Core = require('./sub-api/Core');
const Properties = require('./sub-api/Properties');
const Items = require('./sub-api/Items');

class API {
    constructor () {
        const services = {
            core: new Core(),
            creatures: new Creatures(),
            effects: new Effects(),
            items: new Items(),
            properties: new Properties(),
        };
        Object
            .keys(services)
            .forEach(service => service.injectServices(services));
        this._services = services;
    }

    get services () {
        return this._services;
    }
}

module.exports = API;
