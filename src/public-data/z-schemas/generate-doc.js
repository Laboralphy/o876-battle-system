const LABELS = require('../labels');
const z = require('zod');

function getFieldDoc (oField) {
    let bRequired = true;
    let field = oField;
    const description = oField.description;
    if (oField.isOptional()) {
        bRequired = false;
        field = oField.unwrap();
    }
    const sType = field.def.type;
    const dx = {
        type: sType,
        required: bRequired
    };
    if (description) {
        dx.description = description;
    }
    switch (sType) {
    case 'literal': {
        // value: string
        dx.value = field.value;
        break;
    }
    case 'number': {
        // int: boolean
        // min: number
        // max: number
        dx.int = field.isInt;
        if (('minValue' in field) && field.minValue !== Number.MIN_SAFE_INTEGER) {
            dx.min = field.minValue;
        }
        if ('maxValue' in field && field.maxValue !== Number.MAX_SAFE_INTEGER) {
            dx.max = field.maxValue;
        }
        break;
    }
    case 'array': {
        dx.element = field.element.toString();
        break;
    }
    case 'object': {
        return generateDoc(field);
        // dx._dump = Object.keys(field.shape);
        // break;
    }
    case 'enum': {
        // options: array<{ value: string, description: string }>
        dx.options = field.options.map(s => ({
            value: s,
            description: LABELS.Values[s]
        }));
        break;
    }
    case 'union': {
        // options: array<>
        dx.options = field.options.map(o => getFieldDoc(o));
        break;
    }
    case 'optional': {
        Object.assign(dx, getFieldDoc(field.unwrap()));
        break;
    }
    }
    return dx;
}

/**
 *
 * @param schema {z.ZodObject}
 * @returns {string}
 */
function generateDoc(schema) {
    const { shape, description = '' } = schema;
    const d = {
        schema: description,
        properties: {}
    };
    for (const [key, oField] of Object.entries(shape)) {
        d.properties[key] = getFieldDoc(oField);
    }
    return d;
}

function _generateTemplate (oObject) {
    return {
        type: oObject.def.type,
        description: oObject.description || '',
        required: true
    };
}

function generateLiteralDoc (oLiteral) {
    if (oLiteral instanceof z.ZodLiteral) {
        return {
            ..._generateTemplate(oLiteral),
            value: oLiteral.value
        };
    } else {
        throw new TypeError('ZodLiteral expected');
    }
}

function generateNumberDoc (oNumber) {
    if (oNumber instanceof z.ZodNumber) {
        const d = _generateTemplate(oNumber);
        d.int = oNumber.isInt;
        if (d.int && oNumber.minValue !== Number.MIN_SAFE_INTEGER) {
            d.min = oNumber.minValue;
        }
        if (d.int && oNumber.maxValue !== Number.MAX_SAFE_INTEGER) {
            d.max = oNumber.maxValue;
        }
        if (!d.int && oNumber.minValue !== -Infinity) {
            d.min = oNumber.minValue;
        }
        if (!d.int && oNumber.maxValue !== Infinity) {
            d.max = oNumber.maxValue;
        }
        return d;
    } else {
        throw new TypeError('ZodNumber expected');
    }
}

function generateBooleanDoc (oBoolean) {
    if (oBoolean instanceof z.ZodBoolean) {
        return _generateTemplate(oBoolean);
    } else {
        throw new TypeError('ZodBoolean expected');
    }
}

function generateStringDoc (oString) {
    if (oString instanceof z.ZodString) {
        return _generateTemplate(oString);
    } else {
        throw new TypeError('ZodString expected');
    }
}

function generateObjectDoc (oObject) {
    if (oObject instanceof z.ZodObject) {
        const oShape = oObject.shape;
        const d = _generateTemplate(oObject);
        const properties = {};
        for (const [key, value] of Object.entries(oShape)) {
            properties[key] = generateUnknownDoc(value);
        }
        d.properties = properties;
        return d;
    } else {
        throw new TypeError('ZodObject expected');
    }
}

function generateOptionalDoc (oOptional) {
    if (oOptional instanceof z.ZodOptional) {
        const oUnwrapped = oOptional.unwrap();
        const d = generateUnknownDoc(oUnwrapped);
        d.description = oOptional.description || d.description;
        d.required = false;
        return d;
    } else {
        throw new TypeError('ZodOptional expected');
    }
}

function generateUnknownDoc (oUnknown) {
    switch (oUnknown.constructor.name) {
    case 'ZodLiteral': {
        return generateLiteralDoc(oUnknown);
    }
    case 'ZodNumber': {
        return generateNumberDoc(oUnknown);
    }
    case 'ZodString': {
        return generateStringDoc(oUnknown);
    }
    case 'ZodBoolean': {
        return generateBooleanDoc(oUnknown);
    }
    case 'Object': {
        return generateObjectDoc(oUnknown);
    }
    case 'ZodObject': {
        return generateObjectDoc(oUnknown);
    }
    case 'ZodOptional': {
        return generateOptionalDoc(oUnknown);
    }
    case 'ZodEnum': {
        return generateEnumDoc(oUnknown);
    }
    case 'ZodArray': {
        return generateArrayDoc(oUnknown);
    }
    case 'ZodDiscriminatedUnion':
    case 'ZodUnion': {
        return generateUnionDoc(oUnknown);
    }
    default: {
        throw new TypeError('Unsupported type ' + oUnknown.constructor.name);
    }
    }
}

function generateArrayDoc (oArray) {
    if (oArray instanceof z.ZodArray) {
        const d = _generateTemplate(oArray);
        d.element = generateUnknownDoc(oArray.element);
        return d;
    } else {
        throw new TypeError('ZodArray expected');
    }
}

function generateEnumDoc (oEnum) {
    if (oEnum instanceof z.ZodEnum) {
        const d = _generateTemplate(oEnum);
        d.options = oEnum.options;
        return d;
    } else {
        throw new TypeError('ZodEnum expected');
    }
}

function generateUnionDoc (oUnion) {
    const bRegularUnion = oUnion instanceof z.ZodUnion;
    const bDiscriminatedUnion = oUnion instanceof z.ZodDiscriminatedUnion;
    if (bRegularUnion || bDiscriminatedUnion) {
        const d = _generateTemplate(oUnion);
        if (bDiscriminatedUnion) {
            d.discriminator = oUnion.def.discriminator;
        }
        if (oUnion.options.every(s => s instanceof z.ZodLiteral)) {
            d.options = oUnion.options.map(s => {
                const { value, description = '' } = generateUnknownDoc(s);
                return { value, description };
            });
        } else {
            d.options = oUnion.options.map(s => generateUnknownDoc(s));
        }
        return d;
    } else {
        throw new TypeError('ZodUnion or ZodDiscriminatedUnion expected');
    }
}

module.exports = {
    generateLiteralDoc,
    generateNumberDoc,
    generateBooleanDoc,
    generateStringDoc,
    generateObjectDoc,
    generateUnknownDoc,
    generateOptionalDoc,
    generateArrayDoc,
    generateEnumDoc,
    generateUnionDoc
};
