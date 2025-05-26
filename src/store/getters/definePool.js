module.exports = ({ state }, { pool, value = 0 }) => {
    if (pool in state.pools) {
        throw new Error(`pool ${pool} is already defined`);
    }
    state.pools[pool] = value;
};
