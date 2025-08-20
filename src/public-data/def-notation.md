# Definition notation

## Definition properties

| Property | Type    | Applicable when                 | Description                                                                                                             |
|----------|---------|---------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| required | boolean | always                          | If `true`, then this property is required and must have a value                                                         |
| type     | string  | always                          | This is the type name. It can be a simple type (int, string, float, boolean...) or a complex type (see `Types` section) |
| min      | number  | type is `int` or `float`        | This is the minimum numerical value of this property                                                                    |
| max      | number  | type is `int` or `float`        | This is the maximum numerical value of this property                                                                    |
| default  | any     | always                          | Property default value ; this value can be changed, provided that the property type is respected                        |
| value    | any     | always                          | A fixed constant value that cannot be changed for this property                                                         |
| switch   | object  | value comparable to a string    | An object which keys are compared to the value, the matching substructure is used                                       |


## Types

| Type           | Description                                                                                                     |
|----------------|-----------------------------------------------------------------------------------------------------------------|
| int            | An integer number                                                                                               |
| float          | A floating point value                                                                                          |
| string         | A string value                                                                                                  |
| boolean        | `true` or `false`                                                                                               |
| DiceExpression | Either an integer value, or a string representing a Dungeon and Dragon dice expression, like 1d6, 2d6, 1d8+4... |
| T[]            | An array of item of type _T_                                                                                    |
| _other_        | A reference to a complex type                                                                                   |
