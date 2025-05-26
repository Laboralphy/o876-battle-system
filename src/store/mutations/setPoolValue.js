/**
 * change a pool value
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param value {number}
 * @param pool {string}
 */
module.exports = ({ state, getters }, { pool, value }) => {
    if (isNaN(value)) {
        throw new Error('value is not a number: ' + value);
    }
    if (pool in state.pools) {
        state.pools[pool] = value;
    } else {
        throw new Error(`pool ${pool} is unknown`);
    }
};
