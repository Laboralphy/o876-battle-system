# Abilities

## List of abilities

Six abilities provide a quick description of every creature’s physical and mental characteristics:

- __Strength__ : measuring physical power
- __Dexterity__ : measuring agility, reflexes, dodge
- __Constitution__ : measuring endurance, hit points, resistance to poison and disease
- __Intelligence__ : measuring reasoning and memory
- __Wisdom__ : measuring perception and insight
- __Charisma__ : measuring force of personality

## Hard coded rules

### Strength

- __Melee weapon efficiency__ : Both attack bonus and damage bonus increase when attacking with a melee weapon. 
- __Carrying capacity__ : One can carry more, with a higher strength score.
- __Saving throw vs. Paralysis__ : Each turn one can save against strength/paralysis to get rid of effect. 
This is hard coded in `EFFECT_PARALYSIS` 

### Dexterity

- __Armor Class__ : Better dexterity is better armor class, however dexterity bonus for AC is limited by type of armor.
The `PROPERTY_MAX_DEXTERITY_BONUS` is applied to medium and heavy armors.
- __Ranged weapon accuracy__ : Dexterity increase attack bonus when using ranged weapon.

### Constitution

- __Hit Points__ : More hit points per level
- __Saving throw vs. disease__ : `EFFECT_DISEASE` is applied when saving throw vs. constitution/disease fails.

### Intelligence

There is currently no use for intelligence in hard coded rules, but could be used as ...

- Spell casting offensive ability : improve spell difficulty class, for academic magic users.
- Skill bonus : a large amount of skill actually makes use of high intelligence, like History, Arcana, Religion...

### Wisdom

There is currently no use for wisdom in hard coded rules, but could be used as ...

- Spell casting offensive ability : improve spell difficulty class, for divine casters.
- Skill bonus : a large amount of skill actually makes use of high wisdom, like Medicine, Survival, Perception...

### Charisma

There is currently no use for charisma in hard coded rules, but could be used as ...

- Spell casting offensive ability : improve spell difficulty class, for exotic and intuitive magic user (warlocks, bards and sorcerers).
- Skill bonus : a large amount of skill actually makes use of high wisdom, like Medicine, Survival, Perception...


## Scores and Modifiers 

| Score | Modifier |
|-------|----------|
| 1     | -5       |
| 2-3   | -4       |
| 4-5   | -3       |
| 6-7   | -2       |
| 8-9   | -1       |
| 10-11 | +0       |
| 12-13 | +1       |
| 14-15 | +2       |
| 16-17 | +3       |
| 18-19 | +4       |
| 20-21 | +5       |
| 22-23 | +6       |
| 24-25 | +7       |
| 26-27 | +8       |
| 28-29 | +9       |
| 30    | +10      |

## Ability checks

An ability check is mainly used in dialogs to resolve a general task.
The table below is OK to be used for skill check as well 

### Typical Difficulty Classes 

| Task Difficulty   | DC |
|-------------------|----|
| Very easy         | 5  |
| Easy              | 10 |
| Medium            | 15 |
| Hard              | 20 |
| Very hard         | 25 |
| Nearly impossible | 30 |

