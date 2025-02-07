const { getBestDamageTypeVsMitigation, getWorstDamageTypeVsAC } = require('../src/libs/helpers')
const CONSTS = require('../src/consts')

describe('getBestDamageVsMitigation', function () {
    it('should throw an error when parameter is zero length', function () {
        expect(() => getBestDamageTypeVsMitigation([], {}))
            .toThrow(new Error('DamageType Array must have at least one item'))
    })

    it('should return first damage type when mitigation is empty (has no items)', function () {
        expect(getBestDamageTypeVsMitigation(
            [CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_CRUSHING], {})
        ).toBe(CONSTS.DAMAGE_TYPE_PIERCING)
        expect(getBestDamageTypeVsMitigation(
            [CONSTS.DAMAGE_TYPE_CRUSHING, CONSTS.DAMAGE_TYPE_PIERCING], {})
        ).toBe(CONSTS.DAMAGE_TYPE_CRUSHING)
        expect(getBestDamageTypeVsMitigation(
            [CONSTS.DAMAGE_TYPE_SLASHING, CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_CRUSHING], {})
        ).toBe(CONSTS.DAMAGE_TYPE_SLASHING)
    })

    describe('when weapon damage types are [PIERCING, SLASHING] and mitigation non empty', function () {
        it('should return PIERCING when mitigation has SLASHING resistance', function () {
            expect(getBestDamageTypeVsMitigation(
                [CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_SLASHING],
                {
                    [CONSTS.DAMAGE_TYPE_SLASHING]: {
                        factor: 0.5
                    }
                }
            )).toBe(CONSTS.DAMAGE_TYPE_PIERCING)
        })
        it('should return SLASHING when mitigation has SLASHING vulnerability', function () {
            expect(getBestDamageTypeVsMitigation(
                [CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_SLASHING],
                {
                    [CONSTS.DAMAGE_TYPE_SLASHING]: {
                        factor: 2
                    }
                }
            )).toBe(CONSTS.DAMAGE_TYPE_SLASHING)
        })
    })

})

describe('getWorstDamageTypeVsAC', function () {
    it('should throw an error when parameter is zero length', function () {
        expect(() => getWorstDamageTypeVsAC([], {}))
            .toThrow(new Error('DamageType Array must have at least one item'))
    })

    it('should return first damage type when armor classes array is empty (has no items)', function () {
        expect(getWorstDamageTypeVsAC(
            [CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_CRUSHING], {})
        ).toBe(CONSTS.DAMAGE_TYPE_PIERCING)
        expect(getWorstDamageTypeVsAC(
            [CONSTS.DAMAGE_TYPE_CRUSHING, CONSTS.DAMAGE_TYPE_PIERCING], {})
        ).toBe(CONSTS.DAMAGE_TYPE_CRUSHING)
        expect(getWorstDamageTypeVsAC(
            [CONSTS.DAMAGE_TYPE_SLASHING, CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_CRUSHING], {})
        ).toBe(CONSTS.DAMAGE_TYPE_SLASHING)
    })

    describe('when weapon damage types are [PIERCING, SLASHING] and armor classes non empty', function () {
        it('should return PIERCING when armor classes has PIERCING at highest', function () {
            expect(getWorstDamageTypeVsAC(
                [CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_SLASHING],
                {
                    [CONSTS.DAMAGE_TYPE_SLASHING]: 16,
                    [CONSTS.DAMAGE_TYPE_PIERCING]: 18
                }
            )).toBe(CONSTS.DAMAGE_TYPE_PIERCING)
        })
        it('should return SLASHING when armor classes has SLASHING at highest', function () {
            expect(getWorstDamageTypeVsAC(
                [CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_SLASHING],
                {
                    [CONSTS.DAMAGE_TYPE_SLASHING]: 18,
                    [CONSTS.DAMAGE_TYPE_PIERCING]: 16
                }
            )).toBe(CONSTS.DAMAGE_TYPE_SLASHING)
        })
    })
})