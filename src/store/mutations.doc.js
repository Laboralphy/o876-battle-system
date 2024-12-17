/**
 * @typedef RBSStoreMutations {Object}
 * @property addEffect {function({ effect: RBSEffect }): RBSEffect}
 * @property addProficiency {function({ value: string })}
 * @property addProperty {function({ property: RBSProperty })}
 * @property coolActionsDown {function({  })}
 * @property defineAction {function({ id: string, attackType: string, cooldown: number, cooldownTimer: number, charges: number, dailyCharges: number, range: number, onHit: string, parameters: {} })}
 * @property equipItem {function({ item: RBSItem, slot: string, bypassCurse: boolean }): *}
 * @property removeEffect {function({ effect: RBSEffect })}
 * @property restoreAction {function({ idAction: string })}
 * @property selectOffensiveSlot {function({ value: string })}
 * @property setAbilityValue {function({ ability: string, value: number })}
 * @property setClassType {function({ value: string CLASS_TYPE_* })}
 * @property setEffectDuration {function({ effect: RBSEffect, duration: number })}
 * @property setEnvironment {function({ environment, value })}
 * @property setGender {function({ value: string GENDER_* })}
 * @property setHitDie {function({ value: number })}
 * @property setHitPoints {function({ value: number })}
 * @property setId {function({ id: string })}
 * @property setLevel {function({ value: number })}
 * @property setNaturalArmorClass {function({ value: number })}
 * @property setRace {function({ value: string RACE_* })}
 * @property setSpecie {function({ value: string SPECIE_* })}
 * @property setSpeed {function({ value: number })}
 * @property useAction {function({ idAction: string })}
 */

module.exports = {}
