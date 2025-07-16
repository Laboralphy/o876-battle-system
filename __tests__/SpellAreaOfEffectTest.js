const Manager = require('../src/Manager');
const { getAreaOfEffectTargets } = require('../src/libs/helpers');

const FACTIONS = [
    {
        id: 'player',
        relations: {
            hostile: -1
        }
    },
    {
        id: 'hostile',
        relations: {
            player: -1
        }
    }
];

function createWorld () {
    const m = new Manager();
    m.combatManager.defaultDistance = 50;
    m.loadModule('classic');
    const c1 = m.createEntity('c-goblin', 'c1');
    const c2 = m.createEntity('c-goblin', 'c2');
    const c3 = m.createEntity('c-goblin', 'c3');
    const c4 = m.createEntity('c-goblin', 'c4');
    const c5 = m.createEntity('c-goblin', 'c5');
    const c6 = m.createEntity('c-goblin', 'c6');
    m.horde.factionManager.defineFactions(FACTIONS);
    m.horde.setCreatureFaction(c1, 'player');
    m.horde.setCreatureFaction(c2, 'hostile');
    m.horde.setCreatureFaction(c3, 'hostile');
    m.horde.setCreatureFaction(c4, 'hostile');
    m.horde.setCreatureFaction(c5, 'hostile');
    m.horde.setCreatureFaction(c6, 'hostile');
    m.horde.setCreatureLocation(c1, 'r1');
    m.horde.setCreatureLocation(c2, 'r1');
    m.horde.setCreatureLocation(c3, 'r1');
    m.horde.setCreatureLocation(c4, 'r2');
    m.horde.setCreatureLocation(c5, 'r2');
    m.horde.setCreatureLocation(c6, 'r2');
    return {
        manager: m,
        creatures: {
            c1,
            c2,
            c3,
            c4,
            c5,
            c6
        }
    };
}

describe('getAreaOfEffectTargets', function () {
    it('should return [primaryTarget] when all target at are 50 and AoE range is at 30', function () {
        const { manager: m, creatures } = createWorld();
        const a1 = getAreaOfEffectTargets(m, creatures.c1, creatures.c2, 30);
        expect(a1.map(c => c.id)).toEqual(['c2']);
    });
    it('should return [primaryTarget, otherTargetinRoom] when all targets below range', function () {
        const { manager: m, creatures } = createWorld();
        const a1 = getAreaOfEffectTargets(m, creatures.c1, creatures.c2, 30);
        expect(a1.map(c => c.id)).toEqual(['c2']);
    });
});
