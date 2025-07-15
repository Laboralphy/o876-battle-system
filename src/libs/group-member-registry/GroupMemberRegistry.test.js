const GroupMemberRegistry = require('./GroupMemberRegistry');

describe('getMemberGroup', function () {
    it('should return undefined when asking for inexistant member', function () {
        const gmr = new GroupMemberRegistry();
        expect(gmr.getMemberGroup('a')).toBeUndefined();
    });
});

describe('setMemberGroup', function () {
    it('should return loc1 when asking for member group', function () {
        const gmr = new GroupMemberRegistry();
        gmr.setMemberGroup('ent1', 'loc1');
        expect(gmr.getMemberGroup('ent1')).toBe('loc1');
    });
});

describe('getGroupmembers', function () {
    it('should return [ent1] when asking for entoities un loc1', function () {
        const gmr = new GroupMemberRegistry();
        gmr.setMemberGroup('ent1', 'loc1');
        expect(gmr.getGroupMembers('loc1')).toEqual(['ent1']);
        gmr.setMemberGroup('ent1', 'loc2');
        expect(gmr.getGroupMembers('loc1')).toEqual([]);
        expect(gmr.getGroupMembers('loc2')).toEqual(['ent1']);
    });
});

describe('removeMember', function () {
    it('should remove ent1', function () {
        const gmr = new GroupMemberRegistry();
        gmr.setMemberGroup('ent1', 'loc1');
        gmr.removeMember('ent1');
        expect(gmr.getGroupMembers('loc1')).toEqual([]);
    });
});
