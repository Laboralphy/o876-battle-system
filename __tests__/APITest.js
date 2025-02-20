const API = require('../src/API');
const BoxedCreature = require('../src/sub-api/classes/BoxedCreature');

describe('entities', function () {
    describe('createEntity', function () {
        it('should create a boxed entity', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            expect(oGoblin).toBeInstanceOf(BoxedCreature);
        });

        it('should not create an entity when resref is invalid', function () {
            const api = new API();
            expect(() => api.services.entities.createEntity('c-goblin', 'c1'))
                .toThrowError(new ReferenceError('This blueprint does not exist c-goblin'));
        });
    });

    describe('destroyEntity', function () {
        it('should destroy an existing entity', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            expect(api.services.entities.getEntityById(oGoblin.id)).not.toBeNull();
            api.services.entities.destroyEntity(oGoblin);
            expect(api.services.entities.getEntityById(oGoblin.id)).toBeNull();
        });

        it('should not throw an error when destroying the same entity twice', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            api.services.entities.destroyEntity(oGoblin);
            expect(() => {
                api.services.entities.destroyEntity(oGoblin);
            }).not.toThrow();
        });
    });

    describe('switchEntityType', function () {
        it('should switch ', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            const oSword = api.services.entities.createEntity('wpn-short-sword', 'sw1');
            const r1 = api.services.entities.switchEntityType(oGoblin, {
                creature: creature => 'creature-' + creature.id,
                item: item => 'item-' + item.id
            });
            const r2 = api.services.entities.switchEntityType(oSword, {
                creature: creature => 'creature-' + creature.id,
                item: item => 'item-' + item.id
            });
            expect(r1).toBe('creature-c1');
            expect(r2).toBe('item-sw1');
        });
    });
});
