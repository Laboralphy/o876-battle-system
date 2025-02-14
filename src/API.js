const Creatures = require('./sub-api/Creatures')
const Effects = require('./sub-api/Effects');
const Core = require("./sub-api/Core");

class API {
    constructor () {
        const services = {}
        Object.assign(services, {
            core: new Core(services),
            creatures: new Creatures(services),
            effects: new Effects(services)
        })
        this._services = services
    }

    get CONSTS () {
        return this._services.core.CONSTS
    }

}

module.exports = API
