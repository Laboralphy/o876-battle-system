const { Manager } = require('../../index');

class Service {
    /**
     * @param parentPort {MessagePort}
     */
    constructor (parentPort) {
        /**
         * @type {Manager}
         * @private
         */
        this._manager = null;
        this._parentPort = parentPort;
        this._doomLoopId = 0;
    }

    /**
     * send back a response to parent port
     * @param requestId {string}
     * @param result {{}}
     */
    sendResponse (requestId,  result) {
        if (this._parentPort) {
            this._parentPort.postMessage({
                result,
                requestId
            });
        }
    }

    sendEventMessage (sEvent, oPayload) {
        if (this._parentPort) {
            this._parentPort.postMessage({
                event: sEvent,
                ...oPayload
            });
        }
    }

    defineHandlers () {
        this._parentPort.on('message', ({ requestId, opcode, request }) => this.query(requestId, opcode, request));
    }

    query (requestId, opcode, request) {
        const sMeth = 'opcode' + opcode;
        if (sMeth in this) {
            const result = this[sMeth](request);
            if (this._parentPort) {
                return this.sendResponse(requestId, result);
            } else {
                return result;
            }
        } else {
            throw new Error(`opcode ${opcode} is unknown`);
        }
    }

    defineManagerHandler () {
        const CONSTS = this._manager.CONSTS;
        const e = this._manager.events;
        e.on(CONSTS.EVENT_COMBAT_START, evt => {
            const { attacker, target } = evt;
            this.sendEventMessage(CONSTS.EVENT_COMBAT_START, {
                attacker: attacker.id,
                target: target.id
            });
        });
        e.on(CONSTS.EVENT_COMBAT_MOVE, evt => {
            const {
                speed,
                attacker,
                target,
                distance
            } = evt;
            this.sendEventMessage(CONSTS.EVENT_COMBAT_MOVE, {
                attacker: attacker.id,
                target: target.id,
                speed,
                distance
            });
        });
        e.on(CONSTS.EVENT_COMBAT_TURN, evt => {
            const {
                combat
            } = evt;
            this.sendEventMessage(CONSTS.EVENT_COMBAT_TURN, {
                attacker: combat.attacker.id,
                target: combat.target.id,
                turn: combat.turn
            });
        });
        e.on(CONSTS.EVENT_CREATURE_ACTION, ({
            creature,
            target,
            action
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_ACTION, {
                creature: creature.id,
                target: target.id,
                action: action.id
            });
        });
        e.on(CONSTS.EVENT_CREATURE_USE_ITEM, ({
            creature,
            target,
            spell
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_USE_ITEM, {
                creature: creature.id,
                target: target.id,
                spell: spell.id
            });
        });
        e.on(CONSTS.EVENT_CREATURE_CAST_SPELL, ({
            creature,
            target,
            spell,
            freeCast
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_CAST_SPELL, {
                creature: creature.id,
                target: target.id,
                spell: spell.id,
                freeCast
            });
        });
        e.on(CONSTS.EVENT_CREATURE_START_INCANTATION, ({
            creature,
            target,
            spell,
            freeCast
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_START_INCANTATION, {
                creature: creature.id,
                target: target.id,
                spell: spell.id,
                freeCast
            });
        });
        e.on(CONSTS.EVENT_CREATURE_SELECT_WEAPON, ({
            creature,
            weapon
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_SELECT_WEAPON, {
                creature: creature.id,
                weapon: weapon.id
            });
        });
        e.on(CONSTS.EVENT_COMBAT_ATTACK, ({ attack }) => {
            /**
             * @var {AttackOutcome}
             */
            const oAttackOutcome = attack;
            const {
                attacker,
                target,
                weapon,
                ammo,
                spell,
                ac,
                roll,
                hit,
                attackBonus,
                range,
                sneak,
                opportunity,
                rush,
                improvised,
                visibility,
                ability,
                rollBias,
                attackType,
                critical,
                lethal,
                failed,
                failure,
                damages
            } = attack;
            this.sendEventMessage(CONSTS.EVENT_COMBAT_ATTACK, {
                // who is concerned
                attacker: attacker.id,
                target: target.id,
                // mean of attack
                weapon: weapon?.id ?? null,
                ammo: ammo?.id ?? null,
                spell: spell?.id ?? null,
                // Hit calculation
                ac,
                ability,
                attackType,
                attackBonus,
                roll,
                rollBias: {
                    advantages: Array.from(rollBias.advantages),
                    disadvantages: Array.from(rollBias.disadvantages),
                    result: rollBias.result
                },
                hit,
                // Some context
                range,
                sneak,
                opportunity,
                rush,
                improvised,
                visibility,
                critical,
                lethal,
                failed,
                failure,
                damages
            });
        });
        e.on(CONSTS.EVENT_CREATURE_DAMAGED, ({
            creature,
            source,
            amount,
            resisted,
            damageType
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_DAMAGED, {
                creature: creature.id,
                source : source.id,
                amount,
                resisted,
                damageType
            });
        });
        e.on(CONSTS.EVENT_CREATURE_DEATH, ({
            creature,
            killer
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_DAMAGED, {
                creature: creature.id,
                killer : killer.id
            });
        });
        e.on(CONSTS.EVENT_CREATURE_SAVING_THROW, ({
            creature,
            roll,
            rollBias,
            dc,
            success,
            ability,
            bonus
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_SAVING_THROW, {
                creature: creature.id,
                roll,
                rollBias,
                dc,
                success,
                ability,
                bonus
            });
        });
        e.on(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, ({
            creature,
            effect
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, {
                creature: creature.id,
                effect
            });
        });
        e.on(CONSTS.EVENT_CREATURE_EFFECT_EXPIRED, ({
            creature,
            effect
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_EFFECT_EXPIRED, {
                creature: creature.id,
                effect
            });
        });
        e.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM, ({
            creature,
            item,
            slot
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                creature: creature.id,
                item: item?.id ?? '',
                slot
            });
        });
        e.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM, ({
            creature,
            item,
            slot
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_REMOVE_ITEM, {
                creature: creature.id,
                item: item?.id ?? '',
                slot
            });
        });
        e.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, ({
            creature,
            item,
            slot,
            cursedItem
        }) => {
            this.sendEventMessage(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, {
                creature: creature.id,
                item: item?.id ?? '',
                slot,
                cursedItem: cursedItem?.id ?? ''
            });
        });
    }

    startDoomLoop () {
        this.stopDoomLoop();
        this._doomLoopId = setInterval(() => this._manager.process());
    }

    stopDoomLoop () {
        if (this._doomLoopId) {
            clearInterval(this._doomLoopId);
            this._doomLoopId = 0;
        }
    }

    _success () {
        return { error: false };
    }

    _error (sError) {
        return { error: sError };
    }


    _getCreature (idCreature) {
        const oCreature = this._manager.getEntity(idCreature);
        this._manager.checkEntityCreature(oCreature);
        return oCreature;
    }

    _getItem (idItem) {
        const oItem = this._manager.getEntity(idItem);
        this._manager.checkEntityItem(oItem);
        return oItem;
    }


    //  ▄▄
    // ▐▌▝▘▗▛▜▖▐▛▜▖▗▛▜▖
    // ▐▌▗▖▐▌▐▌▐▌  ▐▛▀▘
    //  ▀▀  ▀▀ ▝▘   ▀▀

    /**
     * Starts a new Manager instance with configuration
     * @param modules {string[]}
     * @return {{}}
     */
    opcodeInit ({
        modules = []
    }) {
        this._manager = new Manager();
        for (const m of modules) {
            this._manager.loadModule(m);
        }
        this._manager.initFactions();
        this.startDoomLoop();
        return this._success();
    }

    /**
     * Shuts down current Manager instance
     * @returns {{error: boolean|string}}
     */
    opcodeShutdown () {
        this.stopDoomLoop();
        return this._success();
    }

    /**
     * Returns manager version
     * @returns {{version: string}}
     */
    opcodeGetVersion () {
        return {
            version: this._manager.version
        };
    }



    // ▗▄▄▖     ▗▖  ▗▖  ▗▖  ▗▖
    // ▐▙▄ ▐▛▜▖▝▜▛▘ ▄▖ ▝▜▛▘ ▄▖ ▗▛▜▖▗▛▀▘
    // ▐▌  ▐▌▐▌ ▐▌  ▐▌  ▐▌  ▐▌ ▐▛▀▘ ▀▜▖
    // ▝▀▀▘▝▘▝▘  ▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▀▀

    opcodeCreateEntity ({ resref, id }) {
        const oEntity = this._manager.createEntity(resref, id);
        return { id: oEntity.id };
    }

    opcodeDestroyEntity({ creature }) {
        const oEntity = this._manager.getEntity(creature);
        this._manager.destroyEntity(oEntity);
        return { id: oEntity.id };
    }

    opcodeGetCreatureVitals ({ creature }) {
        const oCreature = this._getCreature(creature);
        const g = oCreature.getters;
        const abilities = g.getAbilities;
        const abilityBaseValues = g.getAbilityBaseValues;
        const abilityModifiers = g.getAbilityModifiers;
        return {
            level: g.getUnmodifiedLevel,
            classType: g.getClassType,
            specie: g.getSpecie,
            hitPoints: g.getHitPoints,
            maxHitPoints: g.getMaxHitPoints,
            armorClass: g.getArmorClass,
            conditions: [...g.getConditionSet],
            attackBonus: g.getAttackBonus,
            proficiencyBonus: g.getProficiencyBonus,
            proficiencies: [...g.getProficiencySet],
            abilities: Object.entries(abilities).map(([sAbility, nValue]) => ({
                base: abilityBaseValues[sAbility],
                value: nValue,
                modifier: abilityModifiers[sAbility]
            })),
            equipment: g.getEquipment
        };
    }

    /**
     * Returns distance between two creatures
     * @param creature1 {Creature}
     * @param creature2 {Creature}
     * @returns {{distance: number}}
     */
    opcodeGetDistanceBetweenCreatures ({ creature1, creature2 }) {
        const oCreature1 = this._getCreature(creature1);
        const oCreature2 = this._getCreature(creature2);
        return { distance: this._manager.getCreatureDistance(oCreature1, oCreature2) };
    }

    /**
     * Return data about an item
     * @param item {string}
     * @returns {{item: RBSItem}}
     */
    opcodeGetItemData ({ item }) {
        /**
         * @type {RBSItem}
         */
        const oItem = this._manager.getEntity(item);
        this._manager.checkEntityItem(oItem);
        return {
            item
        };
    }

    // ▗▄▄▖         ▗▖  ▗▖
    // ▐▙▄  ▀▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▌  ▗▛▜▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘   ▀▀▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀
    // Factions

    opcodeGetCreatureFaction ({ creature }) {
        const oCreature = this._getCreature(creature);
        const oFaction = this._manager.getCreatureFaction(oCreature);
        return {
            faction: oFaction?.id ?? ''
        };
    }

    opcodeSetCreatureFaction ({ creature, faction }) {
        const oCreature = this._getCreature(creature);
        this._manager.setCreatureFaction(oCreature, faction);
        return {
            faction
        };
    }

    opcodeGetCreatureLocation ({ creature }) {
        const oCreature = this._getCreature(creature);
        return {
            location: this._manager.horde.getCreatureLocation(oCreature)
        };
    }

    opcodeSetCreatureLocation ({ creature, location }) {
        const oCreature = this._getCreature(creature);
        this._manager.horde.setCreatureLocation(oCreature, location);
        return {
            location
        };
    }

    opcodeGetCreatureRoomOccupants ({ creature }) {
        const oCreature = this._getCreature(creature);
        return {
            allies: this._manager.getFriendlyCreatures(oCreature).map(c => c.id),
            hostile: this._manager.getHostileCreatures(oCreature).map(c => c.id)
        };
    }

    // ▗▄▄▖         ▗▖                          ▗▖
    // ▐▙▄ ▐▛▜▖▐▌▐▌ ▄▖ ▐▛▜▖▗▛▜▖▐▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘▗▛▀▘
    // ▐▌  ▐▌▐▌▝▙▟▘ ▐▌ ▐▌  ▐▌▐▌▐▌▐▌▐▛▛█▐▛▀▘▐▌▐▌ ▐▌  ▀▜▖
    // ▝▀▀▘▝▘▝▘ ▝▘  ▀▀ ▝▘   ▀▀ ▝▘▝▘▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘▝▀▀

    opcodeSetLocationEnvironments ({ location, environments }) {
        this._manager.horde.setLocationEnvironments(location, environments);
    }

    // ▗▄▄▖         ▄▖      ▗▖  ▗▖
    // ▐▙▄ ▐▌▐▌▗▛▜▖ ▐▌ ▐▌▐▌▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖
    // ▐▌  ▝▙▟▘▐▌▐▌ ▐▌ ▐▌▐▌ ▐▌  ▐▌ ▐▌▐▌▐▌▐▌
    // ▝▀▀▘ ▝▘  ▀▀  ▀▀  ▀▀▘  ▀▘ ▀▀  ▀▀ ▝▘▝▘
    // Evolution

    opcodeIncreaseCreatureXP ({ creature, xp }) {
        const oCreature = this._getCreature(creature);
        this._manager.increaseCreatureExperience(oCreature, xp);
        return {
            xp: this._manager.evolution.getXP(oCreature)
        };
    }

    //  ▄▄         ▗▖       ▗▖
    // ▐▌▝▘▗▛▜▖▐▙▟▙▐▙▄  ▀▜▖▝▜▛▘▗▛▀▘
    // ▐▌▗▖▐▌▐▌▐▛▛█▐▌▐▌▗▛▜▌ ▐▌  ▀▜▖
    //  ▀▀  ▀▀ ▝▘ ▀▝▀▀  ▀▀▘  ▀▘▝▀▀
    // Combats

    opcodeStartCombat ({ attacker, target }) {
        const oAttacker = this._getCreature(attacker);
        const oTarget = this._getCreature(target);
        const oCombat = this._manager.startCombat(oAttacker, oTarget);
        return {
            combat: oCombat.id,
            distance: oCombat.distance
        };
    }

    opcodeEndCombat ({ attacker, bothSides = false }) {
        const oAttacker = this._getCreature(attacker);
        this._manager.endCombat(oAttacker, bothSides);
        return this._success();
    }

    opcodeGetCreatureCombatInfo ({ attacker }) {
        const oAttacker = this._getCreature(attacker);
        const oCombat = this._manager.getCreatureCombat(oAttacker);
        if (oCombat) {
            return {
                id: oCombat.id,
                attacker: oAttacker.id,
                target: oCombat.target.id,
                turn: oCombat.turn,
                tick: oCombat.tick,
                distance: oCombat.distance
            };
        } else {
            return this._error('ERR_NOT_IN_COMBAT');
        }
    }

    opcodeCombatApproach ({ attacker }) {
        const oAttacker = this._getCreature(attacker);
        const oCombat = this._manager.getCreatureCombat(oAttacker);
        const speed = oAttacker.getters.getSpeed;
        this._manager.approachTarget(oAttacker, speed);
        return {
            attacker,
            target: oCombat.target.id,
            distance: oCombat.distance,
            speed
        };
    }

    opcodeCombatRetreat ({ attacker }) {
        const oAttacker = this._getCreature(attacker);
        const oCombat = this._manager.getCreatureCombat(oAttacker);
        const speed = oAttacker.getters.getSpeed;
        this._manager.approachTarget(oAttacker, speed);
        return {
            attacker,
            target: oCombat.target.id,
            distance: oCombat.distance,
            speed
        };
    }

    //  ▗▖      ▗▖  ▗▖
    // ▗▛▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▙▟▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘▝▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀

    opcodeDoAction ({ creature, target, action }) {
        const oCreature = this._getCreature(creature);
        const oTarget = this._getCreature(target);
        const oOutcome = this._manager.doAction(oCreature, action, oTarget);
        if (oOutcome.failure) {
            return this._error(oOutcome.reason);
        } else {
            return this._success();
        }
    }

    // ▗▖ ▄         ▗▖          ▟▜▖     ▄▄          ▄▖  ▄▖                  ▗▖  ▗▖
    // ▐█▟█ ▀▜▖▗▛▜▌ ▄▖ ▗▛▀      ▟▛     ▝▙▄ ▐▛▜▖▗▛▜▖ ▐▌  ▐▌     ▗▛▀  ▀▜▖▗▛▀▘▝▜▛▘ ▄▖ ▐▛▜▖▗▛▜▌
    // ▐▌▘█▗▛▜▌▝▙▟▌ ▐▌ ▐▌      ▐▌▜▛      ▐▌▐▙▟▘▐▛▀▘ ▐▌  ▐▌     ▐▌  ▗▛▜▌ ▀▜▖ ▐▌  ▐▌ ▐▌▐▌▝▙▟▌
    // ▝▘ ▀ ▀▀▘▗▄▟▘ ▀▀  ▀▀      ▀▘▀     ▀▀ ▐▌   ▀▀  ▀▀  ▀▀      ▀▀  ▀▀▘▝▀▀   ▀▘ ▀▀ ▝▘▝▘▗▄▟▘

    opcodeCastSpell ({ creature, target, spell }) {
        const oCreature = this._getCreature(creature);
        const oTarget = this._getCreature(target);
        const oOutcome = this._manager.doAction(oCreature, spell, oTarget);
        if (oOutcome.failure) {
            return this._error(oOutcome.reason);
        } else {
            return this._success();
        }
    }

    opcodeGetSpellData ({ spell }) {
        const oSpellData = this._manager.getSpellData(spell);
        if (oSpellData) {
            return {
                oSpellData
            };
        } else {
            return this._error('ERR_UNKNOWN_SPELL');
        }
    }

    // ▗▄▄▖ ▗▖                  ▟▜▖                 ▗▖                  ▗▖
    //  ▐▌ ▝▜▛▘▗▛▜▖▐▙▟▙▗▛▀▘     ▟▛     ▗▛▜▖▗▛▜▌▐▌▐▌ ▄▖ ▐▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    //  ▐▌  ▐▌ ▐▛▀▘▐▛▛█ ▀▜▖    ▐▌▜▛    ▐▛▀▘▝▙▟▌▐▌▐▌ ▐▌ ▐▙▟▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘  ▀▘ ▀▀ ▝▘ ▀▝▀▀      ▀▘▀     ▀▀   ▐▌ ▀▀▘ ▀▀ ▐▌  ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘

    opcodeUseItem ({ creature, target, item }) {
        const oCreature = this._getCreature(creature);
        const oTarget = this._getCreature(target);
        const oItem = this._getItem(item);
        const oOutcome = this._manager.useItem(oCreature, oItem, oTarget);
        if (oOutcome.failure) {
            return this._error(oOutcome.reason);
        } else {
            return this._success();
        }
    }

    opcodeEquipItem ({ creature, item, bypassCurse = false }) {
        const oCreature = this._getCreature(creature);
        const oItem = this._getItem(item);
        const r = oCreature.equipItem(oItem, bypassCurse);
        return {
            previousItem: r.previousItem?.id ?? '',
            item: r.newItem?.id ?? '',
            slot: r.slot,
            cursed: r.cursed
        };
    }

    opcodeUnequipItem ({ creature, item, bypassCurse = false }) {
        const oCreature = this._getCreature(creature);
        const oItem = this._getItem(item);
        const r = oCreature.removeItem(oItem, bypassCurse);
        return {
            item: r.previousItem?.id ?? '',
            slot: r.slot,
            cursed: r.cursed
        };
    }
}

module.exports = Service;
