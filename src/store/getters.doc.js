/**
 * @typedef RBSStoreGetters {object}
 * @property getAbilities {Object<string, number>}
 * @property getAbilityBaseValues {Object<string, number>}
 * @property getAbilityModifiers {Object<string, number>}
 * @property getActions {{ [id: string]: RBSAction }}
 * @property getArmorClass {Object<string, number>}
 * @property getAttackAbility {{[p: string]: string}}
 * @property getAttackBonus {number}
 * @property getCapabilitySet {Set<string>}
 * @property getConditionSet {Set<string>}
 * @property getDamageMitigation {Object<string, RBSOneDamageMitigation>}}
 * @property getDefensiveSlots {string[]}
 * @property getEffectRegistry {Object<string, RBSEffect>}
 * @property getEffectSet {Set<string>}
 * @property getEffects {RBSEffect[]}
 * @property getEncumbrance {{value: number, capacity: number}}
 * @property getEnvironment {{ darkness: boolean, windy: boolean, difficultTerrain: boolean, underwater: boolean }}
 * @property getEquipment {Object<string, RBSItem>}
 * @property getEquipmentProperties {RBSProperty[]}
 * @property getHitPoints {number}
 * @property getId {string}
 * @property getImmunitySet {Set<string>}
 * @property getInnateProperties {RBSProperty[]}
 * @property getLevel {number}
 * @property getMaxHitPoints {number}
 * @property getMeleeAttackBonus {number}
 * @property getOffensiveSlots {string[]}
 * @property getProficiencyBonus {number}
 * @property getProficiencySet {Set<string>}
 * @property getProperties {RBSProperty[]}
 * @property getPropertySet {Set<string>}
 * @property getRangedAttackBonus {number}
 * @property getSavingThrowBonus {{[ability: string]: number}}
 * @property getSelectedOffensiveSlot {string} EQUIPMENT_SLOT_WEAPON_MELEE or RANGED
 * @property getSelectedWeapon {RBSItem|null}
 * @property getSelectedWeaponAttributeSet {Set<string>}
 * @property getSlotProperties {{[slot: string]: RBSProperty[]}}
 * @property getSpeed {number}
 * @property getSpellDifficultyClass {{[ability: string]: number}}
 * @property getWeaponRanges {number}
 * @property isDead {boolean}
 * @property isEquipmentProficient {{[p: string]: boolean}}
 * @property isRangedWeaponLoaded {boolean}
 * @property isWieldingShield {boolean}
 * @property isWieldingTwoHandedWeapon {boolean}
 */

module.exports = {}
