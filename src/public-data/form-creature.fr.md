# Création d'entités

Il existe deux types d'entité
1) Les créatures
2) Les objets

Il est nécessaire de préalablement structurer un `blueprint` qui servira de modèle pour créer des 
instances d'entité à volonté. 

## Formulaire de blueprint de créature

### Sans modèle

Une créature peut être créée de toutes pièces à partir d'un ensemble de données, structuré dans un JSON.
Il est possible de créer un blueprint à partir d'un modèle, dans ce cas on utilisera un _formulaire avec extension_. 

#### Données à renseigner

| Donnée        | Type               | Requis | Valeur par défaut | Description              |
|---------------|--------------------|--------|-------------------|--------------------------|
| id            | string             | ✅      |                   | Identifiant              |
| ac            | int                | ✅      | 0                 | Classe d'armure          | 
| hd            | int                | ✅      | 6                 | Points de vie par niveau |
| classType     | Enum.ClassType     | ✅      |                   | Classe                   |                          
| level         | int                | ✅      | 1                 | Niveau                   |
| specie        | Enum.Specie        | ✅      |                   | Espèce                   |
| race          | Enum.Race          |        | "RACE_UNKNOWN"    | Race                     |
| speed         | int                | ✅      | 30                | Vitesse de déplacement   |      
| strength      | int                | ✅      | 8                 | Force                    |                                  
| dexterity     | int                | ✅      | 8                 | Dextérité                |                             
| constitution  | int                | ✅      | 8                 | Constitution             |
| intelligence  | int                | ✅      | 8                 | Intelligence             |
| wisdom        | int                | ✅      | 8                 | Sagesse                  |
| charisma      | int                | ✅      | 8                 | Charisme                 |
| proficiencies | Enum.Proficiency[] | ✅      | []                | Maîtrises                |
| equipment     | string[]           | ✅      | []                | Equipment                |
| properties    | Struct.Property[]  | ✅      | []                | Propriétés               |
| actions       | Struct.Action[]    | ✅      | []                | Actions                  |

#### Structure JSON à composer

```js
const creature = {
    entityType: 'ENTITY_TYPE_ACTOR',
    ac,
    hd,
    classType,
    level,
    specie,
    race,
    speed,
    abilities: {
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma
    },
    proficiencies,
    equipment,
    properties,
    actions
}
```

L'identifiant (id) servira à indexer la structure dans une collection de blueprints.

## Formulaire de création d'objets

### Sans modèle

