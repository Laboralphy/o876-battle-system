/**
 * @param state {RBSStoreState}
 * @returns {{ darkness: boolean, windy: boolean, difficultTerrain: boolean, underwater: boolean }}
 */
module.exports = state => state.environment;
