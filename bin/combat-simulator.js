const CombatSimulator = require('../src/libs/combat/CombatSimulator');

function getArgv () {
    return process.argv.slice(2);
}

function main () {
    const argv = getArgv();
    const cs = new CombatSimulator();
    cs.events.on('output', ({ output }) => console.log(...output));
    cs.playCombat(argv[0], argv[1]);
}

main();
