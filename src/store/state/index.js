const CONSTS = require('../../consts')

/**
 * @typedef RBSStoreState {object}
 * @property id {string}
 * @property specie {string}
 * @property race {string}
 * @property gender {string}
 * @property speed {number}
 * @property level {number}
 * @property speed {number}
 * @property naturalArmorClass {number}
 * @property abilities {object<string, number>}
 * @property classType {string}
 * @property pools {object<string, number>}
 * @property properties {RBSProperty[]}
 * @property effects {RBSEffect[]}
 * @property equipment {[slot: string]: RBSItem}
 * @property offensiveSlot {string}
 * @property encumbrance {number}
 * @property proficiencies {string[]}
 *
 *
 * @returns {RBSStoreState}
 */
module.exports = () => ({
    id: '',
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_UNKNOWN,
    gender: CONSTS.GENDER_NONE,
    naturalArmorClass: 0,
    speed: 30,
    level: 1,
    abilities: {
        [CONSTS.ABILITY_STRENGTH]: 10,
        [CONSTS.ABILITY_DEXTERITY]: 10,
        [CONSTS.ABILITY_CONSTITUTION]: 10,
        [CONSTS.ABILITY_INTELLIGENCE]: 10,
        [CONSTS.ABILITY_WISDOM]: 10,
        [CONSTS.ABILITY_CHARISMA]: 10
    },
    classType: CONSTS.CLASS_TYPE_TOURIST,
    pools: {
        hitPoints: 1
    },
    properties: [],
    proficiencies: [],
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
    },
    offensiveSlot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE,
    encumbrance: 0
})
