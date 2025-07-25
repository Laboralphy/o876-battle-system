const { parentPort } = require('worker_threads');
const Service = require('./Service');

function main() {
    const oService = new Service(parentPort);
    oService.defineHandlers();
    return oService;
}

main();
