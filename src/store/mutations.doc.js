/**
 * @typedef RBSStoreMutations {Object}
 * @property addEffect {function({ effect: RBSEffect }): RBSEffect}
 * @property addProficiency {function({ value: string })}
 * @property addProperty {function({ property: RBSProperty })}
 * @property defineAction {function({ id: string, actionType: string, cooldown: number, charges: number, range: number, script: string, parameters: {}, bonus: boolean, hostile: boolean, requirements: RBSActionRequirement|null })}
 * @property definePool {function({ pool: string })}
 * @property equipItem {function({ item: RBSItem, slot: string, bypassCurse: boolean }): *}
 * @property rechargeActions {function({  })}
 * @property rechargeSpellSlots {function({  })}
 * @property removeEffect {function({ effect: RBSEffect })}
 * @property removeProperty {function({ property: RBSProperty })}
 * @property restoreAction {function({ idAction: string })}
 * @property selectOffensiveSlot {function({ value: string })}
 * @property setAbilityValue {function({ ability: string, value: number })}
 * @property setClassType {function({ value: string CLASS_TYPE_* })}
 * @property setEffectDuration {function({ effect: RBSEffect, duration: number })}
 * @property setEncumbrance {function({ value: number })}
 * @property setEnvironment {function({ environment, value })}
 * @property setGender {function({ value: string GENDER_* })}
 * @property setHitDie {function({ value: number })}
 * @property setHitPoints {function({ value: number })}
 * @property setId {function({ id: string })}
 * @property setLevel {function({ value: number })}
 * @property setNaturalArmorClass {function({ value: number })}
 * @property setPoolValue {function({ value: number, pool: string })}
 * @property setRace {function({ value: string RACE_* })}
 * @property setSpecie {function({ value: string SPECIE_* })}
 * @property setSpeed {function({ value: number })}
 * @property setSpellSlotCount {function({ level: number, count: number })}
 * @property useAction {function({ idAction: string })}
 * @property useSpellSlot {function({ level: number })}
 */

module.exports = {}
