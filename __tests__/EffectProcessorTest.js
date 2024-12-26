const EffectProcessor = require('../src/EffectProcessor')
const Horde = require('../src/Horde')
const Creature = require('../src/Creature')


describe('invokeEffectMethod', function () {
    it("should push 'method1 called' in log when invoking method1", function () {
        const h = new Horde()
        const ep = new EffectProcessor({ horde: h })
        const logs = []
        ep.effectPrograms = {
            EFFECT_TEST: {
                method1: function ({ effect }) {
                    logs.push('method1 called')
                }
            }
        }
        const effect = ep.createEffect('EFFECT_TEST')
        ep.invokeEffectMethod(effect, 'method1', {}, {})
        expect(logs).toEqual(['method1 called'])
    })
})

describe('createEffect', function () {
    it('should create an effect', function () {
        const h = new Horde()
        const ep = new EffectProcessor({ horde: h })
        const logs = []
        ep.effectPrograms = {
            EFFECT_TEST: {
                init: function ({ effect }) {
                    logs.push('init effect test')
                }
            }
        }
        const eff1 = ep.createEffect('EFFECT_TEST')
        expect(logs).toEqual(['init effect test'])
        expect(eff1).toHaveProperty('type', 'EFFECT_TEST')
        expect(eff1).toHaveProperty('amp', 0)
        expect(eff1).toHaveProperty('target')
        expect(eff1).toHaveProperty('source')
        expect(eff1).toHaveProperty('data', {})
    })
    it('should throw an error when effect is invalid', function () {
        const h = new Horde()
        const ep = new EffectProcessor({ horde: h })
        ep.effectPrograms = {
            EFFECT_TEST: {
                init: function ({ effect }) {
                    logs.push('init effect test')
                }
            }
        }
        expect(() => {
            const eff1 = ep.createEffect('EFFECT_TOAST')
        }).toThrow(new Error('Effect EFFECT_TOAST is invalid'))
    })
})

describe('applyEffect', function () {
    it('should apply effect when duration is 10', function () {
        const h = new Horde()
        const ep = new EffectProcessor({ horde: h })
        const logs = []
        ep.effectPrograms = {
            EFFECT_TEST: {
                init: function ({ effect }) {
                    logs.push('init effect test')
                }
            }
        }
        ep.events.on('effect-applied', ({ effect, source, target }) => {
            logs.push('effect applied - type:' + effect.type + ' target:' + target.id + ' source:' + source.id)
        })
        const eff1 = ep.createEffect('EFFECT_TEST')
        const c1 = new Creature({ id: 'c1' })
        ep.applyEffect(eff1, c1, 10)
        expect(c1.getters.getEffectSet.has('EFFECT_TEST')).toBeTruthy()
        expect(c1.getters.getEffects).toHaveLength(1)
        expect(logs).toEqual(['init effect test', 'effect applied - type:EFFECT_TEST target:c1 source:c1'])
    })
    it('should not apply effect because of rejection', function () {
        const h = new Horde()
        const ep = new EffectProcessor({ horde: h })
        const logs = []
        ep.effectPrograms = {
            EFFECT_TEST: {
                init: function ({ effect }) {
                    logs.push('init effect test')
                },
                apply: function ({ effect, reject }) {
                    if (effect.amp > 0) {
                        reject()
                    }
                }
            }
        }
        ep.events.on('effect-applied', ({ effect, source, target }) => {
            logs.push('effect applied - type:' + effect.type + ' target:' + target.id + ' source:' + source.id)
        })
        ep.events.on('effect-immunity', ({ effect, source, target }) => {
            logs.push('effect rejected - type:' + effect.type)
        })

        // this effect will be rejected
        const eff1 = ep.createEffect('EFFECT_TEST', 1)
        const c1 = new Creature({ id: 'c1' })
        ep.applyEffect(eff1, c1, 10)
        expect(c1.getters.getEffectSet.has('EFFECT_TEST')).toBeFalsy()
        expect(c1.getters.getEffects).toHaveLength(0)
        expect(logs).toEqual(['init effect test', 'effect rejected - type:EFFECT_TEST'])

        // this effect will *NOT* be rejected
        const eff2 = ep.createEffect('EFFECT_TEST', 0)
        ep.applyEffect(eff2, c1, 10)
        expect(c1.getters.getEffectSet.has('EFFECT_TEST')).toBeTruthy()
        expect(c1.getters.getEffects).toHaveLength(1)
        expect(logs).toEqual([
            'init effect test',
            'effect rejected - type:EFFECT_TEST',
            'init effect test',
            'effect applied - type:EFFECT_TEST target:c1 source:c1'
        ])
    })
})

describe('applyEffectGroup', function () {
    it ('should apply 2 effects with siblings', function () {
        const h = new Horde()
        const ep = new EffectProcessor({ horde: h })
        const logs = []
        ep.effectPrograms = {
            EFFECT_TEST_1: {
            },
            EFFECT_TEST_2: {
            }
        }
        const c1 = new Creature({ id: 'c1' })
        const eff1 = ep.createEffect('EFFECT_TEST_1')
        const eff2 = ep.createEffect('EFFECT_TEST_2')
        const [aeff1, aeff2] = ep.applyEffectGroup([eff1, eff2], 'EFF_GROUP', c1, 10)
        expect(c1.getters.getEffectSet.has('EFFECT_TEST_1')).toBeTruthy()
        expect(c1.getters.getEffectSet.has('EFFECT_TEST_2')).toBeTruthy()
        expect(aeff1.siblings).toEqual([aeff1.id, aeff2.id])
        expect(aeff2.siblings).toEqual([aeff1.id, aeff2.id])
    })
    it ('should remove all sibling effects when remove one effect of the group', function () {
        const h = new Horde()
        const ep = new EffectProcessor({ horde: h })
        const logs = []
        ep.effectPrograms = {
            EFFECT_TEST_1: {
            },
            EFFECT_TEST_2: {
            }
        }
        const c1 = new Creature({ id: 'c1' })
        h.linkCreature(c1)
        const eff1 = ep.createEffect('EFFECT_TEST_1')
        const eff2 = ep.createEffect('EFFECT_TEST_2')
        const [aeff1, aeff2] = ep.applyEffectGroup([eff1, eff2], 'EFF_GROUP', c1, 10)
        expect(c1.getters.getEffects).toHaveLength(2)
        expect(c1.getters.getEffects[0].id).toBe(aeff1.id)
        expect(c1.getters.getEffects[1].id).toBe(aeff2.id)
        expect(c1.getters.getEffectRegistry).toEqual({
            [aeff1.id]: aeff1,
            [aeff2.id]: aeff2
        })
        expect(c1.getters.getEffectRegistry).toHaveProperty(aeff1.id)
        expect(c1.getters.getEffectRegistry).toHaveProperty(aeff2.id)
        ep.processEffect(aeff1)
        ep.processEffect(aeff2)
        expect(c1.getters.getEffectRegistry).toHaveProperty(aeff1.id)
        expect(c1.getters.getEffectRegistry).toHaveProperty(aeff2.id)
        ep.processEffect(aeff1)
        ep.processEffect(aeff2)
        ep.processEffect(aeff1)
        ep.processEffect(aeff2)
        expect(c1.getters.getEffectRegistry[aeff1.id].duration).toBe(7)
        expect(c1.getters.getEffectRegistry[aeff2.id].duration).toBe(7)

        // removing effect
        expect(c1.getters.getEffects).toHaveLength(2)
        ep.removeEffect(aeff2)
        expect(c1.getters.getEffects).toHaveLength(0)
        expect(c1.getters.getEffectRegistry).not.toHaveProperty(aeff1.id)
        expect(c1.getters.getEffectRegistry).not.toHaveProperty(aeff2.id)
    })
})