const LocationRegistry = require('./LocationRegistry');

describe('getEntityLocation', function () {
    it('should return undefined when asking for inexistant entity', function () {
        const lr = new LocationRegistry();
        expect(lr.getEntityLocation('a')).toBeUndefined();
    });
});

describe('setEntityLocation', function () {
    it('should return loc1 when asking for entity location', function () {
        const lr = new LocationRegistry();
        lr.setEntityLocation('ent1', 'loc1');
        expect(lr.getEntityLocation('ent1')).toBe('loc1');
    });
});

describe('getLocationEntities', function () {
    it('should return [ent1] when asking for entoities un loc1', function () {
        const lr = new LocationRegistry();
        lr.setEntityLocation('ent1', 'loc1');
        expect(lr.getLocationEntities('loc1')).toEqual(['ent1']);
        lr.setEntityLocation('ent1', 'loc2');
        expect(lr.getLocationEntities('loc1')).toEqual([]);
        expect(lr.getLocationEntities('loc2')).toEqual(['ent1']);
    });
});

describe('removeEntity', function () {
    it('should remove ent1', function () {
        const lr = new LocationRegistry();
        lr.setEntityLocation('ent1', 'loc1');
        lr.removeEntity('ent1');
        expect(lr.getLocationEntities('loc1')).toEqual([]);
    });
});
