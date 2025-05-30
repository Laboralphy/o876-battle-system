/**
 * Renvoie la liste des slots offensifs pouvant servir à une attaque
 * @param state {RBSStoreState}
 * @returns {{ [idPool: string]: number }}
 */
module.exports = state => state.pools;
