/**
 * define a new pool variable
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param pool {string}
 */
module.exports = ({ state, getters }, { pool }) => {
    if (!(pool in state.pools)) {
        state.pools[pool] = 0;
    }
};
