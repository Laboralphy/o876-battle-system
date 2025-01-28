# Manager events

## EVENT_COMBAT_START

Triggered when a combat is starting.

| Property         | Type              | Description                                                                       |
|------------------|-------------------|-----------------------------------------------------------------------------------|
| combat           | Combat            | The combat instance.                                                              |

## EVENT_COMBAT_MOVE

Trigerred when a creature wants to move.

| Property         | Type              | Description                                                                       |
|------------------|-------------------|-----------------------------------------------------------------------------------|
| combat           | Combat            | The combat instance.                                                              |
| distance(number) | function(number)  | This function may be called during event to alter default distance modification.  |
| previousDistance | number            | The distance before attacker moves toward target.                                 |

## EVENT_COMBAT_DISTANCE

Reports the distance change between attacker and target.

| Property      | Type      | Description                                        |
|---------------|-----------|----------------------------------------------------|
| combat        | Combat    | The combat instance                                |
| distance      | number    | New distance value between fighters.               |
| previousDistance | number | The previous distance value before attacker's move. |

## EVENT_COMBAT_TURN

Triggered when a new combat turn is starting 

| Property       | Type             | Description                                          |
|----------------|------------------|------------------------------------------------------|
| combat         | Combat           | The combat instance                                  |
| action(string) | function(string) | Select a action to be playe instead the default one. |

## EVENT_COMBAT_ATTACK

Triggered when a creature delivers an attack.

| Property       | Type             | Description                                          |
|----------------|------------------|------------------------------------------------------|
| attack         | AttackOutcome    | The attack outcome instance                          |



## EVENT_CREATURE_SELECT_WEAPON

Triggered when a creature selects an offensive slot.

| Property       | Type             | Description                     |
|----------------|------------------|---------------------------------|
| slot           | string           | New slot being selected         |
| previousSlot   | string           | Previous slot before this event |

## EVENT_CREATURE_DAMAGED

Triggered when a creature is damaged

| Property   | Type     | Description                                                   |
|------------|----------|---------------------------------------------------------------|
| amount     | number   | Amount of damage done.                                        |
| resisted   | number   | Amount of resisted damage.                                    |
| damageType | string   | Damage type (DAMAGE_TYPE_*).                                  |
| creature   | Creature | Creature suffering the damage                                 |
| source     | Creature | Creature delivering the damage                                |
| subtype    | string   | Effect subtype (EFFECT_SUBTYPE_*) could be weapon or magical. |

## EVENT_CREATURE_DAMAGED

Triggered when a creature hp drops to 0

| Property | Type     | Description                                                   |
|----------|----------|---------------------------------------------------------------|
| creature | Creature | Creature who is dead                                          |
| killer   | Creature | Creature who killed                                           |

