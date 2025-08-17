# Create a spell

Spell are located in a module.

Default module is `magic`, but one can create its own module.

## Add an entry in `data`

In module folder `data` subfolder `spells`, add a json file with spell-id as a name.
The file mut contain this structure :

```json
{
  "school": "SCHOOL_ILLUSION",
  "level": 2,
  "range": 120,
  "hostile": false,
  "target": "SPELL_CAST_TARGET_TYPE_ALLY",
  "script": "spell-invisibility",
  "castingTime": "CASTING_TIME_ACTION"
}
```

- **school** : Can be one of these values :
  - SCHOOL_ABJURATION
  - SCHOOL_CONJURATION
  - SCHOOL_DIVINATION
  - SCHOOL_ENCHANTEMENT
  - SCHOOL_EVOCATION
  - SCHOOL_ILLUSION
  - SCHOOL_NECROMANCY
  - SCHOOL_TRANSMUTATION
- **level** : a number between 0 and 9. Level 0 spells also known as __cantrips__ may be cast at will, without using spell slots.
- **range** : a number, for a ranged spell 120 is a good value, for melee spells, 5 is a good value.
- **hostile** : a boolean. If _true_ the spell is considered as hostile, and will trigger aggressive reaction when cast on a creature.
- **target** : Can be one of these values :
  - SPELL_CAST_TARGET_TYPE_SELF : spell can be cast on self only
  - SPELL_CAST_TARGET_TYPE_ALLY : spell can be cast on allies (or self) only
  - SPELL_CAST_TARGET_TYPE_HOSTILE : spell can be cast on ennemies
- **script** : Script called when spell is cast
- **castingTime** : can be one of these values :
  - CASTING_TIME_ACTION : Spell casting takes on combat action
  - CASTING_TIME_BONUS_ACTION : Spell casting takes bonus action
  - CASTING_TIME_RITUAL : Spell casting takes longer action thus cannot be used in combat : does not consume spell slot
  - CASTING_TIME_REACTION : Spell casting is almost instant.

## Create a spell script

Spell script is located in the folder `scripts/spells` of the module.


