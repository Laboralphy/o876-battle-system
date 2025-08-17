const BLUEPRINTS = require('./blueprints');

const BLUEPRINT_KEYS = Object.keys(BLUEPRINTS);

module.exports = {
    classTypes: BLUEPRINT_KEYS.filter(c => c.startsWith('class-type-')),
    commonProperties: BLUEPRINT_KEYS.filter(c => c.startsWith('cp-'))
};
