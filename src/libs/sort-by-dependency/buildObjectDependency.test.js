const { sortByDependency } = require('./index')

describe('sortByDependency', function () {
    it('sortByDependency', function () {
        const a = [
            {
                id: 'shortsword',
                data: 101,
                extends: 'weapon'
            },
            {
                id: 'dagger',
                data: 102,
                extends: 'weapon'
            },
            {
                id: 'staff',
                data: 103
            },
            {
                id: 'weapon',
                data: 104
            }
        ]
        sortByDependency(a, 'id', 'extends')
        expect(a).toEqual([
            {
                id: 'staff',
                data: 103
            },
            {
                id: 'weapon',
                data: 104
            },
            {
                id: 'shortsword',
                data: 101,
                extends: 'weapon'
            },
            {
                id: 'dagger',
                data: 102,
                extends: 'weapon'
            }
        ])
    })
})