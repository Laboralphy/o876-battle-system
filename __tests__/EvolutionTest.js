const Evolution = require('../src/Evolution');

const EXPERIENCE_LEVELS = {
    'table': [
        0,
        300,
        900,
        2700,
        6500,
        14000,
        23000,
        34000,
        48000,
        64000,
        85000,
        100000,
        120000,
        140000,
        165000,
        195000,
        225000,
        265000,
        305000,
        355000
    ]
};

describe('getLevelByXP', function () {
    it('should return level 1 when asking for xp 0', function () {
        const e = new Evolution({ data: { EXPERIENCE_LEVELS }});
        expect(e.getLevelFromXP(0)).toBe(1);
    });
    it('should return level 1 when asking for xp 299', function () {
        const e = new Evolution({ data: { EXPERIENCE_LEVELS }});
        expect(e.getLevelFromXP(299)).toBe(1);
    });
    it('should return level 2 when asking for xp 300', function () {
        const e = new Evolution({ data: { EXPERIENCE_LEVELS }});
        expect(e.getLevelFromXP(300)).toBe(2);
    });
    it('should return level 20 when asking for xp 1000000000000', function () {
        const e = new Evolution({ data: { EXPERIENCE_LEVELS }});
        expect(e.getLevelFromXP(1000000000000)).toBe(20);
    });
});
