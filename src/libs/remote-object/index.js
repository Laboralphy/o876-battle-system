const { Worker } = require('node:worker_threads')

class RemoteObject {
    constructor(workerScript) {
        this._worker = new Worker(workerScript)
        this._promises = new Map()
        this._requestId = 0

        this._worker.on('message', ({ id, result, error }) => {
            if (this._promises.has(id)) {
                if (error) {
                    this._promises.get(id).reject(new Error(error));
                }
                else this._promises.get(id).resolve(result)
                this._promises.delete(id)
            }
        });

        return new Proxy(this, {
            get: (target, prop) => (...args) => {
                return new Promise((resolve, reject) => {
                    const id = ++target._requestId
                    target._promises.set(id, { resolve, reject })
                    target._worker.postMessage({ id, method: prop, args })
                })
            }
        })
    }
}

module.exports = RemoteObject