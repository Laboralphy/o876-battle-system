class ServiceAbstract {
    constructor () {
        this._services = null
    }

    get services () {
        return this._services
    }

    injectServices (services) {
        this._services = services
    }
}

module.exports = ServiceAbstract