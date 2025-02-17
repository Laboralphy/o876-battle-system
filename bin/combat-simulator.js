const Manager = require('../src/Manager')
const Events = require('events')
const CONSTS = require('../src/consts')

class CombatSimulator {
    constructor () {
        this._manager = new Manager()
        this._manager.loadModule('classic')
        this._manager.combatManager.defaultDistance = 50
        this._events = new Events()
        this.pluginCombatEvents()
    }

    pluginCombatEvents () {
        const e = this._manager.events
        e.on(CONSTS.EVENT_COMBAT_START, ({ combat }) => {
            this.sendTextEvent(combat.attacker.id, 'engages', combat.target.id, 'at distance', combat.distance)
        })
        e.on(CONSTS.EVENT_COMBAT_MOVE, ({ combat }) => {
            this.sendTextEvent(combat.attacker.id, 'moves towards', combat.target.id)
        })
        e.on(CONSTS.EVENT_COMBAT_DISTANCE, ({ combat, distance }) => {
            this.sendTextEvent(combat.attacker.id, 'is now', distance, '\' from', combat.target.id)
        })
        e.on(CONSTS.EVENT_COMBAT_TURN, ({ combat, action }) => {
            const currentAction = combat.currentAction
            if (currentAction) {
                this.sendTextEvent(combat.attacker.id, 'prepares action', currentAction.id)
            }
        })
        e.on(CONSTS.EVENT_COMBAT_ACTION, ({ combat, action }) => {
            this.sendTextEvent(combat.attacker.id, 'used action', action.id)
        })
        e.on(CONSTS.EVENT_CREATURE_SELECT_WEAPON, ({ creature, slot }) => {
            const weapon = creature.getters.getSelectedWeapon
            const sWeaponTechName = weapon?.tag || '(nothing)'
            this.sendTextEvent(creature.id, 'switches to', sWeaponTechName)
        })
        e.on(CONSTS.EVENT_COMBAT_ATTACK, ({ attack }) => {
            if (attack.failed) {
                this.sendTextEvent(attack.attacker.id, 'failed to attack:', attack.failure)
                return
            }
            const bias = attack.rollBias.value > 0
                ? '(advantaged)'
                : attack.rollBias.value < 0
                    ? '(disadvantaged)'
                    : ''
            if (attack.critical) {
                this.sendTextEvent(
                    attack.attacker.id, 'attacks', attack.target.id, bias, '**CRITICAL HIT**'
                )
                this.sendTextEvent(attack.target.id, 'hp left:', attack.target.hitPoints)
            } else if (attack.fumble) {
                this.sendTextEvent(
                    attack.attacker.id, 'attacks', attack.target.id, bias, '**CRITICAL MISS**'
                )
            } else {
                this.sendTextEvent(
                    attack.attacker.id, 'attacks', attack.target.id, 'with', attack.weapon.blueprint.ref ?? 'a weapon',
                    bias,
                    attack.roll, '+', attack.attackBonus, '=', attack.roll + attack.attackBonus, 'vs', attack.ac,
                    attack.hit ? '**HIT**' : '**MISS**',
                )
            }
        })
        e.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            const {
                amount,
                resisted,
                damageType,
                creature,
                source,
                subtype
            } = evt
            this.sendTextEvent(creature.id, 'takes', amount, 'damages (' + damageType + ') - hp left:', creature.hitPoints)
        })
        e.on(CONSTS.EVENT_CREATURE_DEATH, (evt) => {
            const {
                creature,
                killer
            } = evt
            this.sendTextEvent(creature.id, 'died', '(killed by', (killer?.id || 'someone') + ')')
        })
        e.on(CONSTS.EVENT_CREATURE_SAVING_THROW, evt => {
            const {
                creature,
                roll,
                dc,
                success,
                bonus,
                ability
            } = evt
            if (success) {
                this.sendTextEvent(creature.id, `saving throw ${ability} **SUCCESS** : ${roll} + ${bonus} = ${roll + bonus} vs. ${dc}`)
            } else {
                // this.sendTextEvent(creature.id, `saving throw ${ability} **FAILURE**: ${roll} + ${bonus} = ${roll + bonus} vs. ${dc}`)
            }
        })
        e.on(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, (evt) => {
            const { creature: target, effect } = evt
            this.sendTextEvent(target.id, `effect applied ${effect.type}`)
        })
        e.on(CONSTS.EVENT_CREATURE_EFFECT_EXPIRED, (evt) => {
            const { creature: target, effect } = evt
            this.sendTextEvent(target.id, `effect ran out ${effect.type}`)
        })
    }

    get events () {
        return this._events
    }

    sendTextEvent(...aStrings) {
        this._events.emit('output', { output: aStrings })
    }

    startCombat (resref1, resref2) {
        const c1 = this._manager.createEntity(resref1, resref1 + '-1')
        const c2 = this._manager.createEntity(resref2, resref2 + '-2')
        return this._manager.startCombat(c1, c2)
    }

    doomloop () {
        this._manager.process()
    }

    get activeCombatCount () {
        return this._manager.combatManager.combats.length
    }

    playCombat (ref1, ref2) {
        const DOOM_LOOP_IT_COUNT = Math.pow(2, 32)
        let combat
        try {
            combat = this.startCombat(ref1, ref2)
            for (let i = 0; i < DOOM_LOOP_IT_COUNT; ++i) {
                this.doomloop()
                if (this.activeCombatCount === 0) {
                    this.sendTextEvent('exiting doom loop after', i, 'iterations.')
                    break
                }
            }
            return [
                { hp: combat.attacker.hitPoints, maxhp: combat.attacker.getters.getMaxHitPoints },
                { hp: combat.target.hitPoints, maxhp: combat.target.getters.getMaxHitPoints }
            ]
        } catch (e) {
            throw e
        } finally {
            if (combat) {
                this._manager.destroyEntity(combat.attacker)
                this._manager.destroyEntity(combat.target)
            }
        }
    }

    benchmark (resref1, resref2) {
        const COMBAT_COUNT = 1000
        const aStats = []
        let time = process.hrtime()
        for (let i = 0; i < COMBAT_COUNT; ++i) {
            aStats.push(this.playCombat(resref1, resref2))
            const time2 = process.hrtime(time)
            if (time2[0] >= 1) {
                console.log(Math.round(100 * i / COMBAT_COUNT) + '%')
                time = process.hrtime()
            }
        }
        console.log(100 + '%')
        const w1 = aStats.filter(x => x[0].hp > 0 && x[1].hp <= 0).length / COMBAT_COUNT
        const w2 = aStats.filter(x => x[1].hp > 0 && x[0].hp <= 0).length / COMBAT_COUNT
        const x1 = aStats.reduce((prev, curr) => prev + curr[0].hp / curr[0].maxhp, 0) / COMBAT_COUNT
        const x2 = aStats.reduce((prev, curr) => prev + curr[1].hp / curr[1].maxhp, 0) / COMBAT_COUNT
        console.log(resref1, 'wins', (w1 * 100).toFixed(2) + '%', 'hp left', (x1 * 100).toFixed(2) + '%')
        console.log(resref2, 'wins', (w2 * 100).toFixed(2) + '%', 'hp left', (x2 * 100).toFixed(2) + '%')
    }
}



function getArgv () {
    return process.argv.slice(2)
}

function main () {
    const argv = getArgv()
    const cs = new CombatSimulator()
    cs.events.on('output', ({ output }) => console.log(...output))
    cs.playCombat(argv[0], argv[1])
}

main()
