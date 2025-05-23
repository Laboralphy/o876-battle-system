const SmartData = require('./index');

describe('test1', function () {
    it('should instanciate without error', function () {
        const s = new SmartData();
        const aCodes = s.compile({
            c1: 'c.name=value',
            c2: 'c.age=value|0'
        });
        const oContext = s.createContext();
        s.runRow(['ifrit', 10000], aCodes, oContext);
        expect(oContext.c).toEqual({
            name: 'ifrit',
            age: 10000
        });
    });

    it('should create a array of struct when using kv', function () {
        const s = new SmartData();
        const o = s.run([
            ['name', 'actions', 'param', 'value'],
            ['c={ actions: [], name: value }', 'c.actions.push({ opcode: value, data: {} })', '', 'kv(last(c.actions).data)'],
            ['', '', '', ''],
            ['atk', 'damage',   'damageType', 'fire'],
            [   '',       '', 'amount', '3d6']
        ]);
        expect(o).toEqual({'': { name: 'atk', actions:[{ opcode: 'damage', data: { damageType: 'fire', amount: '3d6' } }] }});
    });
});

describe('searchConst', function () {
    it('should return weapon_size_medium when searching for medium, with radix weapon_size', function () {
        const s = new SmartData({
            data: {
                CREATURE_SIZE_MEDIUM: 'CREATURE_SIZE_MEDIUM',
                WEAPON_SIZE_MEDIUM: 'WEAPON_SIZE_MEDIUM'
            }
        });
        expect(s.searchConst('medium', 'weapon_size')).toBe('WEAPON_SIZE_MEDIUM');
        expect(s.searchConst('medium', 'creature_size')).toBe('CREATURE_SIZE_MEDIUM');
    });
});
