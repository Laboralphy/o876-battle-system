/**
 * @typedef RBSStoreMutations {Object}
 * @property addEffect {function({ effect: RBSEffect }): RBSEffect}
 * @property addProficiency {function({ value: string })}
 * @property addProperty {function({ property: RBSProperty })}
 * @property equipItem {function({ item: RBSItem, slot: string, bypassCurse: boolean }): *}
 * @property removeEffect {function({ effect: RBSEffect })}
 * @property selectOffensiveSlot {function({ value: string })}
 * @property setAbilityValue {function({ ability: string, value: number })}
 * @property setClassType {function({ value: string CLASS_TYPE_* })}
 * @property setEffectDuration {function({ effect: RBSEffect, duration: number })}
 * @property setEnvironment {function({ environment, value })}
 * @property setGender {function({ value: string GENDER_* })}
 * @property setId {function({ id: string })}
 * @property setLevel {function({ value: number })}
 * @property setNaturalArmorClass {function({ value: number })}
 * @property setRace {function({ value: string RACE_* })}
 * @property setSpecie {function({ value: string SPECIE_* })}
 * @property setSpeed {function({ value: number })}
 */

module.exports = {}
