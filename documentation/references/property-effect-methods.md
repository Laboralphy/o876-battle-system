# Properties and Effects methods

## Effects

### init ({ effect, ... })

This method will be called on effect/property creation. `type` and `amp` will be set with proper values.



## Properties

### init ({ property, ... })

This method will be called on property creation. `type` and `amp` will be set with proper values.

### attack ({ property, item, creature, attack })

This method will be called when an attacker delivers an attack while having an item with this property.

### attacked ({ property, item, creature, attack })

This method is called when a target is attacked by an attacker.