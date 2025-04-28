const CONSTS = require('../../consts');

/**
 * @typedef RBSStoreStateCombatAction {object}
 * @property attackType {string}
 * @property cooldown {number}
 * @property cooldownTimer {number}
 * @property charges {number}
 * @property dailyCharges {number}
 * @property range {number}
 * @property script {string}
 * @property parameters {{}}
 *
 * @typedef RBSStoreState {object}
 * @property id {string}
 * @property specie {string}
 * @property race {string}
 * @property gender {string}
 * @property speed {number}
 * @property level {number}
 * @property speed {number}
 * @property hitDie {number}
 * @property naturalArmorClass {number}
 * @property abilities {object<string, number>}
 * @property classType {string}
 * @property pools {object<string, number>}
 * @property properties {RBSProperty[]}
 * @property effects {RBSEffect[]}
 * @property equipment {[slot: string]: RBSItem}
 * @property encumbrance {number}
 * @property proficiencies {string[]}
 * @property environment {Object<string, boolean >}
 * @property selectedOffensiveSlot {string}
 * @property actions {Object<string, RBSStoreStateCombatAction >}
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
    hitDie: 6,
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
    effects: [],
    equipment: {
        [CONSTS.EQUIPMENT_SLOT_INVALID]: null,
        [CONSTS.EQUIPMENT_SLOT_HEAD]: null,
        [CONSTS.EQUIPMENT_SLOT_NECK]: null,
        [CONSTS.EQUIPMENT_SLOT_CHEST]: null,
        [CONSTS.EQUIPMENT_SLOT_BACK]: null,
        [CONSTS.EQUIPMENT_SLOT_ARMS]: null,
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: null,
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: null,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: null,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: null,
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: null,
        [CONSTS.EQUIPMENT_SLOT_SHIELD]: null,
        [CONSTS.EQUIPMENT_SLOT_FINGER_LEFT]: null,
        [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: null,
        [CONSTS.EQUIPMENT_SLOT_AMMO]: null,
        [CONSTS.EQUIPMENT_SLOT_WAIST]: null,
        [CONSTS.EQUIPMENT_SLOT_FEET]: null
    },
    encumbrance: 0,
    environment: {
        [CONSTS.ENVIRONMENT_DARKNESS]: false,
        [CONSTS.ENVIRONMENT_WINDY]: false,
        [CONSTS.ENVIRONMENT_DIFFICULT_TERRAIN]: false,
        [CONSTS.ENVIRONMENT_UNDERWATER]: false
    },
    selectedOffensiveSlot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE,
    actions: {}
});
