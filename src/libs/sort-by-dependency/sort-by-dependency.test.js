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
        const b = sortByDependency(a, 'id', 'extends')
        expect(b).toEqual([
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
            },
            {
                id: 'staff',
                data: 103
            }
        ])
    })
    it('should not be able to sort when cyclic dependency', function () {
        const a = [
            {
                id: 'a',
                data: 101,
                extends: 'b'
            },
            {
                id: 'b',
                data: 102,
                extends: 'a'
            }
        ]
        expect(() => sortByDependency(a, 'id', 'extends')).toThrow()
    })
    it('should be able to sort 2', function () {
        const a = []
        for (let i = 1; i <= 100; ++i) {
            a.push({ id: i, parent: i + 1 })
        }
        a.push({ id: 101 })
        expect(() => sortByDependency(a, 'id', 'parent')).not.toThrow()
    })
    it('should be able to handle arrays', function () {
        const a = [
            {
                id: 1,
                parent: [2, 3]
            },
            {
                id: 2,
                parent: []
            },
            {
                id: 3,
                parent: 4
            },
            {
                id: 4,
                parent: null
            }
        ]
        expect(sortByDependency(a, 'id', 'parent')).toEqual( [
                { id: 2, parent: [] },
                { id: 4, parent: null },
                { id: 3, parent: 4 },
                { id: 1, parent: [ 2, 3 ] }
            ]
        )
    })
})