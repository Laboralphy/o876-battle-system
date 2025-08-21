const z = require('zod');
const gd = require('./generate-doc');
const {generateObjectDoc, generateUnknownDoc} = require('./generate-doc');
const util = require('node:util');
const {Item} = require('./index');
const EntityBuilder = require('../EntityBuilder');


describe('generateLiteralDoc', () => {
    it('should generate a literal doc when submitting a ZodLiteral', function () {
        const l = z.literal('test-lit').describe('a literal');
        const d = gd.generateLiteralDoc(l);
        expect(d).toEqual({ type: 'literal', description: 'a literal', required: true, value: 'test-lit' });
    });
});

describe('generateNumberDoc', () => {
    it('should generate a number doc when submitting a ZodNumber', function () {
        const v = z.number().describe('a number');
        const d = gd.generateNumberDoc(v);
        expect(d).toEqual({
            type: 'number',
            description: 'a number',
            required: true,
            int: false
        });
    });
    it('doc should add min = 0 when number is .min(0)', function () {
        const v = z.number().min(0).describe('a positive number');
        const d = gd.generateNumberDoc(v);
        expect(d).toEqual({
            type: 'number',
            description: 'a positive number',
            required: true,
            int: false,
            min: 0
        });
    });
    it('should be an integer with min -10 and max +10', function () {
        const v = z.number().int().min(-10).max(10).describe('an int');
        const d = gd.generateNumberDoc(v);
        expect(d).toEqual({
            type: 'number',
            description: 'an int',
            required: true,
            int: true,
            min: -10,
            max: 10
        });
    });
});

describe('generateBooleanDoc', () => {
    it('should generate boolean doc', () => {
        const v = z.boolean().describe('a boolean');
        const d = gd.generateBooleanDoc(v);
        expect(d).toEqual({
            type: 'boolean',
            description: 'a boolean',
            required: true
        });
    });
});

describe('generateStringDoc', () => {
    it('should generate string doc', () => {
        const v = z.string().describe('a string');
        const d = gd.generateStringDoc(v);
        expect(d).toEqual({
            type: 'string',
            description: 'a string',
            required: true
        });
    });
});

describe('generateObjectDoc', () => {
    it('should generate object doc', () => {
        const v = z.object({
            id: z.string().describe('the string property : id')
        }).describe('an object with a property id: string');
        const d = gd.generateObjectDoc(v);
        expect(d).toEqual({
            type: 'object',
            description: 'an object with a property id: string',
            required: true,
            properties: {
                id: {
                    type: 'string',
                    description: 'the string property : id',
                    required: true
                }
            }
        });
    });
});

describe('generateUnknownDoc', () => {
    it('should generate the proper doc for any type', function () {
        expect(gd.generateUnknownDoc(z.number())).toMatchObject({ type: 'number' });
        expect(gd.generateUnknownDoc(z.string())).toMatchObject({ type: 'string' });
        expect(gd.generateUnknownDoc(z.boolean())).toMatchObject({ type: 'boolean' });
        expect(gd.generateUnknownDoc(z.literal('RRR'))).toMatchObject({ type: 'literal', value: 'RRR' });
    });
});

describe('generateOptionalDoc', () => {
    it('should generate object doc with an optional property', () => {
        const v = z.object({
            id: z.string().describe('the string property : id'),
            status: z.number().int().optional().describe('the optional property')
        }).describe('an object with a property id: string, and an optional property');
        const d = generateObjectDoc(v);
        expect(d).toEqual({
            type: 'object',
            description: 'an object with a property id: string, and an optional property',
            required: true,
            properties: {
                id: {
                    type: 'string',
                    description: 'the string property : id',
                    required: true
                },
                status: {
                    type: 'number',
                    description: 'the optional property',
                    required: false,
                    int: true
                }
            }
        });
    });
});

describe('generateArrayDoc', () => {
    it('should generate array doc', () => {
        const v = z.array(z.number().int().describe('numeric item description')).describe('a list of number');
        const d = gd.generateArrayDoc(v);
        expect(d).toEqual({
            type: 'array',
            description: 'a list of number',
            required: true,
            element: {
                type: 'number',
                description: 'numeric item description',
                required: true,
                int: true
            }
        });
    });
});

describe('generateEnumDoc', () => {
    it('should list all values of the enum', () => {
        const v = z.enum([
            'alpha', 'beta', 'gamma'
        ]);
        const d = gd.generateEnumDoc(v);
        expect(d).toEqual({
            type: 'enum',
            description: '',
            required: true,
            options: [ 'alpha', 'beta', 'gamma' ]
        });
    });
});

describe('generateUnionDoc', () => {
    it('should generate doc for union, with described options', () => {
        const v = z.union([
            z.literal('alpha').describe('a helium nucleus'),
            z.literal('beta').describe('a focused beam of electrons'),
            z.literal('gamma').describe('a focused beam of high energized photons')
        ]).describe('choose your radioactivity');
        const d = gd.generateUnionDoc(v);
        expect(d).toEqual({
            type: 'union',
            description: 'choose your radioactivity',
            required: true,
            options: [
                { value: 'alpha', description: 'a helium nucleus' },
                { value: 'beta', description: 'a focused beam of electrons' },
                {
                    value: 'gamma',
                    description: 'a focused beam of high energized photons'
                }
            ]
        });
    });
});


describe('check with items', function () {
    const Item = require('./item');
    it('should document a simple owner of an item', function () {
        const Owner = z.object({
            me: z.string().describe('owner\'s name'),
            item: Item
        });
        expect(generateUnknownDoc(Owner).properties.item.discriminator).toBe('itemType');
    });
});

describe('check dice expression', () => {
    const DiceExpression = require('./dice-expression');
    it('should generate proper dice expression documentation', () => {
        expect(generateUnknownDoc(DiceExpression)).toEqual({
            type: 'union',
            description: 'Valeur fixe, ou jet de dé',
            required: true,
            options: [
                {
                    type: 'number',
                    description: 'Valeur numérique fixe',
                    required: true,
                    int: true
                },
                {
                    type: 'string',
                    description: 'Valeur aléatoire en notation D&D (2d6+1, 1d20, 6d8...)',
                    required: true
                }
            ]
        });
    });
});

describe('Whats wrong with ammo-types', function () {
    const arrow = {
        'entityType': 'ENTITY_TYPE_PARTIAL_ITEM',
        'itemType': 'ITEM_TYPE_AMMO',
        'ammoType': 'AMMO_TYPE_ARROW',
        'weight': 0.1,
        'properties': [],
        'equipmentSlots': [
            'EQUIPMENT_SLOT_AMMO'
        ],
        'tag': 'ammo-type-arrow'
    };
    const arrowfire = {
        'entityType': 'ENTITY_TYPE_ITEM',
        'extends': [
            'ammo-type-arrow'
        ],
        'properties': [
            {
                'type': 'PROPERTY_DAMAGE_MODIFIER',
                'amp': '1d4',
                'damageType': 'DAMAGE_TYPE_FIRE'
            }
        ]
    };
    const EntityBuilder = require('../EntityBuilder');
    it ('should compose arrow fire and validate it', function () {
        const bps = new Map();
        bps.set('ammo-type-arrow', arrow);
        const bp1 = EntityBuilder.composeBlueprint(arrowfire, bps);
        expect(bp1).toEqual({
            entityType: 'ENTITY_TYPE_ITEM',
            itemType: 'ITEM_TYPE_AMMO',
            ammoType: 'AMMO_TYPE_ARROW',
            weight: 0.1,
            properties: [
                {
                    type: 'PROPERTY_DAMAGE_MODIFIER',
                    amp: '1d4',
                    damageType: 'DAMAGE_TYPE_FIRE'
                }
            ],
            equipmentSlots: [ 'EQUIPMENT_SLOT_AMMO' ],
            tag: 'ammo-type-arrow'
        });
        expect(() => Item.parse(bp1)).not.toThrow();
    });
});

describe('should validate gears', function () {
    it('should validate armor', function () {
        const armor = {
            'entityType': 'ENTITY_TYPE_ITEM',
            'itemType': 'ITEM_TYPE_ARMOR',
            'proficiency': 'PROFICIENCY_ARMOR_HEAVY',
            'ac': 6,
            'weight': 55,
            'properties': [
                {
                    'type': 'PROPERTY_ARMOR_CLASS_MODIFIER',
                    'amp': 1,
                    'damageType': 'DAMAGE_TYPE_SLASHING'
                },
                {
                    'type': 'PROPERTY_ARMOR_CLASS_MODIFIER',
                    'amp': -2,
                    'damageType': 'DAMAGE_TYPE_PIERCING'
                },
                {
                    'type': 'PROPERTY_ARMOR_CLASS_MODIFIER',
                    'amp': -1,
                    'damageType': 'DAMAGE_TYPE_CRUSHING'
                },
                {
                    'type': 'PROPERTY_MAX_DEXTERITY_BONUS',
                    'amp': 0
                },
                {
                    'type': 'PROPERTY_SKILL_MODIFIER',
                    'amp': -4,
                    'skill': 'SKILL_STEALTH'
                }
            ],
            'equipmentSlots': [
                'EQUIPMENT_SLOT_CHEST'
            ],
            'tag': 'arm-type-chain-mail'
        };
        expect(() => Item.parse(armor)).not.toThrow();
    });
    it('should validate belt', function () {
        const belt = {
            'entityType': 'ENTITY_TYPE_ITEM',
            'itemType': 'ITEM_TYPE_BELT',
            'proficiency': '',
            'weight': 1,
            'properties': [],
            'equipmentSlots': [
                'EQUIPMENT_SLOT_WAIST'
            ],
            'tag': 'gear-type-belt'
        };
        expect(() => Item.parse(belt)).not.toThrow();
    });
    it('should validate boots', function () {
        const boots = {
            ref: 'gear-boots',
            entityType: 'ENTITY_TYPE_ITEM',
            itemType: 'ITEM_TYPE_BOOTS',
            proficiency: '',
            weight: 4,
            properties: [],
            equipmentSlots: [ 'EQUIPMENT_SLOT_FEET' ],
            tag: 'gear-type-boots'
        };
        expect(() => Item.parse(boots)).not.toThrow();
    });
});
