const oModules = require('./modules');

const oBlueprints = {};

for (const module of Object.values(oModules)) {
    Object.assign(oBlueprints, module.blueprints);
}

module.exports = oBlueprints;
