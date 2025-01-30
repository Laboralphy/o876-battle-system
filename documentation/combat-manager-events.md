# Combat Manager Events

## Default event payload


| Property      | Type          | Description                    |
|---------------|---------------|--------------------------------|
| combat        | Combat        | Instance of Combat             |
| turn          | number        | Combat elapsed turns           |
| tick          | number        | Turn elapsed ticks             |
| attacker      | Creature      | Instance of attacking Creature |
| target        | Creature      | Instance of attacked Creature  |
| combatManager | CombatManager | Instance of CombatManager      |

## combat.action

An action should be taken.

| Property          | Type         | Description                 |
|-------------------|--------------|-----------------------------|
| action            | RBSAction    |                             |
| action.id         | string       | Action identifier           |
| action.script      | string       | script to launch            |
| action.parameters | object       | parameter to pass to script |
| action.attackType | string       | ATTACK_TYPE_*               |
| action.range      | number       | action range                |

## combat.move

A creature is moving, and the client process can change final distance

| Property         | Type              | Description             |
|------------------|-------------------|-------------------------|
| previousDistance | number            | Distance before move    |
| speed            | number            | moving creature speed   |
| distance         | function(number)  | change final distance   |

## combat.distance

A creature has moved, this event tells about the new distance between attacker and target.

| Property         | Type   | Description             |
|------------------|--------|-------------------------|
| distance         | number | change final distance   |
| previousDistance | number | Distance before move    |

## combat.attack

A creature has attacked.

| Property    | Type    | Description                                     |
|-------------|---------|-------------------------------------------------|
| count       | number  | number of attacks                               |
| opportunity | boolean | This is a free attack because target is fleeing |

