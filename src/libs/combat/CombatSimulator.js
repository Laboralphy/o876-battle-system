const Events = require('events');
const {Manager} = require('../../../index');
const CONSTS = require('../../consts');

class CombatSimulator {
    constructor () {
        this._events = new Events();
        this._manager = new Manager();
        this._manager.combatManager.defaultDistance = 50;
        this._manager.loadModule('classic');
        this.pluginCombatEvents();
        this._bVerbose = true;
    }

    get events () {
        return this._events;
    }

    /**
     * Event handler : combat is starting
     * @param evt {CombatStartEvent}
     */
    eventCombatStart (evt) {
        const distance = this._manager.getCreatureDistance(evt.attacker, evt.target);
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
        const oCurrentCombat = this._manager.getCreatureCombat(evt.attacker);
        const currentAction = oCurrentCombat.currentAction;
        if (currentAction) {
            this.sendTextEvent(evt.attacker.id, 'prepares action', currentAction.id);
        }
    }

    /**
     * Event handler : a creature is using an action
     * @param evt {CreatureActionEvent}
     */
    eventCombatAction (evt) {
        const {
            creature,
            target,
            action
        } = evt;
        switch (action.actionType) {
        case CONSTS.COMBAT_ACTION_TYPE_SPELL: {
            if (action.parameters.item) {
                this.sendTextEvent(creature.id, 'uses item', action.parameters.item, 'that produces spell-like effect', action.parameters.spell.id, 'at', target.id);
            } else {
                this.sendTextEvent(creature.id, 'casts', action.parameters.spell.id, 'at', target.id);
            }
            break;
        }
        }
        this.sendTextEvent(evt.creature.id, 'used action', evt.action.id);
    }


    /**
     * Event handler : a creature is using an action
     * @param evt {CreatureUseItemEvent}
     */
    eventCombatUseItem (evt) {
        const {
            creature,
            target,
            spell,
            item
        } = evt;
        // if (action.parameters.item) {
        //     this.sendTextEvent(creature.id, 'uses item', action.parameters.item, 'that produces spell-like effect', action.parameters.spell.id, 'at', target.id);
        // } else {
        //     this.sendTextEvent(creature.id, 'casts', action.parameters.spell.id, 'at', target.id);
        // }
        // this.sendTextEvent(evt.creature.id, 'used action', evt.action.id);
    }

    /**
     * Event handler : a creature is selecting a weapon
     * @param evt {CreatureSelectWeaponEvent}
     */
    eventCreatureSelectWeapon (evt) {
        const weapon = evt.weapon;
        const tag = weapon.blueprint.ref;
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
            this.sendTextEvent(evt.target.id, 'hp left:', evt.target.getters.getHitPoints);
        } else if (evt.fumble) {
            this.sendTextEvent(
                evt.attacker.id, 'attacks', evt.target.id, bias, '**CRITICAL MISS**'
            );
        } else {
            this.sendTextEvent(
                evt.attacker.id, 'attacks', evt.target.id,
                'with', evt.weapon.blueprint.ref,
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
        this.sendTextEvent(
            creature.id, 'takes', amount, 'damages (' + damageType + ')' +
            ' - hp left:', creature.getters.getHitPoints
        );
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
        const CONSTS = this._manager.CONSTS;
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
        const CONSTS = this._manager.CONSTS;
        const e = this._manager.events;
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
        e.on(CONSTS.EVENT_CREATURE_ACTION, evt => {
            this.eventCombatAction(evt);
        });
        e.on(CONSTS.EVENT_CREATURE_USE_ITEM, evt => {
            this.eventCombatUseItem(evt);
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
        if (this._bVerbose) {
            this._events.emit('output', { output: aStrings });
        }
    }

    /**
     *
     * @param resref1 {string}
     * @param resref2 {string}
     * @returns {{ attacker: Creature, target: Creature }}
     */
    startCombat (resref1, resref2) {
        const c1 = this._manager.createEntity(resref1, resref1 + '-1');
        const c2 = this._manager.createEntity(resref2, resref2 + '-2');
        this._manager.startCombat(c1, c2);
        return {
            attacker: c1,
            target: c2
        };
    }

    doomloop () {
        this._manager.process();
    }

    get activeCombatCount () {
        return this._manager.combatManager.combats.length;
    }

    playCombat (ref1, ref2) {
        const DOOM_LOOP_IT_COUNT = Math.pow(2, 32);
        let combat, attacker, target;
        try {
            const time = process.hrtime();
            const sc = this.startCombat(ref1, ref2);
            attacker = sc.attacker;
            target = sc.target;
            combat = this._manager.getCreatureCombat(attacker);
            for (let i = 0; i < DOOM_LOOP_IT_COUNT; ++i) {
                this.doomloop();
                if (this.activeCombatCount === 0) {
                    this.sendTextEvent('exiting doom loop after', i, 'iterations.');
                    break;
                }
            }
            return {
                turns: combat.turn,
                time: process.hrtime(time),
                stats: [
                    {
                        dead: attacker.getters.getHitPoints <= 0,
                        hp: attacker.getters.getHitPoints,
                        maxhp: attacker.getters.getMaxHitPoints
                    },
                    {
                        dead: target.getters.getHitPoints <= 0,
                        hp: target.getters.getHitPoints,
                        maxhp: target.getters.getMaxHitPoints
                    }
                ]
            };
        } catch (e) {
            throw e;
        } finally {
            if (combat) {
                this._manager.destroyEntity(attacker);
                this._manager.destroyEntity(target);
            }
        }
    }

    benchmark (resref1, resref2) {
        const COMBAT_COUNT = 1000;
        const aStats = [];
        let time = process.hrtime();
        let nCC = 0;
        let nTurns = 0;
        for (let i = 0; i < COMBAT_COUNT; ++i) {
            this._bVerbose = false;
            const oStat = this.playCombat(resref1, resref2);
            aStats.push(oStat);
            ++nCC;
            nTurns += oStat.turns;
            this._bVerbose = true;
            const time2 = process.hrtime(time);
            if (time2[0] >= 1) {
                this.sendTextEvent('combat', i, 'of', COMBAT_COUNT, '(+' + nCC + ')', '; turns:', nTurns, ';', Math.round(1000 / nTurns) + 'ms per turn', '(' + Math.round(100 * i / COMBAT_COUNT) + '%)');
                time = process.hrtime();
                nCC = 0;
                nTurns = 0;
            }
        }
        this.sendTextEvent(100 + '%');
        const w1 = aStats.filter(({ stats: [a, d] }) => !a.dead && d.dead).length / COMBAT_COUNT;
        const w2 = aStats.filter(({ stats: [a, d] }) => !d.dead && a.dead).length / COMBAT_COUNT;
        const x1 = aStats.reduce((prev, { stats: [a, d] }) => prev + a.hp / a.maxhp, 0) / COMBAT_COUNT;
        const x2 = aStats.reduce((prev, { stats: [a, d] }) => prev + d.hp / d.maxhp, 0) / COMBAT_COUNT;
        this.sendTextEvent(resref1, 'wins', (w1 * 100).toFixed(2) + '%', 'hp left', (x1 * 100).toFixed(2) + '%');
        this.sendTextEvent(resref2, 'wins', (w2 * 100).toFixed(2) + '%', 'hp left', (x2 * 100).toFixed(2) + '%');
    }
}

module.exports = CombatSimulator;
