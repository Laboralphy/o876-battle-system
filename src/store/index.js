const getters = require('./getters');
const mutations = require('./mutations');
const buildState = require('./state');
const Store = require('@laboralphy/store');
const DEFAULT_EXTERNAL_DATA = require('../data');

require('./getters.doc');
require('./mutations.doc');

const MUTATION_PARAM_ORDER_PAYLOAD_CONTEXT = 1;
const MUTATION_PARAM_ORDER_CONTEXT_PAYLOAD = 2;

function buildStore ({
    externals = DEFAULT_EXTERNAL_DATA
} = {}) {
    return new Store({
        state: buildState(),
        getters,
        mutations,
        externals,
        config: {
            mutationParamOrder: MUTATION_PARAM_ORDER_CONTEXT_PAYLOAD
        }
    });
}

module.exports = {
    buildStore
};
