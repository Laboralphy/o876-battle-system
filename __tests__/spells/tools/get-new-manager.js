const Manager = require('../../../src/Manager');

function getNewManager () {
    const m = new Manager();
    m.combatManager.defaultDistance = 50;
    m.loadModule('classic');
    m.loadModule('magic');
    m.initFactions();
    const c1 = m.createEntity('c-orc', 'orc1');
    const c2 = m.createEntity('c-orc', 'orc2');
    const c3 = m.createEntity('c-orc', 'orc3');
    m.horde.setCreatureFaction(c1, 'player');
    m.horde.setCreatureFaction(c2, 'hostile');
    m.horde.setCreatureFaction(c3, 'hostile');
    m.horde.setCreatureLocation(c1, 'r1');
    m.horde.setCreatureLocation(c2, 'r1');
    m.horde.setCreatureLocation(c3, 'r1');
    return {
        manager: m,
        creatures: {
            c1,
            c2,
            c3
        }
    };
}

module.exports = {
    getNewManager
};
