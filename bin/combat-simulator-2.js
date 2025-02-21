const Events = require('events');
const API = require('../src/API');
const {CONDITIONS} = require('../src/data');

class CombatSimulator {
    constructor () {
        this._events = new Events();
        this._api = new API();
        this.services = this._api.services;
        this.services.core.loadModule('classic');
        this.pluginCombatEvents();
    }

    get events () {
        return this._events;
    }

    /**
     * Event handler : combat is starting
     * @param evt {CombatStartEvent}
     */
    eventCombatStart (evt) {
        const distance = this._api.services.combats.getTargetDistance(evt.attacker);
        this.sendTextEvent(evt.attacker.id, 'engages', evt.target.id, 'at distance', distance);
    }

    /**
     * Event handler : a creature is moving
     * @param evt {CombatMoveEvent}
     */
    eventCombatMove (evt) {
        if (evt.speed > 0) {
            this.sendTextEvent(evt.attacker.id, 'moves towards', evt.target.id);
        } else if (evt.speed < 0) {
            this.sendTextEvent(evt.attacker.id, 'retreats from', evt.target.id);
        }
    }

    /**
     * Event handler : the distance between attacker and target is updated
     * @param evt {CombatDistanceEvent}
     */
    eventCombatDistance (evt) {
        this.sendTextEvent(evt.attacker.id, 'is now', evt.distance, 'feet from', evt.target.id);
    }

    /**
     * Event handler : a new combat turn begins
     * @param evt {CombatTurnEvent}
     */
    eventCombatTurn (evt) {
        const currentAction = this.services.combats.getSelectedAction(evt.attacker);
        if (currentAction) {
            this.sendTextEvent(evt.attacker.id, 'prepares action', currentAction.id);
        }
    }

    /**
     * Event handler : a creature is using an action
     * @param evt {CombatActionEvent}
     */
    eventCombatAction (evt) {
        this.sendTextEvent(evt.attacker.id, 'used action', evt.action.id);
    }

    /**
     * Event handler : a creature is selecting a weapon
     * @param evt {CreatureSelectWeaponEvent}
     */
    eventCreatureSelectWeapon (evt) {
        const weapon = evt.weapon;
        const tag = this._api.services.items.getItemTag(weapon);
        const sWeaponTechName = tag ?? '(nothing)';
        this.sendTextEvent(evt.creature.id, 'switches to', sWeaponTechName);
    }

    /**
     * Event handler : an attack occurs
     * @param evt {CombatAttackEvent}
     */
    eventCombatAttack (evt) {
        if (evt.failed) {
            this.sendTextEvent(evt.attacker.id, 'failed to attack:', evt.failure);
            return;
        }
        const bias = evt.bias > 0
            ? '(advantaged)'
            : evt.bias < 0
                ? '(disadvantaged ' + evt.disadvantages.toString() + ')'
                : '';
        if (evt.critical) {
            this.sendTextEvent(
                evt.attacker.id, 'attacks', evt.target.id, bias, '**CRITICAL HIT**'
            );
            this.sendTextEvent(evt.target.id, 'hp left:', this.services.creatures.getHitPoints(evt.target));
        } else if (evt.fumble) {
            this.sendTextEvent(
                evt.attacker.id, 'attacks', evt.target.id, bias, '**CRITICAL MISS**'
            );
        } else {
            this.sendTextEvent(
                evt.attacker.id, 'attacks', evt.target.id,
                'with', this.services.items.getItemTag(evt.weapon),
                bias,
                evt.roll, '+', evt.bonus, '=', evt.roll + evt.bonus, 'vs', evt.ac,
                evt.hit ? '**HIT**' : '**MISS**',
            );
        }
    }

    /**
     * Event handler : a creature is damaged
     * @param evt {CreatureDamagedEvent}
     */
    eventCreatureDamaged (evt) {
        const {
            creature,
            amount,
            damageType
        } = evt;
        this.sendTextEvent(creature.id, 'takes', amount, 'damages (' + damageType + ') - hp left:', creature.hitPoints);
    }

    /**
     * Event handler : a creature is killed
     * @param evt {CreatureDeathEvent}
     */
    eventCreatureDeath (evt) {
        if (evt.killer && evt.killer !== evt.creature) {
            this.sendTextEvent(evt.creature.id, 'died', '(killed by', evt.killer.id + ')');
        } else {
            this.sendTextEvent(evt.creature.id, 'died');
        }
    }

    /**
     * Event handler : a creature is rolling a saving throw
     * @param evt {CreatureSavingThrowEvent}
     */
    eventCreatureSavingThrow (evt) {
        const {
            creature,
            roll,
            dc,
            success,
            bonus,
            ability
        } = evt;
        if (success) {
            this.sendTextEvent(creature.id, `saving throw ${ability} **SUCCESS** : ${roll} + ${bonus} = ${roll + bonus} vs. ${dc}`);
        } else {
            // this.sendTextEvent(creature.id, `saving throw ${ability} **FAILURE**: ${roll} + ${bonus} = ${roll + bonus} vs. ${dc}`)
        }
    }

    /**
     *
     * @param evt {CreatureEffectAppliedEvent|CreatureEffectExpiredEvent|CreatureEffectImmunityEvent}
     */
    eventCreatureEffectUpdate (evt) {
        const CONSTS = this.services.core.CONSTS;
        let s = '';
        switch (evt.type) {
        case CONSTS.EVENT_CREATURE_EFFECT_APPLIED: {
            s = 'applied';
            break;
        }
        case CONSTS.EVENT_CREATURE_EFFECT_EXPIRED: {
            s = 'expired';
            break;
        }
        case CONSTS.EVENT_CREATURE_EFFECT_IMMUNITY: {
            s = 'immunity';
            break;
        }
        }
        this.sendTextEvent(evt.creature.id, `effect ${s} ${evt.effect.type}`);
    }

    pluginCombatEvents () {
        const CONSTS = this.services.core.CONSTS;
        const e = this.services.core.events;
        e.on(CONSTS.EVENT_COMBAT_START, evt => {
            this.eventCombatStart(evt);
        });
        e.on(CONSTS.EVENT_COMBAT_MOVE, evt => {
            this.eventCombatMove(evt);
        });
        e.on(CONSTS.EVENT_COMBAT_DISTANCE, evt => {
            this.eventCombatDistance(evt);
        });
        e.on(CONSTS.EVENT_COMBAT_TURN, evt => {
            this.eventCombatTurn(evt);
        });
        e.on(CONSTS.EVENT_COMBAT_ACTION, evt => {
            this.eventCombatAction(evt);
        });
        e.on(CONSTS.EVENT_CREATURE_SELECT_WEAPON, evt => {
            this.eventCreatureSelectWeapon(evt);
        });
        e.on(CONSTS.EVENT_COMBAT_ATTACK, evt => {
            this.eventCombatAttack(evt);
        });
        e.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            this.eventCreatureDamaged(evt);
        });
        e.on(CONSTS.EVENT_CREATURE_DEATH, (evt) => {
            this.eventCreatureDeath(evt);
        });
        e.on(CONSTS.EVENT_CREATURE_SAVING_THROW, evt => {
            this.eventCreatureSavingThrow(evt);
        });
        e.on(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, (evt) => {
            this.eventCreatureEffectUpdate(evt);
        });
        e.on(CONSTS.EVENT_CREATURE_EFFECT_EXPIRED, (evt) => {
            this.eventCreatureEffectUpdate(evt);
        });
    }

    sendTextEvent(...aStrings) {
        this._events.emit('output', { output: aStrings });
    }

    startCombat (resref1, resref2) {
        const c1 = this.services.entities.createEntity(resref1, resref1 + '-1');
        const c2 = this.services.entities.createEntity(resref2, resref2 + '-2');
        const combat = this.services.combats.startCombat(c1, c2);
        return {
            attacker: c1,
            target: c2
        };
    }

    doomloop () {
        this.services.core.manager.process();
    }

    get activeCombatCount () {
        return this.services.core.manager.combatManager.combats.length;
    }

    playCombat (ref1, ref2) {
        const DOOM_LOOP_IT_COUNT = Math.pow(2, 32);
        let combat;
        try {
            combat = this.startCombat(ref1, ref2);
            const { attacker, target } = combat;
            for (let i = 0; i < DOOM_LOOP_IT_COUNT; ++i) {
                this.doomloop();
                if (this.activeCombatCount === 0) {
                    this.sendTextEvent('exiting doom loop after', i, 'iterations.');
                    break;
                }
            }
            return [
                { hp: attacker.hitPoints, maxhp: this.services.creatures.getMaxHitPoints(attacker) },
                { hp: target.hitPoints, maxhp: this.services.creatures.getMaxHitPoints(target) }
            ];
        } catch (e) {
            throw e;
        } finally {
            if (combat) {
                this.services.entities.destroyEntity(combat.attacker);
                this.services.entities.destroyEntity(combat.target);
            }
        }
    }

    benchmark (resref1, resref2) {
        const COMBAT_COUNT = 1000;
        const aStats = [];
        let time = process.hrtime();
        for (let i = 0; i < COMBAT_COUNT; ++i) {
            aStats.push(this.playCombat(resref1, resref2));
            const time2 = process.hrtime(time);
            if (time2[0] >= 1) {
                console.log(Math.round(100 * i / COMBAT_COUNT) + '%');
                time = process.hrtime();
            }
        }
        console.log(100 + '%');
        const w1 = aStats.filter(x => x[0].hp > 0 && x[1].hp <= 0).length / COMBAT_COUNT;
        const w2 = aStats.filter(x => x[1].hp > 0 && x[0].hp <= 0).length / COMBAT_COUNT;
        const x1 = aStats.reduce((prev, curr) => prev + curr[0].hp / curr[0].maxhp, 0) / COMBAT_COUNT;
        const x2 = aStats.reduce((prev, curr) => prev + curr[1].hp / curr[1].maxhp, 0) / COMBAT_COUNT;
        console.log(resref1, 'wins', (w1 * 100).toFixed(2) + '%', 'hp left', (x1 * 100).toFixed(2) + '%');
        console.log(resref2, 'wins', (w2 * 100).toFixed(2) + '%', 'hp left', (x2 * 100).toFixed(2) + '%');
    }
}



function getArgv () {
    return process.argv.slice(2);
}

function main () {
    const argv = getArgv();
    const cs = new CombatSimulator();
    cs.events.on('output', ({ output }) => console.log(...output));
    cs.playCombat(argv[0], argv[1]);
}

main();
