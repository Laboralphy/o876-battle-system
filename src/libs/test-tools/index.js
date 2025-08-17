const Manager = require('../../Manager');

function getNewManager ({ friends = [], foes = []}) {
    const m = new Manager();
    m.combatManager.defaultDistance = 50;
    m.loadModule('classic');
    m.loadModule('magic');
    m.initFactions();
    let cid = 0;

    const createCreature = (resref, sFaction) => {
        const nId = ++cid;
        const sId = 'c' + nId.toString();
        const c = m.createEntity(resref, sId);
        m.horde.setCreatureFaction(c, sFaction);
        m.horde.setCreatureLocation(c, 'r1');
        return c;
    };

    const aFriends = friends.map(f => createCreature(f, 'player'));
    const aFoes = foes.map(f => createCreature(f, 'hostile'));

    const oFriends = Object.fromEntries(
        aFriends.map(f => [f.id, f])
    );
    const oFoes = Object.fromEntries(
        aFoes.map(f => [f.id, f])
    );

    return {
        manager: m,
        creatures: {
            ...oFriends,
            ...oFoes
        },
        friends: oFriends,
        foes: oFoes
    };
}

module.exports = {
    getNewManager
};
