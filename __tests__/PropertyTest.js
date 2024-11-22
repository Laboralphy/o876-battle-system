const CONSTS = require('../src/consts')

const oHumanBP = {
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_HUMAN,
    ac: 10,
    hp: 6,
    proficiencies: []
}

const oTouristBP = {
    classType: CONSTS.CLASS_TYPE_TOURIST,
    hd: 6,
    proficiencies: []
}

describe('PROPERTY_ABILITY_MODIFIER', function () {
    const oArmorLeatherBP = {
        entityType: CONSTS.ENTITY_TYPE_ITEM,
        itemType: CONSTS.ITEM_TYPE_ARMOR,
        ac: 1,
        proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
        properties: []
    }
    it('Leather Armor should increase armor class by 1', function () {
    })
})