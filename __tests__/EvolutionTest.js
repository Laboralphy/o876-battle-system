const Evolution = require('../src/Evolution');
const Creature = require('../src/Creature');
const CONSTS = require('../src/consts');

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

const CLASS_TYPE_FIGHTER = {
    'evolution': {
        'levels': [
            {
                'level': 1,
                'feats': ['FEAT_FIGHTING_STYLE_DEFENSE', 'FEAT_SECOND_WIND']
            },
            {
                'level': 2,
                'feats': ['FEAT_ACTION_SURGE']
            },
            {
                'level': 3,
                'feats': ['FEAT_IMPROVED_CRITICAL']
            },
            {
                'level': 4,
                'abilityPoints': 2
            },
            {
                'level': 5,
                'feats': ['FEAT_EXTRA_ATTACK_1']
            },
            {
                'level': 6,
                'abilityPoints': 2
            },
            {
                'level': 7,
                'feats': ['FEAT_REMARKABLE_ATHLETE']
            },
            {
                'level': 8,
                'abilityPoints': 2
            },
            {
                'level': 9
            },
            {
                'level': 10,
                'feats': ['FEAT_FIGHTING_STYLE_ARCHERY']
            },
            {
                'level': 11,
                'feats': ['FEAT_EXTRA_ATTACK_2'],
                'removeFeats': ['FEAT_EXTRA_ATTACK_1']
            },
            {
                'level': 12,
                'abilityPoints': 2
            },
            {
                'level': 13
            },
            {
                'level': 14,
                'abilityPoints': 2
            },
            {
                'level': 15,
                'feats': ['FEAT_SUPERIOR_CRITICAL'],
                'removeFeats': ['FEAT_IMPROVED_CRITICAL']
            },
            {
                'level': 16,
                'abilityPoints': 2
            },
            {
                'level': 17,
                'feats': ['FEAT_ACTION_SURGE_2'],
                'removeFeats': ['FEAT_ACTION_SURGE']
            },
            {
                'level': 18,
                'feats': ['FEAT_SURVIVOR']
            },
            {
                'level': 19,
                'abilityPoints': 2
            },
            {
                'level': 20,
                'feats': ['FEAT_EXTRA_ATTACK_3'],
                'removeFeats': ['FEAT_EXTRA_ATTACK_2']
            }
        ]
    }
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

describe('getClassTypeEvolutionData', function () {
    it('should work 1', function () {
        const e = new Evolution({ data: { EXPERIENCE_LEVELS, CLASS_TYPES: { CLASS_TYPE_FIGHTER } } });
        const c = new Creature({ id: 'c1' });
        c.mutations.setClassType({ value: 'CLASS_TYPE_FIGHTER'});
        c.mutations.setLevel({ value: 1 });
        expect(e.getClassTypeEvolutionData('CLASS_TYPE_FIGHTER')).toEqual(CLASS_TYPE_FIGHTER.evolution);
    });
});

describe('getClassTypeEvolutionLevelData', function () {
    it('should work 1', function () {
        const e = new Evolution({ data: { EXPERIENCE_LEVELS, CLASS_TYPES: { CLASS_TYPE_FIGHTER } } });
        const c = new Creature({ id: 'c1' });
        c.mutations.setClassType({ value: 'CLASS_TYPE_FIGHTER'});
        c.mutations.setLevel({ value: 1 });
        expect(e.getClassTypeEvolutionLevelData('CLASS_TYPE_FIGHTER', 1)).toEqual(CLASS_TYPE_FIGHTER.evolution.levels[0]);
        expect(e.getClassTypeEvolutionLevelData('CLASS_TYPE_FIGHTER', 3)).toEqual(CLASS_TYPE_FIGHTER.evolution.levels[2]);
    });
});

describe('gainXP', function () {
    it('should fire creature level up event when creature level 0 gains 300 xp', function () {
        const e = new Evolution({ data: { EXPERIENCE_LEVELS, CLASS_TYPES: { CLASS_TYPE_FIGHTER } } });
        const c = new Creature({ id: 'c1' });
        c.mutations.setClassType({ value: 'CLASS_TYPE_FIGHTER'});
        c.mutations.setLevel({ value: 1 });
        const aLogs = [];
        c.events.on(CONSTS.EVENT_CREATURE_LEVEL_UP, ({ creature, feats, abilityPoints }) => {
            aLogs.push({
                creature: creature.id,
                feats,
                abilityPoints
            });
        });
        expect(c.getters.getPoolValues[CONSTS.POOL_EXPERIENCE_POINTS]).toBe(0);
        expect(c.getters.getUnmodifiedLevel).toBe(1);
        e.gainXP(c, 300);
        expect(aLogs).toHaveLength(1);
        expect(aLogs[0]).toEqual({
            creature: 'c1',
            feats: {
                added: ['FEAT_ACTION_SURGE'],
                removed: []
            },
            abilityPoints: 0
        });
        expect(c.getters.getPoolValues[CONSTS.POOL_EXPERIENCE_POINTS]).toBe(300);
        e.gainXP(c, 300);
        expect(c.getters.getPoolValues[CONSTS.POOL_EXPERIENCE_POINTS]).toBe(600);
        expect(aLogs).toHaveLength(1);
        e.gainXP(c, 300);
        expect(c.getters.getPoolValues[CONSTS.POOL_EXPERIENCE_POINTS]).toBe(900);
        expect(aLogs).toHaveLength(2);
        expect(aLogs[1]).toEqual({
            creature: 'c1',
            feats: {
                added: ['FEAT_IMPROVED_CRITICAL'],
                removed: []
            },
            abilityPoints: 0
        });
    });
});
