module.exports = {
    'int': {
        description: 'An integer value',
        examples: [0, 10, 5],
    },
    'float': {
        description: 'A float value, usually used for factors and multipliers',
        examples: [0, 0.1, 2, 1.3]
    },
    'string': {
        description: 'A string value',
        examples: ['a-example-of-string', 'abcdef0123456789', 'AN_IDENTIFIER']
    },
    'boolean': {
        description: 'A boolean value',
        examples: ['true', 'false'],
    },
    'T[]': {
        description: 'An array of T, each item of this array is of type T. string[], int[] is valid syntax. Enum.Something[] is also a valid syntax'
    },
    'DiceExpression': {
        description: 'An integer fixed value or a dice expression. this kind of notation is often used in D&D literature',
        examples: ['1d20', 10, 2, '3d6', '1d6+2', 8, '2d12']
    }
};
