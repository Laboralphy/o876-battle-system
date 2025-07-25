const Manager = require('../../Manager');

function getNewManager (sCreature = 'c-orc', sFoes = 'c-orc') {
    const m = new Manager();
    m.combatManager.defaultDistance = 50;
    m.loadModule('classic');
    m.loadModule('magic');
    m.initFactions();
    const c1 = m.createEntity(sCreature, 'c1');
    const c2 = m.createEntity(sFoes, 'c2');
    const c3 = m.createEntity(sFoes, 'c3');
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
