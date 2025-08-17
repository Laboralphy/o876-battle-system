/**
 * @typedef RBSStoreGetters {object}
 * @property getAbilities {Object<string, number>}
 * @property getAbilityBaseValues {Object<string, number>}
 * @property getAbilityModifiers {Object<string, number>}
 * @property getActions {Object<string, RBSAction>}
 * @property getActiveProperties {RBSProperty[]}
 * @property getArmorClass {Object<string, number>}
 * @property getAttackAbility {Object<string, string>}
 * @property getAttackBonus {Object<string, number>}
 * @property getCapabilitySet {Set<string>}
 * @property getClassType {string} CLASS_TYPE_*
 * @property getConditionSet {Set<string>}
 * @property getDamageMitigation {Object<string, RBSOneDamageMitigation>}}
 * @property getDeadEffects {RBSEffect[]}
 * @property getDefensiveSlots {string[]}
 * @property getEffectRegistry {Object<string, RBSEffect>}
 * @property getEffectSet {Set<string>}
 * @property getEffectTagSet {Set<string>}
 * @property getEffects {RBSEffect[]}
 * @property getEncumbrance {{value: number, capacity: number}}
 * @property getEnvironments {{ darkness: boolean, windy: boolean, difficultTerrain: boolean, underwater: boolean }}
 * @property getEquipment {Object<string, RBSItem>}
 * @property getEquipmentProperties {RBSProperty[]}
 * @property getHitPoints {number}
 * @property getId {string}
 * @property getImmunitySet {Set<string>}
 * @property getInnateProperties {RBSProperty[]}
 * @property getLearnedSpellSet {Set<string>}
 * @property getLevel {number}
 * @property getMaxHitPoints {number}
 * @property getMaxPreparedSpellCount {number}
 * @property getMeleeAttackBonus {number}
 * @property getOffensiveSlots {string[]}
 * @property getPoolValues {{ [idPool: string]: number }}
 * @property getProficiencyBonus {number}
 * @property getProficiencySet {Set<string>}
 * @property getProperties {RBSProperty[]}
 * @property getPropertySet {Set<string>}
 * @property getRangedAttackBonus {number}
 * @property getSavingThrowBonus {Object<string, number>}
 * @property getSelectedOffensiveSlot {string} EQUIPMENT_SLOT_WEAPON_MELEE or RANGED
 * @property getSelectedWeapon {RBSItem|null}
 * @property getSelectedWeaponAttributeSet {Set<string>}
 * @property getSkillValues {Object<string, number>}
 * @property getSlotProperties {Object<string, RBSProperty[]>}
 * @property getSpecie {string}
 * @property getSpecieProtectionSet {Set<string>}
 * @property getSpeed {number}
 * @property getSpellCastingAbility {string}
 * @property getSpellDifficultyClass {Object<string, number>}
 * @property getSpellSlots {{level: number, count: number, used: number, remaining: number, ready: boolean, cooldown: number}[]}
 * @property getTimers {{ spellCast: number }}
 * @property getUnmodifiedLevel {number}
 * @property getVariables {Object<string, number|string>}
 * @property getWeaponRanges {Object<string, number>}
 * @property hasSpellSlotCoolingDown {boolean}
 * @property isDead {boolean}
 * @property isEquipmentProficient {Object<string, boolean>}
 * @property isRangedWeaponLoaded {boolean}
 * @property isWieldingShield {boolean}
 * @property isWieldingTwoHandedWeapon {boolean}
 */

module.exports = {}
