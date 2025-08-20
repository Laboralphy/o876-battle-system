const z = require('zod');
const PROPERTY_REGISTRY = require('./registry');
module.exports = z.discriminatedUnion('type', Object.values(PROPERTY_REGISTRY));
