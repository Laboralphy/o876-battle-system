const Manager = require('../src/Manager');
const CONSTS = require('../src/consts');

describe('Acid Splash', function () {
    it('should cast acid splash spell and deal 6 acid damage on unaware target', function () {
        const m = new Manager();
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            aLog.push(`creature ${evt.creature.id} damaged by ${evt.source.id}: ${evt.amount} ${evt.damageType}`);
        });
        m.events.on(CONSTS.EVENT_CREATURE_SAVING_THROW,
            /**
             *
             * @param evt {CreatureSavingThrowEvent}
             */
            (evt) => {
                aLog.push(`creature ${evt.creature.id} saving throw against ${evt.ability} roll ${evt.roll} vs. ${evt.dc}`);
            }
        );
        m.loadModule('classic');
        m.loadModule('magic');
        const c1 = m.createEntity('c-orc', 'orc1');
        const c2 = m.createEntity('c-orc', 'orc2');
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        const r = m.castSpell('acid-splash', c1, c2, { freeCast: true });
        expect(r.reason).toBe('');
        expect(r.success).toBeTruthy();
        expect(aLog).toEqual([
            'creature orc2 saving throw against ABILITY_DEXTERITY roll 3 vs. 10',
            'creature orc2 damaged by orc1: 6 DAMAGE_TYPE_ACID'
        ]);
    });
});
