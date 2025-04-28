# o876-battle-system (en)

Library for resolving combats according to the rules of Dungeons and Dragons 5th edition OGL.

## Disclaimer

This library (Combat System) consists of a set of classes intended to be embedded in an application that needs to orchestrate virtualized combats between creatures according to the rules defined in the 5th edition of Dungeons and Dragons.

All resources defining creatures or objects are:
- Derived from the Open Gaming License (OGL) version of the reference document system.
- Invented and not derived from any official WoTC book or bestiary.

## Basic Principles

To resolve combats, creatures and their equipment are instantiated. Then, a combat is created for two creatures. The combat can then be advanced (it lasts over time). Combat progresses turn by turn. The combat system triggers events to indicate how the combat evolves.

## General Features

The combat system allows you to:
- Create creatures or equippable items from resource files (blueprints).
- Configure these creatures, assign experience levels, modify characteristics.
- Equip these creatures with items such as weapons, armor, or shields, among others.
- Instantiate a combat and supervise its progression, influence the trajectory of the combat to simulate the reactions of the creatures.
- Obtain detailed information about the combat's progression.

## Scope of This Documentation

This documentation covers the facade API of the combat system. It does not cover all the inner classes and complex mechanisms that govern the combat's progression, for clarity reasons.

## API Documentation

The API is a structure offering methods grouped into categories.

### Example Usage
```js
const API = require('../../API');

// Instantiate the API
const api = new API();
const core = api.services.core
// Load the "classic" module allowing the addition of resources associated with the "classic" setting (blueprints of creatures and objects)
core.loadModule('classic');

// Declare events
core.events.on(core.CONSTS.EVENT_COMBAT_START, evt => {
    // Handle combat start
});
core.events.on(core.CONSTS.EVENT_COMBAT_ATTACK, evt => {
    // Handle when an attack occurs
});

// Create creatures
const c1 = api.services.entities.createEntity('c-goblin', 'c-1');
const c2 = api.services.entities.createEntity('c-zombie', 'c-2');
api.services.combats.startCombat(c1, c2);

// As long as there are active combats
while (core.combats.count > 0) {
    core.process() // Advance combats by one tick
}
```
### Core

This service provides access to the event manager, manager, and certain constant verification functions.

#### Property `CONSTS`

This object contains all the constants used by the combat system. When referring to constants or groups of constants, 
we are referring to properties of this object.

#### Property `events`

This property is an instance of the Node event manager. Using its `.on` sub-method, you can attach event handlers.

See the __events__ section for a list of events.

#### Property `manager`

This property refers to the instance of the __manager__, allowing access to internal functionalities of the combat system. 
Normally, it is not used, and its methods/properties are not documented in this file.

#### Method `loadModule`

```typescript
loadModule(sModule: string);
```

This method loads a standard combat system module from the file system.

Loading the __classic__ module:
```js
api.core.loadModule('classic');
```

In future versions, there will be other modules:
- __modern__: Provides blueprints for modern weapons and armor, and urban adversaries.
- __future__: Provides a futuristic setting with science fiction equipment.

#### Method `defineModule`

```typescript
defineModule(oModule);
```

Allows adding a module to the system by specifying an object containing all the resources.

The parameter structure should be:
```json
{
  "blueprints": {}, // Contains blueprints validating the "blueprint-item" or "blueprint-actor" schema
  "data": {}, // Contains free data
  "scripts": {} // Contains "functions"
}
```

#### Method `process`

This method advances the combats and triggers corresponding events based on what happens in each combat.

```js
api.core.process();
```
