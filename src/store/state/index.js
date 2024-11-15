const CONSTS = require('../../consts')

module.exports = () => ({
    id: '',
    specie: 'SPECIE_HUMANOID',
    race: 'RACE_UNKNOWN',
    gender: 'GENDER_NONE',
    naturalArmorClass: 10,
    abilities: {
        [CONSTS.ABILITY_STRENGTH]: 10,
        [CONSTS.ABILITY_DEXTERITY]: 10,
        [CONSTS.ABILITY_CONSTITUTION]: 10,
        [CONSTS.ABILITY_INTELLIGENCE]: 10,
        [CONSTS.ABILITY_WISDOM]: 10,
        [CONSTS.ABILITY_CHARISMA]: 10
    },
    classType: 'CLASS_TYPE_TOURIST',
    pools: {
        hitPoints: 1
    },
    properties: [],
    effects: {},
    equipment: {
        [CONSTS.EQUIPMENT_SLOT_INVALID]: null,
        [CONSTS.EQUIPMENT_SLOT_HEAD]: null,
        [CONSTS.EQUIPMENT_SLOT_NECK]: null,
        [CONSTS.EQUIPMENT_SLOT_CHEST]: null,
        [CONSTS.EQUIPMENT_SLOT_BACK]: null,
        [CONSTS.EQUIPMENT_SLOT_ARMS]: null,
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: null,
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: null,
        [CONSTS.EQUIPMENT_SLOT_SHIELD]: null,
        [CONSTS.EQUIPMENT_SLOT_FINGER_LEFT]: null,
        [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: null,
        [CONSTS.EQUIPMENT_SLOT_AMMO]: null,
        [CONSTS.EQUIPMENT_SLOT_WAIST]: null,
        [CONSTS.EQUIPMENT_SLOT_FEET]: null
    }
})
