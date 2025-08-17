module.exports = {
    'int': {
        description: 'an integer value',
        examples: [0, 10, 5],
    },
    'float': {
        description: 'a float value, usually used for factors and multipliers',
        examples: [0, 0.1, 2, 1.3]
    },
    'string': {
        description: 'a string value',
        examples: ['a-example-of-string', 'abcdef0123456789', 'AN_IDENTIFIER']
    },
    'boolean': {
        description: 'a boolean value',
        examples: ['true', 'false'],
    },
    'Array<T>': {
        description: 'an array of T, each item of this array is of type T'
    },
    'DiceExpression': {
        description: 'can be an integer value or a dice expression. this kind of notation is often used in D&D literature',
        examples: ['1d20', '3d6', '1d6+2', '2d12']
    }
};
